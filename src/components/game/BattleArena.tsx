import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HealthBar from "./HealthBar";
import { getRandomChallenge, stolenCodeRewards, type Challenge } from "@/data/challenges";
import playerRobotImg from "@/assets/player-robot.png";
import aiRobotImg from "@/assets/ai-robot.png";

interface BattleArenaProps {
  language: "python" | "sql" | "cpp";
  difficulty: "easy" | "medium" | "hard";
  level: number;
  onVictory: (stolenCode: string) => void;
  onDefeat: () => void;
}

const difficultyHP = { easy: 60, medium: 80, hard: 100 };
const aiDamageRange = { easy: [5, 10], medium: [8, 15], hard: [12, 20] };

/* ---------- Spark Particles ---------- */
const SparkParticles = ({ side, color }: { side: "left" | "right"; color: "cyan" | "orange" }) => {
  const sparks = useMemo(() => Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 120,
    y: (Math.random() - 0.5) * 120,
    size: Math.random() * 6 + 2,
    delay: Math.random() * 0.15,
  })), []);

  return (
    <div className={`absolute z-40 ${side === "left" ? "left-[22%]" : "right-[22%]"} top-1/2 -translate-y-1/2`}>
      {sparks.map(s => (
        <motion.div
          key={s.id}
          className={color === "cyan" ? "spark" : "spark-orange"}
          style={{ width: s.size, height: s.size, position: "absolute" }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: s.x, y: s.y, opacity: 0, scale: 0 }}
          transition={{ duration: 0.6, delay: s.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
};

/* ---------- Energy Beam ---------- */
const EnergyBeam = ({ direction }: { direction: "left-to-right" | "right-to-left" }) => (
  <motion.div
    className={`absolute top-1/2 -translate-y-1/2 h-2 rounded-full ${direction === "right-to-left" ? "energy-beam-orange" : "energy-beam"}`}
    style={{ [direction === "left-to-right" ? "left" : "right"]: "25%", zIndex: 35 }}
    initial={{ width: 0, opacity: 0 }}
    animate={{ width: "50%", opacity: [0, 1, 1, 0] }}
    transition={{ duration: 0.5, ease: "easeInOut" }}
  />
);

/* ---------- Shield Effect ---------- */
const ShieldEffect = () => (
  <motion.div
    className="absolute inset-0 shield-bubble"
    style={{ zIndex: 25 }}
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: [0.8, 1.1, 1], opacity: [0, 0.6, 0] }}
    transition={{ duration: 0.8 }}
  />
);

/* ---------- Main Component ---------- */
const BattleArena = ({ language, difficulty, level, onVictory, onDefeat }: BattleArenaProps) => {
  const maxPlayerHP = 100;
  const maxAiHP = difficultyHP[difficulty];

  const [playerHP, setPlayerHP] = useState(maxPlayerHP);
  const [aiHP, setAiHP] = useState(maxAiHP);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [answer, setAnswer] = useState("");
  const [phase, setPhase] = useState<"ai-attack" | "player-turn" | "result" | "victory" | "defeat">("ai-attack");
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [failCount, setFailCount] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Animation states
  const [playerAnim, setPlayerAnim] = useState("");
  const [aiAnim, setAiAnim] = useState("");
  const [showBeam, setShowBeam] = useState<"left-to-right" | "right-to-left" | null>(null);
  const [showSparks, setShowSparks] = useState<{ side: "left" | "right"; color: "cyan" | "orange" } | null>(null);
  const [showShield, setShowShield] = useState<"player" | "ai" | null>(null);
  const [screenShake, setScreenShake] = useState(false);

  const addLog = useCallback((msg: string) => {
    setBattleLog(prev => [...prev.slice(-6), msg]);
  }, []);

  // AI attacks first
  useEffect(() => {
    if (phase !== "ai-attack") return;
    const timer = setTimeout(() => {
      const [min, max] = aiDamageRange[difficulty];
      const dmg = Math.floor(Math.random() * (max - min + 1)) + min;

      // Phase 1: AI charges up
      setAiAnim("animate-charge-up");
      setTimeout(() => {
        // Phase 2: Energy beam fires
        setShowBeam("right-to-left");
        setAiAnim("animate-dash-left");
        setTimeout(() => {
          // Phase 3: Impact
          setShowBeam(null);
          setShowSparks({ side: "left", color: "orange" });
          setPlayerAnim("animate-recoil");
          setScreenShake(true);
          setPlayerHP(prev => {
            const newHP = Math.max(0, prev - dmg);
            if (newHP <= 0) {
              setTimeout(() => setPhase("defeat"), 800);
            }
            return newHP;
          });
          addLog(`⚔️ AI deals ${dmg} damage!`);

          setTimeout(() => {
            setPlayerAnim("");
            setAiAnim("");
            setShowSparks(null);
            setScreenShake(false);
            if (playerHP - dmg > 0) {
              setChallenge(getRandomChallenge(language, difficulty));
              setAnswer("");
              setShowHint(false);
              setPhase("player-turn");
            }
          }, 700);
        }, 400);
      }, 500);
    }, 1000);
    return () => clearTimeout(timer);
  }, [phase, difficulty, language, addLog, playerHP]);

  const submitAnswer = () => {
    if (!challenge) return;
    const isCorrect = answer.trim().toLowerCase() === challenge.answer.toLowerCase();

    if (isCorrect) {
      // Phase 1: Player charges
      setPlayerAnim("animate-charge-up");
      setTimeout(() => {
        // Phase 2: Beam + dash
        setShowBeam("left-to-right");
        setPlayerAnim("animate-dash-right");
        setTimeout(() => {
          // Phase 3: Impact on AI
          setShowBeam(null);
          setShowSparks({ side: "right", color: "cyan" });
          setAiAnim("animate-recoil-left");
          setScreenShake(true);
          setAiHP(prev => {
            const newHP = Math.max(0, prev - challenge.damage);
            addLog(`💥 You deal ${challenge.damage} damage!`);
            if (newHP <= 0) {
              const rewards = stolenCodeRewards[language];
              const reward = rewards[Math.floor(Math.random() * rewards.length)];
              setTimeout(() => onVictory(reward), 1000);
            } else {
              setTimeout(() => setPhase("ai-attack"), 800);
            }
            return newHP;
          });
          setTimeout(() => {
            setPlayerAnim("");
            setAiAnim("");
            setShowSparks(null);
            setScreenShake(false);
          }, 600);
        }, 400);
      }, 500);
      setFailCount(0);
    } else {
      addLog("❌ Wrong answer! You take 5 damage.");
      setPlayerAnim("animate-damage-flash");
      setShowShield("ai");
      setPlayerHP(prev => Math.max(0, prev - 5));
      setFailCount(prev => {
        if (prev + 1 >= 2) setShowHint(true);
        return prev + 1;
      });
      setTimeout(() => { setPlayerAnim(""); setShowShield(null); }, 600);
      setAnswer("");
    }
  };

  const langLabel = { python: "PYBOT", sql: "SQLBOT", cpp: "CPPBOT" }[language];

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="font-display text-2xl md:text-3xl text-primary text-glow-cyan tracking-widest">
          CODE ARENA BATTLES
        </h1>
        <p className="text-muted-foreground text-sm font-body">
          Level {level} • {difficulty.toUpperCase()} • {language.toUpperCase()}
        </p>
      </div>

      {/* Battle Area */}
      <div className="flex-1 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Arena Panel */}
        <div className="lg:col-span-2 arena-panel p-4 flex flex-col">
          {/* Health Bars */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <HealthBar current={playerHP} max={maxPlayerHP} label={langLabel} variant="player" />
            <HealthBar current={aiHP} max={maxAiHP} label="AI-BOT" variant="ai" />
          </div>

          {/* Robot Battle View */}
          <motion.div
            className="flex-1 flex items-center justify-between relative min-h-[260px] rounded-lg bg-arena overflow-hidden arena-grid-floor px-8"
            animate={screenShake ? { x: [0, -6, 6, -4, 4, 0], y: [0, 3, -3, 2, -2, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <div className="scanline absolute inset-0 pointer-events-none z-10" />

            {/* Thruster trail under robots */}
            <div className="absolute bottom-4 left-[15%] w-16 h-1 rounded-full bg-primary/20 blur-sm animate-pulse-glow" />
            <div className="absolute bottom-4 right-[15%] w-16 h-1 rounded-full bg-secondary/20 blur-sm animate-pulse-glow" />

            {/* Player Robot - Flying */}
            <motion.div
              className={`relative z-20 ${playerAnim} thruster-glow-cyan`}
              animate={{ y: [-8, -20, -12, -18, -8], rotate: [-2, 1, -1, 2, -2] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              {/* Thruster flame */}
              <motion.div
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 rounded-full"
                style={{ background: "linear-gradient(180deg, hsl(195 100% 60% / 0.8), hsl(195 100% 50% / 0.2), transparent)" }}
                animate={{ height: [12, 20, 14, 18, 12], opacity: [0.6, 1, 0.7, 0.9, 0.6] }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
              />
              <img
                src={playerRobotImg}
                alt="Player Robot"
                className="w-32 h-32 md:w-40 md:h-40 object-contain"
              />
              {showShield === "player" && (
                <div className="absolute inset-[-12px]"><ShieldEffect /></div>
              )}
            </motion.div>

            {/* VS / Status Badge */}
            <div className="z-20 flex flex-col items-center gap-2">
              <AnimatePresence mode="wait">
                {phase === "ai-attack" && (
                  <motion.div key="atk" initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}
                    className="px-4 py-2 rounded-lg border border-secondary/50 bg-secondary/10">
                    <span className="font-display text-lg md:text-xl text-secondary text-glow-orange tracking-wider">
                      ⚡ ATTACKING!
                    </span>
                  </motion.div>
                )}
                {phase === "player-turn" && (
                  <motion.div key="turn" initial={{ scale: 0, rotate: 10 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}
                    className="px-4 py-2 rounded-lg border border-primary/50 bg-primary/10">
                    <span className="font-display text-lg md:text-xl text-primary text-glow-cyan tracking-wider">
                      🎯 YOUR TURN
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
              <span className="font-display text-xs text-muted-foreground tracking-[0.3em]">VS</span>
            </div>

            {/* AI Robot - Flying */}
            <motion.div
              className={`relative z-20 ${aiAnim} thruster-glow-orange`}
              animate={{ y: [-10, -22, -14, -20, -10], rotate: [2, -1, 1, -2, 2] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
            >
              {/* Thruster flame */}
              <motion.div
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 rounded-full"
                style={{ background: "linear-gradient(180deg, hsl(25 95% 60% / 0.8), hsl(0 80% 55% / 0.3), transparent)" }}
                animate={{ height: [14, 22, 16, 20, 14], opacity: [0.7, 1, 0.8, 0.95, 0.7] }}
                transition={{ repeat: Infinity, duration: 0.7, ease: "easeInOut" }}
              />
              <img
                src={aiRobotImg}
                alt="AI Robot"
                className="w-32 h-32 md:w-40 md:h-40 object-contain"
              />
              {showShield === "ai" && (
                <div className="absolute inset-[-12px]"><ShieldEffect /></div>
              )}
            </motion.div>

            {/* Energy Beam */}
            <AnimatePresence>
              {showBeam && <EnergyBeam key="beam" direction={showBeam} />}
            </AnimatePresence>

            {/* Spark Particles */}
            <AnimatePresence>
              {showSparks && <SparkParticles key="sparks" side={showSparks.side} color={showSparks.color} />}
            </AnimatePresence>

            {/* Multi-ring explosion */}
            <AnimatePresence>
              {showSparks && (
                <>
                  <motion.div
                    key="ring1"
                    className={`absolute z-30 w-24 h-24 rounded-full border-2 ${showSparks.color === "cyan" ? "border-primary/60" : "border-secondary/60"} ${showSparks.side === "left" ? "left-[18%]" : "right-[18%]"} top-1/2 -translate-y-1/2`}
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  />
                  <motion.div
                    key="ring2"
                    className={`absolute z-30 w-16 h-16 rounded-full border ${showSparks.color === "cyan" ? "border-primary/40" : "border-secondary/40"} ${showSparks.side === "left" ? "left-[20%]" : "right-[20%]"} top-1/2 -translate-y-1/2`}
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 3, opacity: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                  />
                </>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Code Challenge */}
          {phase === "player-turn" && challenge && (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mt-4 p-4 rounded-lg border border-border"
              style={{ background: "hsl(var(--code-bg))" }}
            >
              <p className="text-sm text-muted-foreground mb-2 font-body">
                ⚡ {challenge.prompt}
              </p>
              <pre className="font-mono text-sm md:text-base text-foreground mb-3 whitespace-pre-wrap">
                {challenge.codeTemplate.replace("___", "▯▯▯")}
              </pre>
              {showHint && (
                <p className="text-xs text-accent mb-2 font-body">💡 Hint: {challenge.hint}</p>
              )}
              <div className="flex gap-2">
                <input
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && submitAnswer()}
                  placeholder="Type your answer..."
                  className="flex-1 px-3 py-2 rounded font-mono text-sm bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  autoFocus
                />
                <button
                  onClick={submitAnswer}
                  className="px-4 py-2 rounded font-display text-sm uppercase tracking-wider bg-accent text-accent-foreground hover:opacity-90 transition-opacity box-glow-green"
                >
                  Run Code
                </button>
                <button
                  onClick={submitAnswer}
                  className="px-4 py-2 rounded font-display text-sm uppercase tracking-wider bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity box-glow-orange"
                >
                  Battle!
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Side Panel - Battle Log */}
        <div className="arena-panel p-4 flex flex-col">
          <h3 className="font-display text-sm text-primary text-glow-cyan mb-3 tracking-wider">
            BATTLE LOG
          </h3>
          <div className="flex-1 space-y-2 overflow-y-auto">
            <AnimatePresence>
              {battleLog.map((log, i) => (
                <motion.div
                  key={`${i}-${log}`}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="text-xs font-mono text-muted-foreground border-l-2 border-border pl-2 py-1"
                >
                  {log}
                </motion.div>
              ))}
            </AnimatePresence>
            {battleLog.length === 0 && (
              <p className="text-xs text-muted-foreground italic">Battle starting...</p>
            )}
          </div>

          {/* Level Info */}
          <div className="mt-4 pt-3 border-t border-border">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-secondary text-lg">🏆</span>
              <span className="font-display text-xs text-secondary tracking-wider">LEVEL {level}</span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className={`text-lg ${i < level ? "opacity-100" : "opacity-30"}`}>⭐</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattleArena;
