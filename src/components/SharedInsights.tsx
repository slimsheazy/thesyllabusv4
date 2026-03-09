import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, RefreshCw, Plus } from 'lucide-react';
import { useSyllabusStore } from '../store';

interface QuoteWallProps {
  onBack: () => void;
}

export const SharedInsights: React.FC<QuoteWallProps> = ({ onBack }) => {
  const { quotes, addQuote } = useSyllabusStore();
  const [newQuote, setNewQuote] = useState('');

  const handleAddQuote = () => {
    if (!newQuote) return;
    addQuote(newQuote, "You");
    setNewQuote('');
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-archive-bg">
      <header className="border-b border-archive-line p-6 flex items-center justify-between bg-archive-bg">
        <div className="flex items-center gap-8">
          <button onClick={onBack} className="text-xs font-mono opacity-40 hover:opacity-100 transition-opacity">← BACK</button>
          <h1 className="font-serif italic text-2xl tracking-tight">Shared Insights</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-5xl font-serif italic">Shared Insights</h2>
            <p className="handwritten text-xl opacity-60">A collection of observations from the archive.</p>
          </div>

          <div className="max-w-xl mx-auto flex gap-4">
            <input 
              type="text" 
              value={newQuote}
              onChange={(e) => setNewQuote(e.target.value)}
              placeholder="Add an insight..."
              className="flex-1 bg-white border border-archive-line p-4 font-serif italic text-lg outline-none focus:border-archive-accent"
            />
            <button 
              onClick={handleAddQuote}
              className="bg-archive-ink text-archive-bg p-4 hover:opacity-90 transition-opacity"
            >
              <Plus size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence>
              {quotes.map((quote, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 border border-archive-line bg-white shadow-sm relative group"
                >
                  <Quote className="absolute top-4 right-4 w-6 h-6 opacity-5 group-hover:opacity-10 transition-opacity" />
                  <p className="font-serif italic text-2xl leading-relaxed text-archive-ink mb-4">
                    "{quote.text}"
                  </p>
                  <p className="text-[10px] font-mono uppercase tracking-widest opacity-40">- {quote.author}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
