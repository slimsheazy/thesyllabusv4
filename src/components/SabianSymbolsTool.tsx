import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Sparkles, RefreshCw, Loader2 } from 'lucide-react';
import { SABIAN_SYMBOLS, SabianSymbol } from '../data/sabianData';
import { SymbolCard } from './Sabian/SymbolCard';
import { Tooltip } from './Tooltip';
import { GoogleGenAI } from "@google/genai";
import { useSyllabusStore } from '../store';
import { hashString } from '../utils/hashUtils';

interface SabianSymbolsToolProps {
  onBack: () => void;
}

export const SabianSymbolsTool: React.FC<SabianSymbolsToolProps> = ({ onBack }) => {
  const { 
    userIdentity, userBirthday, recordCalculation,
    interpretationCache, setInterpretationCache
  } = useSyllabusStore();
  const [search, setSearch] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState<SabianSymbol | null>(null);
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Show random symbol on load
  React.useEffect(() => {
    getRandomSymbol();
  }, []);

  const filteredSymbols = SABIAN_SYMBOLS.filter(s => 
    s.symbol.toLowerCase().includes(search.toLowerCase()) ||
    s.sign.toLowerCase().includes(search.toLowerCase()) ||
    s.degree.toString() === search
  );

  const getRandomSymbol = () => {
    const random = SABIAN_SYMBOLS[Math.floor(Math.random() * SABIAN_SYMBOLS.length)];
    setSelectedSymbol(random);
    setInterpretation(null);
  };

  const getPersonalSymbol = () => {
    // Deterministic selection based on birthday
    if (!userBirthday) {
      alert("Please set your birthday in your profile first.");
      return;
    }
    const hash = hashString(userBirthday);
    const hashInt = parseInt(hash, 16);
    const index = Math.abs(hashInt) % SABIAN_SYMBOLS.length;
    const personal = SABIAN_SYMBOLS[index];
    setSelectedSymbol(personal);
    setInterpretation(null);
  };

  const getInterpretation = async (symbol: SabianSymbol) => {
    const cacheKey = hashString(`sabian|${symbol.sign}|${symbol.degree}|${userIdentity}|${userBirthday}`);
    if (interpretationCache[cacheKey]) {
      setInterpretation(interpretationCache[cacheKey]);
      return;
    }

    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `You are an expert in Sabian Symbols and esoteric astrology. 
      Interpret the following Sabian Symbol: "${symbol.degree}° ${symbol.sign}: ${symbol.symbol}".
      
      The seeker is ${userIdentity || 'a mysterious soul'} born on ${userBirthday || 'an unknown date'}.
      
      Provide a deep, poetic, and practical interpretation of how this specific degree's energy manifests in a person's life or current situation.
      Use the "Archive/Syllabus" aesthetic: serif, italic, slightly cryptic but deeply insightful.
      Keep it around 80 words.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      const text = response.text || "The symbol remains silent.";
      setInterpretation(text);
      setInterpretationCache(cacheKey, text);
      recordCalculation();
    } catch (error) {
      console.error("Error interpreting Sabian Symbol:", error);
      setInterpretation("The cosmic frequency is garbled. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSymbol = (symbol: SabianSymbol) => {
    setSelectedSymbol(symbol);
    setInterpretation(null);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-archive-bg">
      <header className="border-b border-archive-line p-6 flex items-center justify-between bg-archive-bg">
        <div className="flex items-center gap-8">
          <button onClick={onBack} className="text-xs font-mono opacity-40 hover:opacity-100 transition-opacity">← BACK</button>
          <div className="flex items-center">
            <h1 className="font-serif italic text-2xl tracking-tight">Sabian Symbols</h1>
            <Tooltip 
              title="What are Sabian Symbols?" 
              content="A set of 360 symbolic images, one for each degree of the zodiac, used to gain deeper insight into astrological placements." 
            />
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
            <input 
              type="text" 
              placeholder="Search symbols..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border border-archive-line rounded-none py-2 pl-10 pr-4 text-sm font-mono focus:outline-none focus:border-archive-ink w-64 transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={getPersonalSymbol}
            className="flex items-center gap-2 border border-archive-line px-4 py-2 text-sm font-mono hover:bg-archive-line transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>MY SYMBOL</span>
          </button>
          
          <button 
            onClick={getRandomSymbol}
            className="flex items-center gap-2 bg-archive-ink text-archive-bg px-4 py-2 text-sm font-mono hover:opacity-90 transition-opacity"
          >
            <RefreshCw className="w-4 h-4" />
            <span>RANDOM ORACLE</span>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="title-main text-6xl mb-2">The Oracle of Degrees</h2>
            <p className="opacity-50 uppercase text-xs tracking-syllabus">360 degrees of symbolic wisdom</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSymbols.map((symbol, idx) => (
              <SymbolCard 
                key={`${symbol.sign}-${symbol.degree}`} 
                symbol={symbol} 
                onClick={() => handleSelectSymbol(symbol)}
              />
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedSymbol && (
          <div className="fixed inset-0 z-[4000] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSymbol(null)}
              className="absolute inset-0 bg-archive-ink/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-archive-bg border border-archive-line shadow-2xl p-12 text-center max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <button 
                onClick={() => setSelectedSymbol(null)}
                className="absolute top-6 right-6 opacity-40 hover:opacity-100 transition-opacity"
              >
                <RefreshCw className="w-4 h-4 rotate-45" />
              </button>

              <div className="mb-8">
                <span className="data-value text-archive-accent text-lg">{selectedSymbol.degree}° {selectedSymbol.sign.toUpperCase()}</span>
              </div>

              <p className="font-serif italic text-3xl leading-snug text-archive-ink mb-12">
                "{selectedSymbol.symbol}"
              </p>

              <div className="space-y-6">
                {!interpretation && !loading && (
                  <button 
                    onClick={() => getInterpretation(selectedSymbol)}
                    className="brutalist-button px-8 py-3 text-sm flex items-center gap-2 mx-auto"
                  >
                    <Sparkles className="w-4 h-4" />
                    DECODE RESONANCE
                  </button>
                )}

                {loading && (
                  <div className="flex flex-col items-center gap-4 py-8">
                    <Loader2 className="w-8 h-8 animate-spin opacity-20" />
                    <p className="handwritten opacity-40">Consulting the oracle...</p>
                  </div>
                )}

                {interpretation && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-left p-6 bg-white border border-archive-line shadow-sm"
                  >
                    <p className="font-serif italic text-lg leading-relaxed text-archive-ink columns-1 md:columns-2 gap-8">
                      {interpretation}
                    </p>
                  </motion.div>
                )}
              </div>

              <div className="pt-8 border-t border-archive-line mt-12">
                <p className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-40">The Sabian Oracle has spoken</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
