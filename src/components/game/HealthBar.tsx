import { motion } from "framer-motion";

interface HealthBarProps {
  current: number;
  max: number;
  label: string;
  variant: "player" | "ai";
}

const HealthBar = ({ current, max, label, variant }: HealthBarProps) => {
  const pct = Math.max(0, (current / max) * 100);
  const isLow = pct < 30;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="font-display text-xs uppercase tracking-wider text-foreground">
          {label}
        </span>
        <span className={`font-mono text-sm font-bold ${variant === "player" ? "text-primary" : "text-secondary"}`}>
          {current}/{max}
        </span>
      </div>
      <div className="h-4 rounded-sm bg-muted border border-border overflow-hidden relative">
        <motion.div
          className={`h-full rounded-sm ${
            variant === "player"
              ? isLow ? "bg-destructive" : "bg-primary"
              : isLow ? "bg-accent" : "bg-secondary"
          }`}
          initial={{ width: "100%" }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        {/* Scanline overlay */}
        <div className="absolute inset-0 scanline pointer-events-none" />
      </div>
    </div>
  );
};

export default HealthBar;
