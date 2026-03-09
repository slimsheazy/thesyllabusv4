import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw } from 'lucide-react';
import { useSyllabusStore } from '../store';
import { Tooltip } from './Tooltip';

interface PendulumToolProps {
  onBack: () => void;
}

export const PendulumTool: React.FC<PendulumToolProps> = ({ onBack }) => {
  const { recordCalculation } = useSyllabusStore();
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const askPendulum = () => {
    if (navigator.vibrate) navigator.vibrate(10); // Subtle initial haptic
    setLoading(true);
    setTimeout(() => {
      const answers = ["YES", "NO", "MAYBE", "UNFOLDING", "REPHRASE"];
      setAnswer(answers[Math.floor(Math.random() * answers.length)]);
      recordCalculation();
      setLoading(false);
      if (navigator.vibrate) navigator.vibrate([20, 50, 20]); // Resonance haptic
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-archive-bg">
      <header className="border-b border-archive-line p-6 flex items-center justify-between bg-archive-bg">
        <div className="flex items-center gap-8">
          <button onClick={onBack} className="text-xs font-mono opacity-40 hover:opacity-100 transition-opacity">BACK</button>
          <div className="flex items-center">
            <h1 className="font-serif italic text-2xl tracking-tight">The Pendulum</h1>
            <Tooltip 
              title="What is a Pendulum?" 
              content="A tool for dowsing that uses a weighted object on a string to tap into subconscious knowledge or subtle energy fields." 
            />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto">
          {!answer ? (
            <div className="space-y-12 text-center py-12">
              <div className="space-y-4">
                <h2 className="text-5xl font-serif italic">Binary Resonance</h2>
                <p className="handwritten text-xl opacity-60">Focus on a 'Yes' or 'No' question and let the pendulum swing.</p>
              </div>

              <div className="relative w-64 h-80 mx-auto flex flex-col items-center">
                <motion.div 
                  animate={loading ? { 
                    rotate: [0, 30, -30, 25, -25, 15, -15, 5, -5, 0],
                  } : { 
                    rotate: [0, 2, -2, 0] 
                  }}
                  transition={{ 
                    duration: loading ? 2.5 : 4, 
                    repeat: loading ? 0 : Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="flex flex-col items-center origin-top"
                >
                  <div className="w-0.5 h-48 bg-archive-line" />
                  <div className="w-10 h-14 bg-archive-ink rounded-full -mt-1 shadow-2xl relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
                  </div>
                </motion.div>
              </div>

              <button 
                onClick={askPendulum}
                disabled={loading}
                className="brutalist-button px-12 py-5 text-xl"
              >
                {loading ? 'SWINGING...' : 'ASK THE PENDULUM'}
              </button>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto py-24 text-center space-y-12"
            >
              <div className="p-12 border border-archive-line bg-white shadow-2xl relative">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-8xl font-sans"></div>
                <p className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-40 mb-4">The Pendulum Says</p>
                <p className="font-serif italic text-6xl leading-relaxed text-archive-ink">
                  {answer}
                </p>
              </div>

              <div className="flex justify-center gap-6">
                <button 
                  onClick={() => setAnswer(null)}
                  className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-40 hover:opacity-100 flex items-center gap-2"
                >
                  <RefreshCw className="w-3 h-3" />
                  Ask again
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
