"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Chess, type Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import { RotateCcw } from "lucide-react";
import { puzzle } from "@/lib/content";
import { useIsDark } from "./theme";

type Status = "playing" | "wrong" | "solved";

const toMove = (uci: string) => ({ from: uci.slice(0, 2) as Square, to: uci.slice(2, 4) as Square });

export default function Puzzle() {
  const game = useRef(new Chess(puzzle.fen));
  const [fen, setFen] = useState(puzzle.fen);
  const [ply, setPly] = useState(0);
  const [status, setStatus] = useState<Status>("playing");
  const [selected, setSelected] = useState<Square | null>(null);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [shaking, setShaking] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [width, setWidth] = useState(320);
  const boxRef = useRef<HTMLDivElement>(null);
  const dark = useIsDark();

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const reset = () => {
    game.current = new Chess(puzzle.fen);
    setFen(puzzle.fen);
    setPly(0);
    setStatus("playing");
    setSelected(null);
    setLastMove(null);
    setShowHint(false);
  };

  const tryMove = (from: Square, to: Square) => {
    if (status === "solved") return false;
    const expected = toMove(puzzle.solution[ply]);
    if (from !== expected.from || to !== expected.to) {
      // Only count it as a wrong try if it was a legal move.
      const legal = game.current.moves({ verbose: true }).some((m) => m.from === from && m.to === to);
      if (legal) {
        setStatus("wrong");
        setShaking(true);
      }
      setSelected(null);
      return false;
    }

    game.current.move({ from, to, promotion: "q" });
    setFen(game.current.fen());
    setLastMove({ from, to });
    setSelected(null);

    const nextPly = ply + 1;
    if (nextPly >= puzzle.solution.length) {
      setPly(nextPly);
      setStatus("solved");
      return true;
    }

    setStatus("playing");
    // The opponent's scripted reply.
    window.setTimeout(() => {
      const reply = toMove(puzzle.solution[nextPly]);
      game.current.move({ ...reply, promotion: "q" });
      setFen(game.current.fen());
      setLastMove(reply);
      setPly(nextPly + 1);
    }, 450);
    return true;
  };

  const onSquareClick = (square: Square) => {
    if (status === "solved") return;
    const piece = game.current.get(square);
    if (selected && selected !== square && !(piece && piece.color === "w")) {
      tryMove(selected, square);
      return;
    }
    setSelected(piece && piece.color === "w" ? square : null);
  };

  const colors = dark
    ? { light: "#b8afc6", dark: "#6c6181", mark: "rgba(199,247,74,0.45)", select: "rgba(199,247,74,0.62)" }
    : { light: "#ece6da", dark: "#b6abc7", mark: "rgba(74,106,0,0.28)", select: "rgba(74,106,0,0.42)" };

  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};
    if (lastMove) {
      styles[lastMove.from] = { background: colors.mark };
      styles[lastMove.to] = { background: colors.mark };
    }
    if (selected) {
      styles[selected] = { background: colors.select };
      for (const m of game.current.moves({ square: selected, verbose: true })) {
        styles[m.to] = {
          background: `radial-gradient(circle, ${colors.select} 22%, transparent 24%)`,
        };
      }
    }
    return styles;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMove, selected, fen, dark]);

  const message =
    status === "solved"
      ? `${puzzle.sanLine}. Checkmate.`
      : status === "wrong"
        ? "Not that one. Try again."
        : ply === 0
          ? "White to move. Drag a piece or click to move."
          : "Black recaptured. Finish it.";

  return (
    <div className="grid gap-6 sm:grid-cols-[minmax(0,360px)_1fr] sm:items-center sm:gap-10">
      <div ref={boxRef} className="w-full">
        <div
          onAnimationEnd={() => setShaking(false)}
          className={`overflow-hidden border border-ink/15 shadow-sm ${shaking ? "animate-shake" : ""}`}
        >
          <Chessboard
            id="puzzle"
            position={fen}
            boardWidth={width}
            arePiecesDraggable={status !== "solved"}
            isDraggablePiece={({ piece }) => piece.startsWith("w")}
            onPieceDrop={(from, to) => tryMove(from, to)}
            onSquareClick={onSquareClick}
            customSquareStyles={squareStyles}
            customLightSquareStyle={{ backgroundColor: colors.light }}
            customDarkSquareStyle={{ backgroundColor: colors.dark }}
            customNotationStyle={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
            animationDuration={220}
          />
        </div>
      </div>
      <div className="space-y-4">
        <p className="font-display text-2xl font-bold tracking-tight text-ink">{puzzle.title}</p>
        <p aria-live="polite" className={`font-mono text-sm ${status === "solved" ? "text-accent" : status === "wrong" ? "text-ink" : "text-muted"}`}>
          {message}
        </p>
        {showHint && status !== "solved" && <p className="text-sm text-copy">{puzzle.hint}</p>}
        <p className="text-sm text-faint">{puzzle.source}</p>
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={reset}
            className="inline-flex cursor-pointer items-center gap-1.5 border border-line px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-ink/30 hover:text-ink"
          >
            <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
            Reset
          </button>
          {status !== "solved" && !showHint && (
            <button
              type="button"
              onClick={() => setShowHint(true)}
              className="cursor-pointer font-mono text-xs text-accent transition-opacity hover:opacity-70"
            >
              Hint
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
