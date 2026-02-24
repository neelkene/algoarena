import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="font-display text-lg text-primary text-glow-cyan tracking-widest hover:opacity-80 transition-opacity"
        >
          CODE ARENA
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <NavBtn
            label="Home"
            active={location.pathname === "/"}
            onClick={() => navigate("/")}
          />
          <NavBtn
            label="Play"
            active={location.pathname === "/game"}
            onClick={() => navigate("/game")}
          />
          <NavBtn label="Leaderboard" onClick={() => {}} />
          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center text-sm font-display text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
            >
              👤
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-card shadow-lg overflow-hidden"
                >
                  <DropItem icon="👤" label="Profile" onClick={() => setMenuOpen(false)} />
                  <DropItem icon="📊" label="Game History" onClick={() => setMenuOpen(false)} />
                  <DropItem icon="⚙️" label="Settings" onClick={() => setMenuOpen(false)} />
                  <div className="border-t border-border" />
                  <DropItem icon="🚪" label="Sign In" onClick={() => setMenuOpen(false)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5"
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="block w-5 h-0.5 bg-foreground"
          />
          <motion.span
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block w-5 h-0.5 bg-foreground"
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="block w-5 h-0.5 bg-foreground"
          />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border bg-card"
          >
            <div className="p-4 space-y-2">
              <MobileItem label="🏠 Home" onClick={() => { navigate("/"); setMenuOpen(false); }} />
              <MobileItem label="🎮 Play" onClick={() => { navigate("/game"); setMenuOpen(false); }} />
              <MobileItem label="🏆 Leaderboard" onClick={() => setMenuOpen(false)} />
              <MobileItem label="👤 Profile" onClick={() => setMenuOpen(false)} />
              <MobileItem label="📊 Game History" onClick={() => setMenuOpen(false)} />
              <MobileItem label="⚙️ Settings" onClick={() => setMenuOpen(false)} />
              <div className="border-t border-border pt-2">
                <MobileItem label="🚪 Sign In" onClick={() => setMenuOpen(false)} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const NavBtn = ({ label, active, onClick }: { label: string; active?: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`font-display text-xs uppercase tracking-wider transition-colors ${
      active ? "text-primary text-glow-cyan" : "text-muted-foreground hover:text-foreground"
    }`}
  >
    {label}
  </button>
);

const DropItem = ({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-full px-4 py-2.5 text-left text-sm font-body text-foreground hover:bg-muted transition-colors flex items-center gap-2"
  >
    <span>{icon}</span>
    {label}
  </button>
);

const MobileItem = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-full text-left px-3 py-2.5 rounded-lg font-body text-sm text-foreground hover:bg-muted transition-colors"
  >
    {label}
  </button>
);

export default Navbar;
