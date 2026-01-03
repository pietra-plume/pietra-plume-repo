import React, { useState, useEffect } from 'react';
import { ROOM_CONFIGS, ART_INSPIRATIONS } from '../constants';
import { RoomType, UserSelection, CategoryOptions, Artist, GeneratedDesign } from '../types';
import { generateRoomImage, generateDesignSummary } from '../services/geminiService';
import { Loader2, Wand2, RefreshCw, ChevronRight, Palette, Info } from 'lucide-react';

interface DesignStudioProps {
  onDesignGenerated?: (design: GeneratedDesign) => void;
}

export const DesignStudio: React.FC<DesignStudioProps> = ({ onDesignGenerated }) => {
  const [activeRoom, setActiveRoom] = useState<RoomType>(RoomType.LIVING_ROOM);
  const [selections, setSelections] = useState<Record<RoomType, UserSelection>>({
    [RoomType.LIVING_ROOM]: {},
    [RoomType.BEDROOM]: {},
    [RoomType.KITCHEN]: {},
    [RoomType.DINING]: {},
    [RoomType.BALCONY]: {},
    [RoomType.HOME_OFFICE]: {},
  });
  
  // New state for Artist Inspiration
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(-1); // -1 means no category selected
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedText, setGeneratedText] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentConfig = ROOM_CONFIGS[activeRoom];

  // Initialize default selections
  useEffect(() => {
    const defaultSelection: UserSelection = {};
    Object.keys(currentConfig).forEach(key => {
        // Default to first option
        defaultSelection[key] = currentConfig[key].options[0].value;
    });
    setSelections(prev => ({
        ...prev,
        [activeRoom]: { ...defaultSelection, ...prev[activeRoom] }
    }));
  }, [activeRoom, currentConfig]);

  const handleSelectionChange = (category: string, value: string) => {
    setSelections(prev => ({
      ...prev,
      [activeRoom]: {
        ...prev[activeRoom],
        [category]: value
      }
    }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);
    try {
      const summary = await generateDesignSummary(activeRoom, selections[activeRoom], selectedArtist);
      setGeneratedText(summary);
      
      const imageBase64 = await generateRoomImage(activeRoom, selections[activeRoom], selectedArtist);
      setGeneratedImage(imageBase64);

      // Notify parent app of new design
      if (onDesignGenerated) {
        // Construct a simple palette string from selections
        const palette = Object.values(selections[activeRoom]).join(', ');
        onDesignGenerated({
          roomType: activeRoom,
          imageUrl: imageBase64,
          palette: selectedArtist ? `${palette} (Inspired by ${selectedArtist.name})` : palette,
          attributes: generatedText
        });
      }

    } catch (err) {
      setError("We couldn't generate the visualization at this moment. Please try again.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleArtistChange = (artistId: string) => {
      if (activeCategoryIndex === -1) return;
      const artist = ART_INSPIRATIONS[activeCategoryIndex].artists.find(a => a.id === artistId);
      setSelectedArtist(artist || null);
  };

  return (
    <section id="studio" className="py-24 bg-stone-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <span className="text-amber-600 font-bold tracking-widest text-xs uppercase mb-2 block">Interactive Tool</span>
            <h2 className="text-3xl md:text-4xl font-serif text-stone-900">Custom Design Studio</h2>
            <p className="text-stone-600 mt-4">Pick and choose every detail. Use AI to visualize the Art of Possible.</p>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-stone-200 flex flex-col lg:flex-row min-h-[800px]">
          {/* Sidebar Room Selector */}
          <div className="w-full lg:w-64 bg-stone-900 text-stone-300 p-6 flex flex-col gap-2">
            <h3 className="text-white font-serif text-xl mb-6 px-2">Select Space</h3>
            {Object.values(RoomType).map((room) => (
              <button
                key={room}
                onClick={() => {
                    setActiveRoom(room);
                    setGeneratedImage(null);
                    setGeneratedText("");
                }}
                className={`text-left px-4 py-3 rounded-md transition-all duration-200 flex justify-between items-center group ${
                  activeRoom === room 
                  ? 'bg-amber-600 text-white shadow-lg' 
                  : 'hover:bg-stone-800 hover:text-white'
                }`}
              >
                <span className="text-sm font-medium tracking-wide">{room}</span>
                {activeRoom === room && <ChevronRight size={16} />}
              </button>
            ))}
          </div>

          {/* Configuration Area */}
          <div className="flex-1 p-8 border-r border-stone-100 overflow-y-auto max-h-[1000px]">
            <div className="flex justify-between items-end mb-8 border-b border-stone-100 pb-4">
                <div>
                    <h3 className="text-2xl font-serif text-stone-900">{activeRoom}</h3>
                    <p className="text-xs text-stone-500 uppercase tracking-wider mt-1">Configure your elements</p>
                </div>
                <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100">
                   {Object.keys(currentConfig).length} Categories Available
                </div>
            </div>

            {/* ARTIST INSPIRATION SECTION */}
            <div className="mb-10 p-6 bg-stone-50 border border-stone-200 rounded-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Palette size={100} />
                </div>
                
                <div className="flex items-center gap-2 mb-4 relative z-10">
                    <div className="p-2 bg-amber-600 text-white rounded-full">
                        <Palette size={16} />
                    </div>
                    <h4 className="text-lg font-serif font-bold text-stone-900">Design Muse (Optional)</h4>
                </div>
                <p className="text-sm text-stone-500 mb-6 relative z-10 max-w-lg">
                    Infuse your design with the soul of a master artist. Select a style category and an artist to guide the AI's visualization.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Artistic Era / Style</label>
                        <select 
                            className="w-full p-3 bg-white border border-stone-300 rounded-sm focus:border-amber-600 focus:outline-none text-sm text-stone-700"
                            value={activeCategoryIndex}
                            onChange={(e) => {
                                setActiveCategoryIndex(Number(e.target.value));
                                setSelectedArtist(null);
                            }}
                        >
                            <option value={-1}>-- No Inspiration (Standard) --</option>
                            {ART_INSPIRATIONS.map((cat, idx) => (
                                <option key={cat.id} value={idx}>{cat.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className={activeCategoryIndex === -1 ? "opacity-50 pointer-events-none" : ""}>
                        <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Select Artist</label>
                        <select 
                            className="w-full p-3 bg-white border border-stone-300 rounded-sm focus:border-amber-600 focus:outline-none text-sm text-stone-700"
                            value={selectedArtist?.id || ""}
                            onChange={(e) => handleArtistChange(e.target.value)}
                            disabled={activeCategoryIndex === -1}
                        >
                            <option value="">-- Select Artist --</option>
                            {activeCategoryIndex !== -1 && ART_INSPIRATIONS[activeCategoryIndex].artists.map((artist) => (
                                <option key={artist.id} value={artist.id}>{artist.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {selectedArtist && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded text-xs text-amber-900 flex gap-2 animate-in fade-in slide-in-from-top-2">
                        <Info size={14} className="flex-shrink-0 mt-0.5" />
                        <p><span className="font-bold">{selectedArtist.name}:</span> {selectedArtist.styleDescription}</p>
                    </div>
                )}
            </div>

            <div className="space-y-8">
              {Object.entries(currentConfig).map(([key, val]) => {
                const config = val as CategoryOptions;
                return (
                  <div key={key}>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">
                      {config.label}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {config.options.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleSelectionChange(key, option.value)}
                          className={`p-3 text-sm text-left border rounded transition-all duration-200 relative overflow-hidden ${
                            selections[activeRoom][key] === option.value
                              ? 'border-amber-600 bg-amber-50 text-amber-900 ring-1 ring-amber-600'
                              : 'border-stone-200 text-stone-600 hover:border-stone-400'
                          }`}
                        >
                          <span className="relative z-10">{option.name}</span>
                          {selections[activeRoom][key] === option.value && (
                              <div className="absolute bottom-0 right-0 w-4 h-4 bg-amber-600 flex items-center justify-center rounded-tl-md">
                                  <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                              </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-10 pt-6 border-t border-stone-100">
                 <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full py-4 bg-stone-900 text-white rounded-sm hover:bg-stone-800 transition-colors flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
                 >
                    {isGenerating ? (
                        <>
                            <Loader2 className="animate-spin" /> Generating Vision...
                        </>
                    ) : (
                        <>
                            <Wand2 size={20} className="text-amber-400" /> Visualize This Design
                        </>
                    )}
                 </button>
            </div>
          </div>

          {/* Visualization Area */}
          <div className="w-full lg:w-[500px] bg-stone-50 p-8 flex flex-col">
            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-6">Preview</h3>
            
            <div className="flex-grow bg-white border-2 border-dashed border-stone-200 rounded-lg flex items-center justify-center relative overflow-hidden group min-h-[400px]">
                {generatedImage ? (
                    <img 
                        src={generatedImage} 
                        alt="AI Generated Design" 
                        className="w-full h-full object-cover animate-in fade-in duration-700"
                    />
                ) : (
                     <div className="text-center p-8">
                         {isGenerating ? (
                             <div className="flex flex-col items-center gap-4">
                                <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-stone-500 animate-pulse">Consulting our AI designers...</p>
                                {selectedArtist && (
                                    <p className="text-xs text-amber-600 italic">Channeling {selectedArtist.name}...</p>
                                )}
                             </div>
                         ) : (
                             <>
                                <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-300">
                                    <RefreshCw size={32} />
                                </div>
                                <p className="text-stone-400">Configure your room and click "Visualize" to see the magic.</p>
                             </>
                         )}
                     </div>
                )}
            </div>

            <div className="mt-6 min-h-[100px]">
                {generatedText && (
                    <div className="bg-white p-4 rounded border-l-4 border-amber-600 shadow-sm animate-in slide-in-from-bottom-2">
                        <p className="text-stone-600 text-sm italic leading-relaxed">"{generatedText}"</p>
                    </div>
                )}
                {error && (
                     <div className="bg-red-50 p-4 rounded border-l-4 border-red-500">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};