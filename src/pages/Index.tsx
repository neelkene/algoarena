import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.png";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
      <div className="absolute inset-0 scanline pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <motion.h1
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl tracking-widest text-primary text-glow-cyan mb-2"
        >
          CODE ARENA
        </motion.h1>
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-2xl md:text-4xl tracking-[0.3em] text-secondary text-glow-orange mb-8"
        >
          BATTLES
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-muted-foreground font-body text-lg md:text-xl mb-12 max-w-md mx-auto"
        >
          Write code. Defeat robots. Steal their skills.
        </motion.p>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => navigate("/game")}
            className="px-10 py-4 rounded-lg font-display text-lg uppercase tracking-widest bg-primary text-primary-foreground box-glow-cyan hover:opacity-90 transition-all duration-300 hover:scale-105"
          >
            Play Now
          </button>
          <button
            onClick={() => navigate("/game")}
            className="px-10 py-4 rounded-lg font-display text-lg uppercase tracking-widest border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-all duration-300"
          >
            Guest Mode
          </button>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto"
        >
          {[
            { icon: "🐍", label: "Python" },
            { icon: "🗄️", label: "SQL" },
            { icon: "⚡", label: "C++" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <span className="text-3xl block mb-1">{item.icon}</span>
              <span className="text-xs text-muted-foreground font-display tracking-wider">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
