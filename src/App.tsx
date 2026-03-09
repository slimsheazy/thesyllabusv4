import React, { useState, useEffect } from 'react';
import { useSyllabusStore } from './store';
import { motion, AnimatePresence } from 'motion/react';
import { HoraryTool } from './components/HoraryTool';
import { NumerologyTool } from './components/NumerologyTool';
import { ArchiveHeader } from './components/ArchiveHeader';
import { ArchiveList } from './components/ArchiveList';
import { ArchiveCard } from './components/ArchiveCard';
import { ArchiveDetail } from './components/ArchiveDetail';
import { MenuButton } from './components/MenuButton';
import { NavigationOverlay } from './components/NavigationOverlay';
import { HomeView } from './components/HomeView';
import { SabianSymbolsTool } from './components/SabianSymbolsTool';
import { TarotTool } from './components/TarotTool';
import { BirthChartTool } from './components/BirthChartTool';
import { FlyingStarTool } from './components/FlyingStarTool';
import { AkashicRecordsTool } from './components/AkashicRecordsTool';
import { LostItemFinder } from './components/LostItemFinder';
import { SigilMaker } from './components/SigilMaker';
import { BiorhythmTool } from './components/BiorhythmTool';
import { CosmicMadLibs } from './components/CosmicMadLibs';
import { SharedInsights } from './components/SharedInsights';
import { DreamJournal } from './components/DreamJournal';
import { MoodTracker } from './components/MoodTracker';
import { DailyRitual } from './components/DailyRitual';
import { ColorOracle } from './components/ColorOracle';
import { TeaLeafReader } from './components/TeaLeafReader';
import { CrystalBall } from './components/CrystalBall';
import { PendulumTool } from './components/PendulumTool';
import { MasterArchive } from './components/MasterArchive';
import { GematriaTool } from './components/GematriaTool';
import { TransitNotifier } from './components/TransitNotifier';
import { Onboarding } from './components/Onboarding';
import { MOCK_ARCHIVES } from './data/mockArchives';
import { ArchivedSite } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState("HOME");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedSite, setSelectedSite] = useState<ArchivedSite | null>(null);
  const { updateLastAccess, isEclipseMode, isCalibrated } = useSyllabusStore();

  useEffect(() => {
    updateLastAccess();
    document.documentElement.classList.toggle('eclipse-mode', isEclipseMode);
  }, [isEclipseMode]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
  };

  const renderContent = () => {
    switch (currentPage) {
      case "HOME":
        return <HomeView onEnter={() => setIsMenuOpen(true)} />;
      case "HORARY":
        return <HoraryTool onBack={() => handleNavigate("HOME")} />;
      case "NUMEROLOGY":
        return <NumerologyTool onBack={() => handleNavigate("HOME")} />;
      case "GEMATRIA":
        return <GematriaTool onBack={() => handleNavigate("HOME")} />;
      case "SABIAN":
        return <SabianSymbolsTool onBack={() => handleNavigate("HOME")} />;
      case "TAROT":
        return <TarotTool onBack={() => handleNavigate("HOME")} />;
      case "BIRTH_CHART":
        return <BirthChartTool onBack={() => handleNavigate("HOME")} />;
      case "FLYING_STAR":
        return <FlyingStarTool onBack={() => handleNavigate("HOME")} />;
      case "AKASHIC":
        return <AkashicRecordsTool onBack={() => handleNavigate("HOME")} />;
      case "LOST_ITEM":
        return <LostItemFinder onBack={() => handleNavigate("HOME")} />;
      case "SIGIL":
        return <SigilMaker onBack={() => handleNavigate("HOME")} />;
      case "BIORHYTHM":
        return <BiorhythmTool onBack={() => handleNavigate("HOME")} />;
      case "MAD_LIBS":
        return <CosmicMadLibs onBack={() => handleNavigate("HOME")} />;
      case "SHARED_INSIGHTS":
        return <SharedInsights onBack={() => handleNavigate("HOME")} />;
      case "DREAM_JOURNAL":
        return <DreamJournal onBack={() => handleNavigate("HOME")} />;
      case "MOOD":
        return <MoodTracker onBack={() => handleNavigate("HOME")} />;
      case "RITUAL":
        return <DailyRitual onBack={() => handleNavigate("HOME")} />;
      case "COLOR":
        return <ColorOracle onBack={() => handleNavigate("HOME")} />;
      case "TEA_LEAF":
        return <TeaLeafReader onBack={() => handleNavigate("HOME")} />;
      case "CRYSTAL":
        return <CrystalBall onBack={() => handleNavigate("HOME")} />;
      case "PENDULUM":
        return <PendulumTool onBack={() => handleNavigate("HOME")} />;
      case "MASTER_ARCHIVE":
        return <MasterArchive onBack={() => handleNavigate("HOME")} />;
      case "EXPLORER":
        return (
          <div className="flex-1 flex flex-col overflow-hidden bg-archive-bg">
            <ArchiveHeader 
              title="Chronicle Explorer" 
              viewMode={viewMode} 
              setViewMode={setViewMode} 
              showViewControls={true}
            />
            <div className="flex-1 overflow-y-auto p-8">
              <AnimatePresence mode="wait">
                {viewMode === 'list' ? (
                  <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <ArchiveList archives={MOCK_ARCHIVES} onSelect={setSelectedSite} />
                  </motion.div>
                ) : (
                  <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MOCK_ARCHIVES.map((site) => (
                      <ArchiveCard key={site.id} site={site} onClick={() => setSelectedSite(site)} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full relative bg-archive-bg selection:bg-archive-accent selection:text-white">
      {!isCalibrated && <Onboarding />}
      
      <TransitNotifier />
      
      <MenuButton isOpen={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)} />

      <NavigationOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onNavigate={handleNavigate} />

      <main className="min-h-screen w-full">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {selectedSite && (
          <ArchiveDetail 
            site={selectedSite} 
            onClose={() => setSelectedSite(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
