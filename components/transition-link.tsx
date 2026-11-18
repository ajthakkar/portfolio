"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ComponentProps, type MouseEvent } from "react";

/* Page navigations run inside a View Transition when the browser supports it:
   the old page fades out, the new one rises in, and elements that share a
   --vt-name (like a case title) morph between pages. */

let resolvePending: (() => void) | null = null;

function finishPending() {
  resolvePending?.();
  resolvePending = null;
}

/** Mounted once in the layout. Ends the running transition when the new route renders. */
export function NavigationEvents() {
  const pathname = usePathname();
  useEffect(() => {
    finishPending();
  }, [pathname]);
  return null;
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function navigateWithTransition(href: string, push: (href: string) => void, currentPath: string) {
  const url = new URL(href, window.location.href);
  const samePage = url.pathname.replace(/\/$/, "") === currentPath.replace(/\/$/, "");
  if (!document.startViewTransition || prefersReducedMotion() || samePage) {
    push(href);
    return;
  }
  const root = document.documentElement;
  root.dataset.vt = "nav";
  const transition = document.startViewTransition(
    () =>
      new Promise<void>((resolve) => {
        resolvePending = resolve;
        push(href);
        window.setTimeout(finishPending, 900);
      }),
  );
  transition.finished.finally(() => {
    if (root.dataset.vt === "nav") delete root.dataset.vt;
  });
}

type Props = ComponentProps<typeof Link> & { href: string };

export function TransitionLink({ href, onClick, ...props }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:")) return;
    event.preventDefault();
    navigateWithTransition(href, router.push, pathname);
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
