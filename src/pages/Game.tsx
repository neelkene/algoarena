import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import BattleArena from "@/components/game/BattleArena";

type GameScreen = "language" | "difficulty" | "battle" | "victory" | "defeat";
type Language = "python" | "sql" | "cpp";
type Difficulty = "easy" | "medium" | "hard";

const languages = [
  { id: "python" as const, label: "Python", icon: "🐍", desc: "Versatile & beginner-friendly" },
  { id: "sql" as const, label: "SQL", icon: "🗄️", desc: "Database query power" },
  { id: "cpp" as const, label: "C++", icon: "⚡", desc: "Raw performance" },
];

const difficulties = [
  { id: "easy" as const, label: "Easy", stars: 1, color: "text-accent box-glow-green" },
  { id: "medium" as const, label: "Intermediate", stars: 2, color: "text-secondary box-glow-orange" },
  { id: "hard" as const, label: "Hard", stars: 3, color: "text-destructive" },
];

const Game = () => {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<GameScreen>("language");
  const [language, setLanguage] = useState<Language>("python");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [level, setLevel] = useState(1);
  const [stolenCodes, setStolenCodes] = useState<string[]>([]);
  const [lastReward, setLastReward] = useState("");

  if (screen === "battle") {
    return (
      <BattleArena
        language={language}
        difficulty={difficulty}
        level={level}
        onVictory={(code) => {
          setLastReward(code);
          setStolenCodes(prev => [...prev, code]);
          setScreen("victory");
        }}
        onDefeat={() => setScreen("defeat")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {/* Language Select */}
        {screen === "language" && (
          <motion.div
            key="lang"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="text-center max-w-lg w-full"
          >
            <h2 className="font-display text-2xl md:text-3xl text-primary text-glow-cyan mb-2 tracking-widest">
              SELECT LANGUAGE
            </h2>
            <p className="text-muted-foreground text-sm mb-8 font-body">Choose your weapon</p>
            <div className="grid gap-4">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => { setLanguage(lang.id); setScreen("difficulty"); }}
                  className="arena-panel p-5 flex items-center gap-4 hover:neon-border transition-all duration-300 group cursor-pointer"
                >
                  <span className="text-4xl group-hover:animate-float">{lang.icon}</span>
                  <div className="text-left">
                    <h3 className="font-display text-lg text-foreground group-hover:text-primary transition-colors">
                      {lang.label}
                    </h3>
                    <p className="text-sm text-muted-foreground">{lang.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => navigate("/")}
              className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors font-body"
            >
              ← Back to menu
            </button>
          </motion.div>
        )}

        {/* Difficulty Select */}
        {screen === "difficulty" && (
          <motion.div
            key="diff"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="text-center max-w-lg w-full"
          >
            <h2 className="font-display text-2xl md:text-3xl text-primary text-glow-cyan mb-2 tracking-widest">
              CHOOSE DIFFICULTY
            </h2>
            <p className="text-muted-foreground text-sm mb-8 font-body">How brave are you?</p>
            <div className="grid gap-4">
              {difficulties.map((diff) => (
                <button
                  key={diff.id}
                  onClick={() => { setDifficulty(diff.id); setScreen("battle"); }}
                  className={`arena-panel p-5 flex items-center justify-between hover:neon-border transition-all duration-300 cursor-pointer`}
                >
                  <span className={`font-display text-lg ${diff.color}`}>{diff.label}</span>
                  <div className="flex gap-1">
                    {Array.from({ length: diff.stars }).map((_, i) => (
                      <span key={i} className="text-xl">⭐</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setScreen("language")}
              className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors font-body"
            >
              ← Change language
            </button>
          </motion.div>
        )}

        {/* Victory */}
        {screen === "victory" && (
          <motion.div
            key="victory"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center max-w-md w-full"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-6xl mb-4"
            >
              🏆
            </motion.div>
            <h2 className="font-display text-3xl text-secondary text-glow-orange mb-2 tracking-widest">
              VICTORY!
            </h2>
            <p className="text-foreground font-body mb-4">Level {level} Complete!</p>
            <div className="flex justify-center gap-1 mb-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.2 }}
                  className="text-3xl"
                >
                  ⭐
                </motion.span>
              ))}
            </div>

            {/* Stolen Code */}
            <div className="arena-panel p-4 mb-6 text-left">
              <h3 className="font-display text-sm text-accent text-glow-green mb-2">
                🔓 CODE STOLEN!
              </h3>
              <pre className="font-mono text-sm text-foreground bg-muted/50 p-2 rounded">
                {lastReward}
              </pre>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => { setLevel(prev => prev + 1); setScreen("battle"); }}
                className="px-6 py-3 rounded font-display text-sm uppercase tracking-wider bg-primary text-primary-foreground box-glow-cyan hover:opacity-90 transition-opacity"
              >
                Next Level →
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 rounded font-display text-sm uppercase tracking-wider bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                Menu
              </button>
            </div>
          </motion.div>
        )}

        {/* Defeat */}
        {screen === "defeat" && (
          <motion.div
            key="defeat"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center max-w-md w-full"
          >
            <div className="text-6xl mb-4">💀</div>
            <h2 className="font-display text-3xl text-destructive text-glow-red mb-2 tracking-widest">
              DEFEATED
            </h2>
            <p className="text-muted-foreground font-body mb-6">The AI was too strong this time...</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setScreen("battle")}
                className="px-6 py-3 rounded font-display text-sm uppercase tracking-wider bg-secondary text-secondary-foreground box-glow-orange hover:opacity-90 transition-opacity"
              >
                Retry
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 rounded font-display text-sm uppercase tracking-wider bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                Menu
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Game;
