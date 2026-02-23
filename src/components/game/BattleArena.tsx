import { useState, useEffect, useCallback } from "react";
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

const BattleArena = ({ language, difficulty, level, onVictory, onDefeat }: BattleArenaProps) => {
  const maxPlayerHP = 100;
  const maxAiHP = difficultyHP[difficulty];

  const [playerHP, setPlayerHP] = useState(maxPlayerHP);
  const [aiHP, setAiHP] = useState(maxAiHP);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [answer, setAnswer] = useState("");
  const [phase, setPhase] = useState<"ai-attack" | "player-turn" | "result" | "victory" | "defeat">("ai-attack");
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [playerAnim, setPlayerAnim] = useState("");
  const [aiAnim, setAiAnim] = useState("");
  const [explosionPos, setExplosionPos] = useState<"player" | "ai" | null>(null);
  const [failCount, setFailCount] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const addLog = useCallback((msg: string) => {
    setBattleLog(prev => [...prev.slice(-6), msg]);
  }, []);

  // AI attacks first
  useEffect(() => {
    if (phase !== "ai-attack") return;
    const timer = setTimeout(() => {
      const [min, max] = aiDamageRange[difficulty];
      const dmg = Math.floor(Math.random() * (max - min + 1)) + min;
      setAiAnim("animate-attack-left");
      setTimeout(() => {
        setExplosionPos("player");
        setPlayerAnim("animate-shake");
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
          setExplosionPos(null);
          if (playerHP - dmg > 0) {
            setChallenge(getRandomChallenge(language, difficulty));
            setAnswer("");
            setShowHint(false);
            setPhase("player-turn");
          }
        }, 600);
      }, 300);
    }, 1000);
    return () => clearTimeout(timer);
  }, [phase, difficulty, language, addLog, playerHP]);

  const submitAnswer = () => {
    if (!challenge) return;
    const isCorrect = answer.trim().toLowerCase() === challenge.answer.toLowerCase();

    if (isCorrect) {
      setPlayerAnim("animate-attack-right");
      setTimeout(() => {
        setExplosionPos("ai");
        setAiAnim("animate-shake");
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
          setExplosionPos(null);
        }, 500);
      }, 300);
      setFailCount(0);
    } else {
      addLog("❌ Wrong answer! You take 5 damage.");
      setPlayerAnim("animate-damage-flash");
      setPlayerHP(prev => Math.max(0, prev - 5));
      setFailCount(prev => {
        if (prev + 1 >= 2) setShowHint(true);
        return prev + 1;
      });
      setTimeout(() => setPlayerAnim(""), 400);
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
          <div className="flex-1 flex items-center justify-center relative min-h-[200px] rounded-lg bg-arena overflow-hidden">
            <div className="scanline absolute inset-0 pointer-events-none z-10" />
            
            {/* Player Robot */}
            <motion.div
              className={`relative z-20 ${playerAnim}`}
              animate={phase === "player-turn" ? { y: [0, -5, 0] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <img src={playerRobotImg} alt="Player Robot" className="w-28 h-28 md:w-36 md:h-36 object-contain drop-shadow-[0_0_15px_hsl(195,100%,50%)]" />
            </motion.div>

            {/* VS / Status */}
            <div className="mx-4 md:mx-8 z-20">
              <AnimatePresence mode="wait">
                {phase === "ai-attack" && (
                  <motion.span key="atk" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="font-display text-xl md:text-2xl text-secondary text-glow-orange">
                    ATTACKING!
                  </motion.span>
                )}
                {phase === "player-turn" && (
                  <motion.span key="turn" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="font-display text-lg md:text-xl text-primary text-glow-cyan">
                    YOUR TURN
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* AI Robot */}
            <motion.div
              className={`relative z-20 ${aiAnim}`}
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
            >
              <img src={aiRobotImg} alt="AI Robot" className="w-28 h-28 md:w-36 md:h-36 object-contain drop-shadow-[0_0_15px_hsl(25,95%,55%)]" />
            </motion.div>

            {/* Explosion */}
            <AnimatePresence>
              {explosionPos && (
                <motion.div
                  key="explosion"
                  className={`absolute z-30 w-20 h-20 rounded-full ${explosionPos === "player" ? "left-1/4" : "right-1/4"}`}
                  style={{ background: "radial-gradient(circle, hsl(25 95% 55%), hsl(0 80% 55%), transparent)" }}
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </AnimatePresence>
          </div>

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
