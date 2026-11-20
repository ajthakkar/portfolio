"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chess, type Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import { RotateCcw, Undo2 } from "lucide-react";
import { choose, loadPlayers, predict, type MoveProb, type Player, type TimeClass } from "@/lib/policy-net";
import { useIsDark } from "./theme";

type Color = "w" | "b";
type ModelId = "me" | "typical";
type ClockPreset = "fresh" | "half" | "low";

const BASE: Record<TimeClass, number> = { bullet: 60, blitz: 180, rapid: 600 };
const CLOCKS: { id: ClockPreset; label: string }[] = [
  { id: "fresh", label: "Full clock" },
  { id: "half", label: "Half left" },
  { id: "low", label: "5 seconds" },
];
const OPPONENTS: { id: ModelId; label: string }[] = [
  { id: "me", label: "Model of me" },
  { id: "typical", label: "Typical player" },
];

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="space-y-1.5">
      <p className="pixel text-faint">{label}</p>
      <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={value === o.id}
            onClick={() => onChange(o.id)}
            className={`cursor-pointer border px-2.5 py-1 font-mono text-xs transition-colors ${
              value === o.id ? "border-accent bg-accent text-accent-ink" : "border-line text-muted hover:text-ink"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function MoveBars({ title, moves, tone }: { title: string; moves: MoveProb[] | null; tone: "accent" | "muted" }) {
  return (
    <div className="min-w-0 space-y-2">
      <p className="text-xs font-semibold text-ink">{title}</p>
      <ol className="space-y-1.5">
        {(moves ?? Array.from({ length: 4 }, () => null)).slice(0, 4).map((m, i) => (
          <li key={m ? m.uci : i} className="grid grid-cols-[3.25rem_1fr_2.5rem] items-center gap-2">
            <span className="font-mono text-xs text-ink">{m ? m.san : "…"}</span>
            <span className="relative h-2.5 bg-line/50">
              {m && (
                <span
                  className={`absolute inset-y-0 left-0 transition-[width] duration-300 ${tone === "accent" ? "bg-accent" : "bg-muted/60"}`}
                  style={{ width: `${Math.max(m.prob * 100, 1.5)}%` }}
                />
              )}
            </span>
            <span className="text-right font-mono text-[11px] tabular-nums text-muted">{m ? `${Math.round(m.prob * 100)}%` : ""}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function PlaysLikeMe() {
  const game = useRef(new Chess());
  const [fen, setFen] = useState(game.current.fen());
  const [you, setYou] = useState<Color>("w");
  const [opponent, setOpponent] = useState<ModelId>("me");
  const [timeClass, setTimeClass] = useState<TimeClass>("bullet");
  const [clock, setClock] = useState<ClockPreset>("fresh");
  const [sample, setSample] = useState(false);
  const [nets, setNets] = useState<Record<ModelId, Player> | null>(null);
  const [failed, setFailed] = useState(false);
  const [selected, setSelected] = useState<Square | null>(null);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [width, setWidth] = useState(320);
  const boxRef = useRef<HTMLDivElement>(null);
  const dark = useIsDark();

  useEffect(() => {
    loadPlayers("/models/")
      .then(({ me, typical }) => setNets({ me, typical }))
      .catch(() => setFailed(true));
  }, []);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const base = BASE[timeClass];
  const seconds = clock === "fresh" ? base : clock === "half" ? base / 2 : 5;
  const over = game.current.isGameOver();

  // What each model would play in the current position, for whoever is to move.
  const predictions = useMemo(() => {
    if (!nets || over) return null;
    return {
      me: predict(nets.me, game.current, seconds, base, timeClass),
      typical: predict(nets.typical, game.current, seconds, base, timeClass),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nets, fen, seconds, base, timeClass, over]);

  const play = useCallback((from: Square, to: Square) => {
    try {
      game.current.move({ from, to, promotion: "q" });
    } catch {
      return false;
    }
    setFen(game.current.fen());
    setLastMove({ from, to });
    setSelected(null);
    return true;
  }, []);

  // The model's turn.
  useEffect(() => {
    if (!predictions || over || game.current.turn() === you) return;
    const id = window.setTimeout(() => {
      const m = choose(predictions[opponent], sample ? 0.8 : 0);
      play(m.from, m.to);
    }, 380);
    return () => window.clearTimeout(id);
  }, [predictions, opponent, sample, you, over, play]);

  const newGame = (color: Color) => {
    game.current = new Chess();
    setYou(color);
    setFen(game.current.fen());
    setLastMove(null);
    setSelected(null);
  };

  const undo = () => {
    game.current.undo();
    if (game.current.turn() !== you) game.current.undo();
    setFen(game.current.fen());
    setLastMove(null);
    setSelected(null);
  };

  const onDrop = (from: Square, to: Square) => (game.current.turn() === you ? play(from, to) : false);

  const onSquareClick = (square: Square) => {
    if (game.current.turn() !== you || over) return;
    const piece = game.current.get(square);
    if (selected && selected !== square && !(piece && piece.color === you)) {
      play(selected, square);
      return;
    }
    setSelected(piece && piece.color === you ? square : null);
  };

  const colors = dark
    ? { light: "#cdd6ab", dark: "#5f7a33", mark: "rgba(255,128,104,0.55)", select: "rgba(255,128,104,0.75)" }
    : { light: "#eef1da", dark: "#8ba650", mark: "rgba(184,58,34,0.35)", select: "rgba(184,58,34,0.5)" };

  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};
    if (lastMove) {
      styles[lastMove.from] = { background: colors.mark };
      styles[lastMove.to] = { background: colors.mark };
    }
    if (selected) {
      styles[selected] = { background: colors.select };
      for (const m of game.current.moves({ square: selected, verbose: true })) {
        styles[m.to] = { background: `radial-gradient(circle, ${colors.select} 22%, transparent 24%)` };
      }
    }
    return styles;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMove, selected, fen, dark]);

  const g = game.current;
  const opponentName = opponent === "me" ? "The model of me" : "The typical player";
  const status = failed
    ? "The model couldn't load. Try refreshing."
    : !nets
      ? "Loading the model (about 2 MB)…"
      : g.isCheckmate()
        ? g.turn() === you
          ? `Checkmate. ${opponentName} wins.`
          : "Checkmate. You win."
        : g.isDraw()
          ? "Draw."
          : g.turn() === you
            ? `Your move${g.inCheck() ? ", you're in check" : ""}.`
            : `${opponentName} is moving…`;

  const sideToMove = g.turn() === you ? "you" : "it";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-10">
      <div ref={boxRef} className="w-full max-w-[480px]">
        <div className="overflow-hidden border border-ink/15 shadow-sm">
          <Chessboard
            id="plays-like-me"
            position={fen}
            boardWidth={width}
            boardOrientation={you === "w" ? "white" : "black"}
            arePiecesDraggable={!!nets && !over}
            isDraggablePiece={({ piece }) => piece.startsWith(you) && g.turn() === you}
            onPieceDrop={onDrop}
            onSquareClick={onSquareClick}
            autoPromoteToQueen
            customSquareStyles={squareStyles}
            customLightSquareStyle={{ backgroundColor: colors.light }}
            customDarkSquareStyle={{ backgroundColor: colors.dark }}
            customNotationStyle={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
            animationDuration={200}
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => newGame("w")}
            className="inline-flex cursor-pointer items-center gap-1.5 border border-line px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-ink/30 hover:text-ink"
          >
            <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" /> New game as White
          </button>
          <button
            type="button"
            onClick={() => newGame("b")}
            className="inline-flex cursor-pointer items-center gap-1.5 border border-line px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-ink/30 hover:text-ink"
          >
            <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" /> As Black
          </button>
          <button
            type="button"
            onClick={undo}
            disabled={g.history().length === 0}
            className="inline-flex cursor-pointer items-center gap-1.5 border border-line px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-ink/30 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Undo2 aria-hidden="true" className="h-3.5 w-3.5" /> Take back
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <p aria-live="polite" className="font-display text-xl font-bold tracking-tight text-ink">
          {status}
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <Segmented label="Opponent" value={opponent} options={OPPONENTS} onChange={setOpponent} />
          <Segmented
            label="Moves"
            value={sample ? "sample" : "likely"}
            options={[
              { id: "likely", label: "Most likely" },
              { id: "sample", label: "Varied, like a person" },
            ]}
            onChange={(v) => setSample(v === "sample")}
          />
          <Segmented
            label="Time control"
            value={timeClass}
            options={[
              { id: "bullet", label: "Bullet" },
              { id: "blitz", label: "Blitz" },
              { id: "rapid", label: "Rapid" },
            ]}
            onChange={setTimeClass}
          />
          <Segmented label="Its clock" value={clock} options={CLOCKS} onChange={setClock} />
        </div>

        <div className="border border-line bg-paper-2/60 p-4">
          <p className="mb-3 text-sm text-copy">
            {sideToMove === "you" ? "If I were in your seat here, the model thinks I'd play:" : "What it's choosing between:"}
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            <MoveBars title="Me" moves={predictions?.me ?? null} tone="accent" />
            <MoveBars title="Typical player at my level" moves={predictions?.typical ?? null} tone="muted" />
          </div>
        </div>
        <p className="text-xs leading-relaxed text-muted">
          No search and no engine: one pass through the network per move, running in your browser. It plays on instinct, the
          way I do in bullet, so it can miss tactics a real engine would see.
        </p>
      </div>
    </div>
  );
}
