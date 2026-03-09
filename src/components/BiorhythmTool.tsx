import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, RefreshCw } from 'lucide-react';
import { useSyllabusStore } from '../store';
import { Tooltip } from './Tooltip';

interface BiorhythmToolProps {
  onBack: () => void;
}

export const BiorhythmTool: React.FC<BiorhythmToolProps> = ({ onBack }) => {
  const { userBirthday, recordCalculation } = useSyllabusStore();
  const [subjectBirthday, setSubjectBirthday] = useState(userBirthday || '');
  const [isMe, setIsMe] = useState(true);
  const [data, setData] = useState<any>(null);

  const handleResetToMe = () => {
    setSubjectBirthday(userBirthday || '');
    setIsMe(true);
  };

  useEffect(() => {
    if (isMe) {
      setSubjectBirthday(userBirthday || "");
    }
  }, [userBirthday, isMe]);

  const calculateBiorhythms = () => {
    if (!subjectBirthday) return;
    
    const birthDate = new Date(subjectBirthday);
    const today = new Date();
    
    // Use UTC midnights to calculate absolute days between dates, 
    // ignoring time of day and DST shifts.
    const start = Date.UTC(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    const end = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const diffDays = Math.floor((end - start) / (1000 * 60 * 60 * 24));

    const physical = Math.sin((2 * Math.PI * diffDays) / 23);
    const emotional = Math.sin((2 * Math.PI * diffDays) / 28);
    const intellectual = Math.sin((2 * Math.PI * diffDays) / 33);

    setData({ physical, emotional, intellectual });
    recordCalculation();
  };

  useEffect(() => {
    if (subjectBirthday) calculateBiorhythms();
  }, [subjectBirthday]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-archive-bg">
      <header className="border-b border-archive-line p-6 flex items-center justify-between bg-archive-bg">
        <div className="flex items-center gap-8">
          <button onClick={onBack} className="text-xs font-mono opacity-40 hover:opacity-100 transition-opacity">← BACK</button>
          <div className="flex items-center">
            <h1 className="font-serif italic text-2xl tracking-tight">Biorhythm Cycles</h1>
            <Tooltip 
              title="What are Biorhythms?" 
              content="A theory that our lives are influenced by rhythmic biological cycles (physical, emotional, and intellectual) that start at birth." 
            />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 p-6 bg-white border border-archive-line shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-mono uppercase opacity-40 tracking-widest">Subject</span>
              <div className="flex gap-2">
                <button 
                  onClick={handleResetToMe}
                  className={`px-3 py-1 text-[10px] font-mono uppercase border transition-all ${isMe ? 'bg-archive-ink text-archive-bg border-archive-ink' : 'border-archive-line opacity-40'}`}
                >
                  Me
                </button>
                <button 
                  onClick={() => setIsMe(false)}
                  className={`px-3 py-1 text-[10px] font-mono uppercase border transition-all ${!isMe ? 'bg-archive-ink text-archive-bg border-archive-ink' : 'border-archive-line opacity-40'}`}
                >
                  Someone Else
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase opacity-40 tracking-widest">Birth Date</span>
              <input 
                type="date" 
                value={subjectBirthday}
                onChange={(e) => { setSubjectBirthday(e.target.value); setIsMe(false); }}
                className="bg-archive-bg border border-archive-line p-2 text-xs font-mono outline-none focus:border-archive-accent"
              />
            </div>
          </div>

          {!subjectBirthday ? (
            <div className="text-center py-24 space-y-6">
              <h2 className="text-4xl font-serif italic">Calibration Required</h2>
              <p className="handwritten text-xl opacity-60">Please set a birth date to track natural cycles.</p>
            </div>
          ) : (
            <div className="space-y-12 py-12">
              <div className="text-center space-y-4">
                <h2 className="text-5xl font-serif italic">Your Natural Rhythm</h2>
                <p className="handwritten text-xl opacity-60">Track the physical, emotional, and intellectual waves of your life.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { label: 'Physical', value: data?.physical, color: 'text-rose-500', desc: 'Energy, strength, coordination' },
                  { label: 'Emotional', value: data?.emotional, color: 'text-archive-accent', desc: 'Sensitivity, mood, creativity' },
                  { label: 'Intellectual', value: data?.intellectual, color: 'text-blue-500', desc: 'Logic, memory, alertness' },
                ].map((cycle) => (
                  <div key={cycle.label} className="p-8 border border-archive-line bg-white shadow-sm flex flex-col items-center text-center gap-4">
                    <p className="col-header">{cycle.label}</p>
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-5" />
                        <motion.circle 
                          cx="50" cy="50" r="45" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="4" 
                          strokeDasharray="283"
                          strokeDashoffset={283 - (283 * ((cycle.value + 1) / 2))}
                          className={cycle.color}
                          initial={{ strokeDashoffset: 283 }}
                          animate={{ strokeDashoffset: 283 - (283 * ((cycle.value + 1) / 2)) }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                      </svg>
                      <span className="absolute text-2xl font-serif italic">
                        {Math.round(((cycle.value + 1) / 2) * 100)}%
                      </span>
                    </div>
                    <p className="text-[10px] font-mono uppercase opacity-40 leading-relaxed">{cycle.desc}</p>
                  </div>
                ))}
              </div>

              <div className="max-w-2xl mx-auto p-8 border border-archive-line bg-white/50">
                <div className="flex items-center gap-3 mb-4">
                  <Activity size={16} className="text-archive-accent" />
                  <span className="data-value text-archive-accent uppercase tracking-widest">Cycle Synthesis</span>
                </div>
                <p className="font-serif italic text-xl leading-relaxed opacity-80">
                  Your cycles are currently in a state of {data?.physical > 0 ? 'high energy' : 'restoration'}. 
                  It's a good time for {data?.intellectual > 0 ? 'complex problem solving' : 'intuitive reflection'}.
                </p>
              </div>

              <div className="pt-12 border-t border-archive-line flex justify-center">
                <button 
                  onClick={calculateBiorhythms}
                  className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-40 hover:opacity-100 flex items-center gap-2"
                >
                  <RefreshCw className="w-3 h-3" />
                  Refresh cycles
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
