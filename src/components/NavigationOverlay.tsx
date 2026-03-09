import React, { useState } from 'react';
import { X, Sun, Moon, MapPin, Calendar, Clock, User, Settings2, Check, Bell, Trash2 } from 'lucide-react';
import { useSyllabusStore } from '../store';
import { Tooltip } from './Tooltip';

interface NavigationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

export const NavigationOverlay: React.FC<NavigationOverlayProps> = ({ isOpen, onClose, onNavigate }) => {
  const { 
    isEclipseMode, toggleEclipseMode, calculationsRun, 
    userIdentity, userBirthday, userBirthTime, userBirthTimezone, userLocation, 
    isCalibrated, setUserIdentity, setUserBirthday, setUserBirthTime, setUserBirthTimezone, setUserLocation,
    transitNotifications, markNotificationRead, clearNotifications
  } = useSyllabusStore();
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [manualLocation, setManualLocation] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [detecting, setDetecting] = useState(false);

  const level = calculationsRun >= 25 ? "Expert Seeker" : 
                calculationsRun >= 15 ? "Deep Diver" : 
                calculationsRun >= 10 ? "Regular Visitor" : 
                calculationsRun >= 5 ? "Curious Student" : "Newcomer";

  const categories = [
    {
      label: "Need some help?",
      color: "var(--color-archive-accent)",
      symbol: "☽",
      items: [
        { name: "Horary", page: "HORARY", desc: "A method of answering specific questions based on the moment they are asked." },
        { name: "Life Path Reader", page: "NUMEROLOGY", desc: "A numerical analysis of your birth date and name to identify patterns and tendencies." },
        { name: "Name to Number (Gematria)", page: "GEMATRIA", desc: "A system for calculating the numerical value of names and words to find common themes." },
        { name: "Sabian Symbols", page: "SABIAN", desc: "A set of 360 symbolic descriptions for each degree of the zodiac." },
        { name: "Tarot Reading", page: "TAROT", desc: "A structured system of cards used to reflect on current situations and potential outcomes." },
        { name: "The Hall of Records", page: "AKASHIC", desc: "A conceptual repository of information and experiences." },
        { name: "Lost Item Finder", page: "LOST_ITEM", desc: "A practical application of horary techniques to help locate misplaced objects." },
        { name: "Create a Sigil", page: "SIGIL", desc: "The creation of a personal symbol to represent a specific goal or focus." },
        { name: "Cosmic Mad Libs", page: "MAD_LIBS", desc: "A creative exercise to generate narratives based on your inputs." },
        { name: "Shared Insights", page: "SHARED_INSIGHTS", desc: "A collection of observations and insights." },
        { name: "Dream Journal", page: "DREAM_JOURNAL", desc: "A place to record and review your dreams for recurring themes." },
        { name: "Emotional Resonance", page: "MOOD", desc: "A tool to track and visualize your emotional state over time." },
        { name: "Daily Rituals", page: "RITUAL", desc: "Practical daily habits to maintain focus and clarity." },
        { name: "Color Oracle", page: "COLOR", desc: "An exploration of how different colors relate to your current state." },
        { name: "Tea Leaf Reading", page: "TEA_LEAF", desc: "An interpretive practice based on patterns found in tea leaves." },
        { name: "The Crystal Ball", page: "CRYSTAL", desc: "A focus exercise using a reflective surface to stimulate insight." },
        { name: "The Pendulum", page: "PENDULUM", desc: "A tool used to access subtle responses from the subconscious." },
        { name: "The Master Syllabus", page: "MASTER_ARCHIVE", desc: "The central index of all available tools." },
      ]
    },
    {
      label: "The Big View",
      color: "var(--color-archive-ink)",
      symbol: "☉",
      items: [
        { name: "The Birth Map", page: "BIRTH_CHART", desc: "A map of the sky at the exact moment of your birth, revealing your unique cosmic blueprint." },
        { name: "Check Your Home's Vibe", page: "FLYING_STAR", desc: "A classical Feng Shui system that tracks the movement of energy (Qi) through time and space to harmonize a building's environment." },
        { name: "Natural Cycle Tracker", page: "BIORHYTHM", desc: "A theory that our lives are influenced by rhythmic biological cycles (physical, emotional, and intellectual) that start at birth." },
        { name: "Syllabus Explorer", page: "EXPLORER", desc: "A tool to browse and explore the various records within the Syllabus." },
      ]
    }
  ];

  const handleManualSearch = async () => {
    if (!manualLocation.trim()) return;
    setSearching(true);
    setSearchError(null);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(manualLocation)}&limit=1`);
      const data = await response.json();
      if (data && data.length > 0) {
        const first = data[0];
        setUserLocation({
          lat: parseFloat(first.lat),
          lng: parseFloat(first.lon),
          name: first.display_name.split(',')[0]
        });
        setManualLocation('');
      } else {
        setSearchError("Location not found.");
      }
    } catch (error) {
      setSearchError("Search failed.");
    } finally {
      setSearching(false);
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    setDetecting(true);
    setSearchError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, name: "Detected Location" });
        setDetecting(false);
      },
      () => {
        setDetecting(false);
        setSearchError("Access denied.");
      }
    );
  };

  return (
    <div className={`fixed inset-0 z-[2900] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <div className="absolute inset-0 bg-archive-bg/95 backdrop-blur-md" onClick={onClose} />
      <div className={`absolute top-0 left-0 h-full w-full md:w-[480px] bg-archive-bg border-r border-archive-line transition-transform duration-500 shadow-2xl flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 sm:p-10 pt-24 flex-grow overflow-y-auto custom-scrollbar">
          <section className="mb-12 p-8 border border-archive-line bg-white shadow-xl rounded-xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-6xl font-sans">☊</div>
            <div className="flex justify-between items-center relative z-10">
              <div className="flex items-center gap-2">
                <span className="text-xl font-sans text-archive-accent">♁</span>
                <span className="handwritten text-[10px] uppercase text-archive-accent tracking-widest">Resonance Calibration</span>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)} 
                  className="relative text-archive-ink/40 hover:text-archive-accent transition-colors"
                >
                  <Bell size={16} />
                  {transitNotifications.some(n => !n.isRead) && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-archive-accent rounded-full border border-white" />
                  )}
                </button>
                <button onClick={() => setIsEditingProfile(!isEditingProfile)} className="text-[10px] uppercase flex items-center gap-1 hover:text-archive-accent transition-colors">
                  {isEditingProfile ? <X size={14} /> : <Settings2 size={14} />}
                </button>
              </div>
            </div>

            {showNotifications ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 relative z-10">
                <div className="flex justify-between items-center border-b border-archive-line pb-2">
                  <span className="text-[9px] uppercase opacity-40">Celestial Transits</span>
                  <button onClick={clearNotifications} className="text-[9px] uppercase opacity-40 hover:text-red-500 flex items-center gap-1">
                    <Trash2 size={10} /> Clear
                  </button>
                </div>
                <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                  {!transitNotifications || transitNotifications.length === 0 ? (
                    <p className="handwritten text-sm opacity-40 py-4 text-center italic">The stars are quiet for now.</p>
                  ) : (
                    transitNotifications.map((n) => (
                      <div 
                        key={n.id} 
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3 border border-archive-line rounded-lg transition-all cursor-pointer ${n.isRead ? 'opacity-40' : 'bg-archive-accent/5 border-archive-accent/20'}`}
                      >
                        <p className="handwritten text-sm italic leading-tight">{n.message}</p>
                        <p className="text-[8px] font-mono uppercase opacity-40 mt-2">
                          {new Date(n.date).toLocaleDateString()} @ {new Date(n.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                <button onClick={() => setShowNotifications(false)} className="w-full text-[10px] uppercase opacity-40 hover:opacity-100">Back to Profile</button>
              </div>
            ) : isEditingProfile ? (
              <div className="space-y-6 animate-in fade-in duration-300 relative z-10">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase opacity-40 flex items-center gap-2"><User size={10} /> Who are you?</label>
                  <input 
                    className="w-full bg-archive-bg p-3 border border-archive-line text-lg italic outline-none focus:border-archive-accent" 
                    value={userIdentity || ""} 
                    onChange={(e) => setUserIdentity(e.target.value)}
                    placeholder="Name..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase opacity-40 flex items-center gap-2"><Calendar size={10} /> Arrival Date</label>
                    <input type="date" className="w-full bg-archive-bg p-3 border border-archive-line text-lg italic outline-none focus:border-archive-accent" value={userBirthday || ""} onChange={(e) => setUserBirthday(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase opacity-40 flex items-center gap-2"><Clock size={10} /> Time</label>
                    <input type="time" className="w-full bg-archive-bg p-3 border border-archive-line text-lg italic outline-none focus:border-archive-accent" value={userBirthTime || "12:00"} onChange={(e) => setUserBirthTime(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase opacity-40 flex items-center gap-2">IANA Timezone</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      className="flex-1 bg-archive-bg p-3 border border-archive-line text-lg italic outline-none focus:border-archive-accent" 
                      value={userBirthTimezone} 
                      onChange={(e) => setUserBirthTimezone(e.target.value)} 
                      placeholder="UTC"
                    />
                    <button 
                      onClick={() => setUserBirthTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)}
                      className="px-3 border border-archive-line text-[9px] font-mono uppercase hover:bg-archive-ink hover:text-white transition-colors"
                    >
                      Detect
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase opacity-40 flex items-center gap-2"><MapPin size={10} /> Spatial Coordinates</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      className="flex-1 bg-archive-bg p-3 border border-archive-line text-lg italic outline-none focus:border-archive-accent" 
                      value={manualLocation} 
                      onChange={(e) => setManualLocation(e.target.value)} 
                      onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
                      placeholder={userLocation?.name || "City, Region..."}
                    />
                    <button 
                      onClick={handleManualSearch}
                      disabled={searching || !manualLocation.trim()}
                      className="px-3 border border-archive-line text-[9px] font-mono uppercase hover:bg-archive-ink hover:text-white transition-colors disabled:opacity-30"
                    >
                      {searching ? "..." : "Search"}
                    </button>
                    <button 
                      onClick={detectLocation}
                      disabled={detecting}
                      className="px-3 border border-archive-line text-[9px] font-mono uppercase hover:bg-archive-ink hover:text-white transition-colors"
                    >
                      {detecting ? "..." : "Detect"}
                    </button>
                  </div>
                  {searchError && <p className="text-[8px] text-red-500 italic">{searchError}</p>}
                  {userLocation && !manualLocation && <p className="text-[8px] text-emerald-600 italic">Current: {userLocation.name}</p>}
                </div>
                <button onClick={() => setIsEditingProfile(false)} className="w-full text-[10px] uppercase opacity-40 hover:opacity-100">Save and Close</button>
              </div>
            ) : (
              <div className="space-y-4 relative z-10">
                <p className="handwritten text-2xl italic text-archive-ink leading-tight">
                  {userIdentity ? `Hi, ${userIdentity.split(' ')[0]}.` : "Let's set your frequency."}
                </p>
                <div className="flex flex-col gap-2">
                  {userBirthday && <span className="flex items-center gap-2 text-sm italic opacity-60"><Calendar size={14} className="opacity-40" /> Born: {userBirthday} {userBirthTime && `@ ${userBirthTime}`} ({userBirthTimezone})</span>}
                  {userLocation && <span className="flex items-center gap-2 text-sm italic opacity-60"><MapPin size={14} className="opacity-40" /> Location: {userLocation.name || "Synced"}</span>}
                </div>
                {isCalibrated && <div className="flex items-center gap-2 text-[9px] text-emerald-600 uppercase tracking-widest pt-2 border-t border-archive-line"><Check size={12} /> Calibration Locked ♁</div>}
              </div>
            )}
          </section>

          <div className="flex justify-between items-center mb-10 pb-4 border-b border-archive-line">
            <div className="space-y-1">
              <div className="handwritten text-[10px] text-archive-ink opacity-40 uppercase tracking-widest">Seeker Level</div>
              <div className="heading-marker text-xl">{level}</div>
            </div>
            <div className="text-right">
              <div className="handwritten text-[10px] text-archive-ink opacity-40 uppercase tracking-widest">Syllabus Access</div>
              <div className="heading-marker text-xl">{calculationsRun}</div>
            </div>
          </div>

          <div className="space-y-16">
            {categories.map((cat, idx) => (
              <div key={idx} className="space-y-4">
                <div className="flex items-center gap-3 border-b border-archive-line pb-2">
                  <span className="text-2xl font-sans" style={{ color: cat.color }}>{cat.symbol}</span>
                  <span className="heading-marker text-2xl text-archive-ink uppercase tracking-wide">{cat.label}</span>
                </div>
                <ul className="space-y-1 pl-6">
                  {cat.items.map((item, i) => (
                    <li key={i} className="flex items-center group">
                      <button 
                        onClick={() => onNavigate(item.page)} 
                        className="flex-1 text-left handwritten text-lg text-archive-ink hover:text-archive-accent py-1.5 px-4 rounded-md hover:bg-archive-ink/5 transition-colors"
                      >
                        {item.name}
                      </button>
                      <Tooltip title={item.name} content={item.desc} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            
            <div className="pt-8 mt-8 border-t border-archive-line">
              <button onClick={toggleEclipseMode} className="w-full flex items-center justify-between group p-3 hover:bg-archive-ink/5 rounded-xl transition-all">
                <div className="flex items-center gap-3">
                  {isEclipseMode ? <Moon size={20} className="text-archive-accent" /> : <Sun size={20} className="text-archive-accent" />}
                  <span className="handwritten text-lg italic">{isEclipseMode ? "Night Watch" : "Day Watch"}</span>
                </div>
                <div className={`w-12 h-6 rounded-full border border-archive-ink relative transition-all ${isEclipseMode ? "bg-archive-ink" : "bg-transparent"}`}>
                  <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full transition-all duration-300 ${isEclipseMode ? "left-[calc(100%-1.2rem)] bg-archive-bg" : "left-1 bg-archive-ink"}`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
