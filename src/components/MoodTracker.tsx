import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smile, RefreshCw, ChevronLeft } from 'lucide-react';
import { useSyllabusStore } from '../store';
import { useHaptics } from '../hooks/useHaptics';
import { GoogleGenAI } from "@google/genai";

interface MoodTrackerProps {
  onBack: () => void;
}

type EmotionNode = {
  name: string;
  color: string;
  children?: EmotionNode[];
};

const EMOTIONS: EmotionNode[] = [
  {
    name: 'Joy',
    color: '#FFD700',
    children: [
      { name: 'Content', color: '#FFE44D', children: [{ name: 'Free', color: '#FFF2A6' }, { name: 'Joyful', color: '#FFF2A6' }] },
      { name: 'Proud', color: '#FFE44D', children: [{ name: 'Successful', color: '#FFF2A6' }, { name: 'Confident', color: '#FFF2A6' }] },
      { name: 'Peaceful', color: '#FFE44D', children: [{ name: 'Loving', color: '#FFF2A6' }, { name: 'Thankful', color: '#FFF2A6' }] },
    ]
  },
  {
    name: 'Sadness',
    color: '#4682B4',
    children: [
      { name: 'Lonely', color: '#5F9EA0', children: [{ name: 'Isolated', color: '#B0C4DE' }, { name: 'Abandoned', color: '#B0C4DE' }] },
      { name: 'Disappointed', color: '#5F9EA0', children: [{ name: 'Dismayed', color: '#B0C4DE' }, { name: 'Displeased', color: '#B0C4DE' }] },
      { name: 'Grief', color: '#5F9EA0', children: [{ name: 'Heartbroken', color: '#B0C4DE' }, { name: 'Sorrowful', color: '#B0C4DE' }] },
    ]
  },
  {
    name: 'Anger',
    color: '#CD5C5C',
    children: [
      { name: 'Frustrated', color: '#E9967A', children: [{ name: 'Annoyed', color: '#FADBD8' }, { name: 'Infuriated', color: '#FADBD8' }] },
      { name: 'Hateful', color: '#E9967A', children: [{ name: 'Resentful', color: '#FADBD8' }, { name: 'Violent', color: '#FADBD8' }] },
      { name: 'Critical', color: '#E9967A', children: [{ name: 'Skeptical', color: '#FADBD8' }, { name: 'Dismissive', color: '#FADBD8' }] },
    ]
  },
  {
    name: 'Fear',
    color: '#9370DB',
    children: [
      { name: 'Scared', color: '#BA55D3', children: [{ name: 'Helpless', color: '#E6E6FA' }, { name: 'Frightened', color: '#E6E6FA' }] },
      { name: 'Anxious', color: '#BA55D3', children: [{ name: 'Overwhelmed', color: '#E6E6FA' }, { name: 'Worried', color: '#E6E6FA' }] },
      { name: 'Insecure', color: '#BA55D3', children: [{ name: 'Inadequate', color: '#E6E6FA' }, { name: 'Inferior', color: '#E6E6FA' }] },
    ]
  },
  {
    name: 'Surprise',
    color: '#FF8C00',
    children: [
      { name: 'Amazed', color: '#FFA500', children: [{ name: 'Astonished', color: '#FFE4B5' }, { name: 'Awestruck', color: '#FFE4B5' }] },
      { name: 'Confused', color: '#FFA500', children: [{ name: 'Disoriented', color: '#FFE4B5' }, { name: 'Perplexed', color: '#FFE4B5' }] },
    ]
  }
];

export const MoodTracker: React.FC<MoodTrackerProps> = ({ onBack }) => {
  const { recordCalculation, addMoodLog } = useSyllabusStore();
  const { triggerSuccess, triggerClick } = useHaptics();
  const [path, setPath] = useState<EmotionNode[]>([]);
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const currentOptions = useMemo(() => {
    if (path.length === 0) return EMOTIONS;
    return path[path.length - 1].children || [];
  }, [path]);

  const handleSelect = async (node: EmotionNode) => {
    triggerClick();
    if (node.children && node.children.length > 0) {
      setPath([...path, node]);
    } else {
      // Final selection
      const fullPath = [...path, node].map(n => n.name).join(' > ');
      setLoading(true);
      setInsight(null);
      
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const prompt = `You are an emotional alchemist. A seeker has identified their current resonance as: ${fullPath}.
        
        Provide a deep, poetic, and resonant insight for this specific emotional state. 
        Acknowledge the nuance of the tertiary emotion (${node.name}).
        
        Format the response as a single poetic paragraph (40-60 words).
        Use the "Archive/Syllabus" aesthetic: serif, italic, profoundly insightful.`;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
        });

        const text = response.text || "Your resonance is noted in the archive.";
        setInsight(text);
        addMoodLog(node.name, text);
        recordCalculation();
        triggerSuccess();
      } catch (error) {
        console.error("Error getting emotional insight:", error);
        setInsight("The archive is silent, but your heart speaks clearly. Honor this feeling.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    triggerClick();
    setPath(path.slice(0, -1));
  };

  const handleReset = () => {
    triggerClick();
    setPath([]);
    setInsight(null);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-archive-bg">
      <header className="border-b border-archive-line p-6 flex items-center justify-between bg-archive-bg">
        <div className="flex items-center gap-8">
          <button onClick={onBack} className="text-xs font-mono opacity-40 hover:opacity-100 transition-opacity">← BACK</button>
          <h1 className="font-serif italic text-2xl tracking-tight">Emotional Resonance</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="title-main text-6xl">The Emotion Wheel</h2>
            <p className="opacity-60">Navigate the layers of your current frequency to find its deeper meaning.</p>
          </div>

          {!insight && !loading && (
            <div className="space-y-8">
              <div className="flex items-center justify-center gap-4">
                {path.length > 0 && (
                  <button 
                    onClick={handleBack}
                    className="p-2 border border-archive-line hover:bg-archive-ink hover:text-white transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                )}
                <div className="flex gap-2">
                  {path.map((node, i) => (
                    <React.Fragment key={i}>
                      <span className="text-xs font-mono uppercase tracking-widest opacity-40">{node.name}</span>
                      {i < path.length - 1 && <span className="opacity-20">/</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={path.length}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-wrap justify-center gap-4"
                  >
                    {currentOptions.map((node) => (
                      <button 
                        key={node.name}
                        onClick={() => handleSelect(node)}
                        style={{ borderColor: node.color }}
                        className="px-8 py-4 border-2 bg-white shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                      >
                        <span className="font-serif italic text-xl">{node.name}</span>
                      </button>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          )}

          {loading && (
            <div className="py-24 text-center space-y-6">
              <div className="w-12 h-12 border-2 border-archive-accent border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="handwritten text-xl opacity-40">Distilling the essence of your resonance...</p>
            </div>
          )}

          <AnimatePresence>
            {insight && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto p-12 border border-archive-line bg-white shadow-xl relative text-center"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-8xl font-sans">☊</div>
                <p className="font-serif italic text-2xl leading-relaxed text-archive-ink">
                  "{insight}"
                </p>
                <div className="mt-8 pt-8 border-t border-archive-line flex justify-center">
                  <button 
                    onClick={handleReset}
                    className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-40 hover:opacity-100 flex items-center gap-2"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Reset check-in
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
