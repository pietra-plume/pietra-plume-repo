import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { WhyAgile } from './components/WhyAgile';
import { AgileProcess } from './components/AgileProcess';
import { HolidayPerk } from './components/HolidayPerk';
import { DesignStudio } from './components/DesignStudio';
import { VideoGenerator } from './components/VideoGenerator';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { ConsultationModal } from './components/ConsultationModal';
import { Portfolio } from './components/Portfolio';
import { SmartPlanner } from './components/SmartPlanner';
import { AIChatbot } from './components/AIChatbot';
import { GeneratedDesign } from './types';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studioDesign, setStudioDesign] = useState<GeneratedDesign | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      const win = window as any;
      if (win.aistudio && typeof win.aistudio.hasSelectedApiKey === 'function') {
        const selected = await win.aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      } else {
        // Fallback for non-AI Studio environments or standard process.env.API_KEY usage
        setHasApiKey(true);
      }
    };
    checkKey();
  }, []);

  const handleDesignGenerated = (design: GeneratedDesign) => {
    setStudioDesign(design);
  };

  const handleOpenKeySelector = async () => {
    const win = window as any;
    if (win.aistudio && typeof win.aistudio.openSelectKey === 'function') {
      await win.aistudio.openSelectKey();
      // Assume success to mitigate race condition as per guidelines
      setHasApiKey(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
      <Navbar onBook={() => setIsModalOpen(true)} />
      
      <main className="flex-grow">
        <Hero onBook={() => setIsModalOpen(true)} />
        <WhyAgile />
        <AgileProcess />
        <Portfolio />
        <DesignStudio onDesignGenerated={handleDesignGenerated} />
        <VideoGenerator hasApiKey={hasApiKey} onSelectKey={handleOpenKeySelector} />
        <SmartPlanner studioDesign={studioDesign} />
        <HolidayPerk />
      </main>

      <Footer />
      
      <AIChatbot />

      {isModalOpen && (
        <ConsultationModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}