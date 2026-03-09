import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Book, Sparkles, RefreshCw, Loader2 } from 'lucide-react';
import { useSyllabusStore } from '../store';
import { GoogleGenAI } from "@google/genai";
import { Tooltip } from './Tooltip';

interface AkashicRecordsToolProps {
  onBack: () => void;
}

export const AkashicRecordsTool: React.FC<AkashicRecordsToolProps> = ({ onBack }) => {
  const { userIdentity, userBirthday, userLocation, recordCalculation } = useSyllabusStore();
  const [subject, setSubject] = useState({
    name: userIdentity || '',
    birthday: userBirthday || '',
    location: userLocation?.name || '',
    isMe: true
  });
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleResetToMe = () => {
    setSubject({
      name: userIdentity || '',
      birthday: userBirthday || '',
      location: userLocation?.name || '',
      isMe: true
    });
  };

  React.useEffect(() => {
    if (subject.isMe) {
      setSubject({
        name: userIdentity || '',
        birthday: userBirthday || '',
        location: userLocation?.name || '',
        isMe: true
      });
    }
  }, [userIdentity, userBirthday, userLocation, subject.isMe]);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // Extract initials
      const initials = subject.name.split(' ').map(n => n[0]).join('').toUpperCase();
      
      const prompt = `You are the Keeper of the Akashic Records. A seeker is querying the Hall of Records.
      
      Subject Identity:
      - Name: ${subject.name} (Initials: ${initials})
      - Birth: ${subject.birthday}
      - Location: ${subject.location}
      - Inquiry: "${query}"
      
      Task:
      Simulate the act of "opening a record" in the cosmic library. Reveal a specific fate or "soul fragment" regarding their question.
      
      Personalization Requirements:
      1. Mention the initials "${initials}" as a "soul signature" found on the record.
      2. Include an "oddly specific coincidence" related to their birth date (${subject.birthday}) or location (${subject.location}). For example, a specific weather event, a nearby landmark, or a historical minute detail that feels like a genuine recognition.
      3. The tone must be grounded, practical, yet deeply resonant. Use metaphors of archives, ink, and heavy parchment.
      
      Format:
      Start with: "[RECORD OPENED: ${initials}-${subject.birthday.replace(/-/g, '')}]"
      Then provide the insight.
      Keep the total response between 80 and 150 words.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      setResult(response.text || "The records remain silent for now. Try rephrasing your query.");
      recordCalculation();
    } catch (error) {
      console.error("Error querying Akashic Records:", error);
      setResult("The connection to the ether has been interrupted. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-archive-bg">
      <header className="border-b border-archive-line p-6 flex items-center justify-between bg-archive-bg">
        <div className="flex items-center gap-8">
          <button onClick={onBack} className="text-xs font-mono opacity-40 hover:opacity-100 transition-opacity">← BACK</button>
          <div className="flex items-center">
            <h1 className="font-serif italic text-2xl tracking-tight">Akashic Records</h1>
            <Tooltip 
              title="What are the Akashic Records?" 
              content="A cosmic library of every thought, word, and action that has ever occurred in the universe, accessible through focused meditation." 
            />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12 text-center py-12">
            <div className="space-y-4">
              <h2 className="title-main text-6xl">The Hall of Records</h2>
              <p className="opacity-60">Access the cosmic library of every soul's journey.</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-8">
              <div className="p-6 bg-white border border-archive-line shadow-sm space-y-6 text-left">
                <div className="flex justify-between items-center border-b border-archive-line pb-4">
                  <span className="text-[10px] font-mono uppercase opacity-40 tracking-widest">Subject</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleResetToMe}
                      className={`px-3 py-1 text-[10px] font-mono uppercase border transition-all ${subject.isMe ? 'bg-archive-ink text-archive-bg border-archive-ink' : 'border-archive-line opacity-40'}`}
                    >
                      Me
                    </button>
                    <button 
                      onClick={() => setSubject(s => ({ ...s, isMe: false }))}
                      className={`px-3 py-1 text-[10px] font-mono uppercase border transition-all ${!subject.isMe ? 'bg-archive-ink text-archive-bg border-archive-ink' : 'border-archive-line opacity-40'}`}
                    >
                      Someone Else
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase opacity-40">Name</label>
                    <input 
                      type="text" 
                      value={subject.name}
                      onChange={(e) => setSubject(s => ({ ...s, name: e.target.value, isMe: false }))}
                      className="w-full bg-archive-bg p-2 border border-archive-line text-sm italic outline-none focus:border-archive-accent"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase opacity-40">Birth Date</label>
                    <input 
                      type="date" 
                      value={subject.birthday}
                      onChange={(e) => setSubject(s => ({ ...s, birthday: e.target.value, isMe: false }))}
                      className="w-full bg-archive-bg p-2 border border-archive-line text-sm italic outline-none focus:border-archive-accent"
                    />
                  </div>
                </div>
              </div>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
                <input 
                  type="text" 
                  placeholder="Enter a theme, name, or question..." 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-white border border-archive-line p-6 pl-12 font-serif italic text-2xl outline-none focus:border-archive-accent shadow-sm"
                />
              </div>

              <button 
                onClick={handleSearch}
                disabled={loading || !query}
                className="brutalist-button w-full py-5 text-xl"
              >
                {loading ? 'ACCESSING RECORDS...' : 'QUERY THE ETHER'}
              </button>
            </div>

            <AnimatePresence>
              {result && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-2xl mx-auto p-12 border border-archive-line bg-white shadow-xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-8xl font-sans">☊</div>
                  <p className="font-serif italic text-2xl leading-relaxed text-archive-ink columns-1 md:columns-2 gap-12 text-left">
                    "{result}"
                  </p>
                  <div className="mt-8 pt-8 border-t border-archive-line flex justify-center">
                    <button 
                      onClick={() => setResult(null)}
                      className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-40 hover:opacity-100 flex items-center gap-2"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Close record
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
