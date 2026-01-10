import React, { useState, useCallback, useRef } from 'react';
import { getDesignOracleConsultation, generateDesignMoodboard } from '../services/geminiService';
import { DesignProfile } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Radar as RechartsRadar } from 'recharts';

const DesignOracle: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DesignProfile | null>(null);
  const [moodboardUrl, setMoodboardUrl] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState('center');
  
  const modalImageContainerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setMoodboardUrl(null);
    setImageLoaded(false);
    
    try {
      const data = await getDesignOracleConsultation(prompt);
      setResult(data);
      
      const imageUrl = await generateDesignMoodboard(data);
      setMoodboardUrl(imageUrl);
    } catch (err: any) {
      console.error("Consultation error:", err);
      if (err.message === "API_KEY_MISSING") {
        setError("API_KEY_MISSING");
      } else {
        setError("A disturbance was detected in the alchemical flow. The Oracle is temporarily unable to manifest your vision.");
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * High-end pan-and-zoom logic. 
   * When zoomed, the transform origin tracks the cursor to allow "panning" 
   * without needing scrollbars, typical of high-end design portfolios.
   */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || !modalImageContainerRef.current) return;
    
    const rect = modalImageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
  }, [isZoomed]);

  const toggleZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomOrigin(`${x}% ${y}%`);
      setIsZoomed(true);
    } else {
      setIsZoomed(false);
    }
  };

  const chartData = result ? [
    { subject: 'Structure', A: result.pietraRatio },
    { subject: 'Air', A: result.plumeRatio },
    { subject: 'Gravity', A: result.pietraRatio * 0.8 },
    { subject: 'Light', A: result.plumeRatio * 1.2 },
    { subject: 'History', A: result.pietraRatio },
    { subject: 'Innovation', A: result.plumeRatio },
    { subject: 'Eco', A: result.sustainabilityScore },
  ] : [];

  return (
    <section id="oracle" className="py-24 px-6 bg-stone-900 text-white overflow-hidden scroll-mt-32">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h4 className="text-xs tracking-[0.5em] uppercase text-stone-500">Architectural AI</h4>
          <h2 className="serif text-5xl font-light">The Design Oracle</h2>
          <p className="text-stone-400 max-w-xl mx-auto font-light">
            Describe your vision—a mood, a memory, or a dream space. Our intelligence will distill it into a Pietra & Plume profile.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="bg-stone-800/50 p-10 border border-stone-700/50 backdrop-blur-sm sticky top-32">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] tracking-widest uppercase text-stone-500">Your Vision</label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., A cliffside retreat that feels like an ancient library floating on the Aegean sea..."
                  className="w-full bg-stone-900 border-none p-6 text-stone-200 font-light focus:ring-1 focus:ring-stone-500 h-40 resize-none transition-all"
                />
              </div>
              <button 
                disabled={loading}
                className="w-full py-4 text-xs tracking-[0.4em] uppercase border border-stone-600 hover:bg-white hover:text-stone-900 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading && <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-white"></div>}
                {loading ? 'Synthesizing Vision...' : 'Consult the Oracle'}
              </button>
            </form>
            
            {loading && (
              <p className="mt-4 text-[10px] tracking-widest uppercase text-stone-500 text-center animate-pulse">
                Distilling stone and light into matter...
              </p>
            )}
          </div>

          <div className="relative min-h-[500px]">
            {!result && !loading && !error && (
              <div className="absolute inset-0 flex items-center justify-center text-stone-600 border-2 border-dashed border-stone-800 h-[500px]">
                <p className="italic font-light">Awaiting your input to reveal the profile...</p>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 flex items-center justify-center p-8 text-center border border-red-900/40 bg-red-950/10 rounded-sm h-[500px] animate-fade-in backdrop-blur-sm">
                <div className="space-y-8 max-w-sm">
                  <div className="relative mx-auto w-16 h-16">
                    <svg className="w-16 h-16 text-red-900 absolute inset-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div className="absolute inset-0 bg-red-500/10 blur-xl rounded-full"></div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="serif text-2xl italic text-red-100">Integration Interrupted</h3>
                    <p className="text-xs text-stone-400 font-light wooden-relaxed">
                      {error === "API_KEY_MISSING" 
                        ? "The Oracle's cognitive core is disconnected. An API Key is required to manifest architectural visions in this environment."
                        : error
                      }
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => setError(null)}
                      className="w-full py-3 bg-red-900/20 border border-red-800/50 text-[10px] tracking-[0.3em] uppercase text-red-200 hover:bg-red-900/40 transition-all"
                    >
                      Retry Connection
                    </button>
                    <a 
                      href="https://ai.google.dev" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-3 border border-stone-700 text-[10px] tracking-[0.3em] uppercase text-stone-500 hover:text-white hover:border-stone-500 transition-all"
                    >
                      Get API Key
                    </a>
                  </div>
                  
                  <p className="text-[9px] tracking-widest uppercase text-stone-600 italic">
                    Status: System Offline
                  </p>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-12 animate-fade-in">
                <div className="flex justify-between items-end border-b border-stone-800 pb-6">
                  <div>
                    <h3 className="text-xs tracking-widest uppercase text-stone-500 mb-1">Archetype</h3>
                    <p className="serif text-4xl italic text-white">{result.archetype}</p>
                  </div>
                  <div className="text-right flex flex-col gap-1">
                    <div>
                      <span className="text-[10px] tracking-widest uppercase text-stone-500">Balance (P/P)</span>
                      <p className="text-lg font-light text-stone-300">{result.pietraRatio} / {result.plumeRatio}</p>
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <span className="text-[10px] tracking-widest uppercase text-stone-500">Eco-Score</span>
                      <div className="w-12 h-1 bg-stone-800 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: `${result.sustainabilityScore}%` }}></div>
                      </div>
                      <span className="text-[10px] font-medium text-green-400">{result.sustainabilityScore}</span>
                    </div>
                  </div>
                </div>

                <div className="h-[300px] w-full bg-stone-800/20 rounded-xl p-4 border border-stone-800/50">
                   <h4 className="text-[10px] tracking-widest uppercase text-stone-500 mb-4 text-center">Comprehensive Analysis</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                      <PolarGrid stroke="#444" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 10 }} />
                      <RechartsRadar name="Design" dataKey="A" stroke="#d4cfc7" fill="#d4cfc7" fillOpacity={0.6} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-8">
                   <div className="space-y-6">
                      <h4 className="text-[10px] tracking-widest uppercase text-stone-500 text-center">Atmospheric Moodboard</h4>
                      <div 
                        className={`aspect-video w-full bg-stone-800/40 rounded-lg overflow-hidden border border-stone-700/50 relative shadow-2xl ${moodboardUrl && imageLoaded ? 'cursor-zoom-in group overflow-hidden' : 'cursor-default'}`}
                        onClick={() => moodboardUrl && imageLoaded && setIsExpanded(true)}
                      >
                        {/* Combined spinner with gentle pulse for high-end loading experience */}
                        {((loading && result) || (moodboardUrl && !imageLoaded)) && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-stone-400 z-10 bg-stone-900/60 backdrop-blur-md animate-fade-in">
                            <div className="relative w-16 h-16 flex items-center justify-center">
                              {/* Outer Spinning Ring */}
                              <div className="absolute inset-0 border-t-2 border-l-2 border-stone-500 rounded-full animate-spin"></div>
                              {/* Inner Pulsing Core */}
                              <div className="w-4 h-4 bg-stone-200 rounded-full animate-[gentle-pulse_2.5s_ease-in-out_infinite] shadow-[0_0_15px_rgba(255,255,255,0.4)]"></div>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                              <p className="text-[10px] tracking-[0.5em] uppercase font-light text-stone-300">
                                {loading ? 'Manifesting Materiality' : 'Calibrating Light'}
                              </p>
                              <div className="w-12 h-px bg-stone-800 relative overflow-hidden">
                                <div className="absolute top-0 left-0 h-full bg-stone-400 w-full -translate-x-full animate-[shimmer_2s_infinite]"></div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {moodboardUrl && (
                          <>
                            <img 
                              src={moodboardUrl} 
                              alt="Design Moodboard" 
                              onLoad={() => setImageLoaded(true)}
                              className={`w-full h-full object-cover transition-all duration-[2500ms] cubic-bezier(0.16, 1, 0.3, 1) ${
                                imageLoaded 
                                  ? 'opacity-100 scale-100 translate-y-0 blur-0 grayscale-0' 
                                  : 'opacity-0 scale-110 translate-y-4 blur-xl grayscale'
                              }`}
                            />
                            <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
                              <div className="flex flex-col items-center gap-3">
                                <svg className="w-8 h-8 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                                <span className="text-[10px] tracking-[0.4em] uppercase text-white font-light">
                                  Expand Vision
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                   </div>

                   {/* Suggested Materials Section - Visual Expansion */}
                   <div className="pt-8 border-t border-stone-800 animate-fade-in">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="h-px flex-1 bg-stone-800"></div>
                        <h4 className="text-[10px] tracking-[0.5em] uppercase text-stone-500">Suggested Materials</h4>
                        <div className="h-px flex-1 bg-stone-800"></div>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {result.materials.map((material, idx) => (
                          <div 
                            key={idx} 
                            className="bg-stone-800/20 border border-stone-700/50 p-4 rounded-sm flex flex-col gap-2 group hover:bg-stone-800/40 hover:border-stone-500 transition-all duration-500"
                          >
                            <span className="text-[8px] tracking-widest text-stone-600 uppercase">Item {String(idx + 1).padStart(2, '0')}</span>
                            <span className="text-xs text-stone-200 font-light italic leading-tight group-hover:text-white">{material}</span>
                            <div className="w-0 h-px bg-stone-400 group-hover:w-full transition-all duration-700 mt-1 opacity-40"></div>
                          </div>
                        ))}
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-stone-800">
                  <div className="space-y-4">
                    <h4 className="text-[10px] tracking-widest uppercase text-stone-500">Suggested Palette</h4>
                    <div className="flex gap-2">
                      {result.palette.map((color, i) => (
                        <div key={i} className="w-10 h-10 rounded-full border border-stone-700 shadow-lg" style={{ backgroundColor: color }} title={color} />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[10px] tracking-widest uppercase text-stone-500">Atmospheric Specs</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-400 group relative">
                          <svg className="w-4 h-4 animate-pulse text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
                          </svg>
                          <div className="absolute -inset-1 bg-white/5 rounded-full blur-md group-hover:bg-white/10 transition-all"></div>
                        </div>
                        <div>
                          <span className="text-[9px] tracking-tighter uppercase text-stone-500 block leading-none mb-1">Lighting Architecture</span>
                          <span className="text-xs text-stone-200 font-light italic">{result.lightingType}</span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-stone-400 leading-relaxed font-light italic pl-11">
                        <span className="text-stone-500 uppercase tracking-tighter mr-2">Ecosystem Score:</span> {result.sustainabilityScore}/100 Awareness
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <p className="serif text-2xl italic font-light text-stone-200 border-l-2 border-stone-500 pl-8 py-4 leading-relaxed bg-stone-800/30">
                    "{result.philosophy}"
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Immersive Expanded Modal with Dynamic Detail Pan */}
      {isExpanded && moodboardUrl && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-12 overflow-hidden">
          <div 
            className="absolute inset-0 bg-stone-950/98 backdrop-blur-3xl animate-fade-in" 
            onClick={() => { setIsExpanded(false); setIsZoomed(false); }}
          ></div>
          
          <div className="relative w-full h-full max-w-7xl flex flex-col items-center justify-center animate-scale-up z-10">
            {/* Top Toolbar */}
            <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-[120]">
              <div className="flex flex-col">
                 <span className="text-[10px] tracking-[0.5em] uppercase text-stone-500 mb-1">Detailed Inspection</span>
                 <span className="serif text-2xl italic text-white/90">{result?.archetype}</span>
              </div>
              
              <div className="flex items-center gap-8">
                <span className="text-[9px] tracking-[0.4em] uppercase text-stone-600 hidden md:block">
                  {isZoomed ? 'Move mouse to pan detail' : 'Click to toggle high-fidelity zoom'}
                </span>
                <button 
                  onClick={() => { setIsExpanded(false); setIsZoomed(false); }}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-stone-900 border border-stone-800 text-stone-400 hover:text-white hover:border-stone-600 transition-all duration-300 group shadow-lg"
                >
                  <svg className="w-5 h-5 transition-transform duration-500 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* The Manifestation Frame */}
            <div 
              ref={modalImageContainerRef}
              className="relative w-full h-full max-h-[75vh] md:max-h-[80vh] overflow-hidden bg-stone-900 border border-stone-800/50 shadow-[0_40px_100px_rgba(0,0,0,0.8)] flex items-center justify-center"
              onClick={toggleZoom}
              onMouseMove={handleMouseMove}
              style={{ cursor: isZoomed ? 'zoom-out' : 'zoom-in' }}
            >
              <img 
                src={moodboardUrl} 
                alt="Architectural Manifestation" 
                style={{ 
                  transform: isZoomed ? 'scale(2.8)' : 'scale(1)',
                  transformOrigin: zoomOrigin,
                  transition: isZoomed ? 'transform 0.15s ease-out, transform-origin 0.3s ease-out' : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                className="max-w-full max-h-full w-full h-full object-contain pointer-events-none"
              />
              
              {!isZoomed && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md px-8 py-4 border border-white/5 opacity-0 group-hover:opacity-100 transition-all duration-1000 flex items-center gap-4 animate-bounce">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                  <span className="text-[10px] tracking-[0.5em] uppercase text-stone-200">Inspect Materials</span>
                </div>
              )}
            </div>

            {/* Expanded Insight Dashboard */}
            <div className="mt-8 w-full space-y-8 animate-fade-in delay-200">
              {/* Material Manifest (Requested Change) */}
              <div className="w-full bg-stone-900/40 backdrop-blur-md p-6 border border-stone-800/50 rounded-sm">
                 <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <span className="text-[9px] tracking-[0.5em] uppercase text-stone-600 flex-shrink-0">Material Manifest</span>
                    <div className="flex flex-wrap gap-3">
                      {result?.materials.map((m, i) => (
                        <div key={i} className="group relative">
                          <span className="text-[10px] tracking-widest uppercase text-stone-300 px-4 py-2 border border-stone-800/80 bg-stone-950/30 font-light italic hover:border-stone-500 hover:text-white transition-all cursor-default block">
                            {m}
                          </span>
                          <div className="absolute -bottom-1 left-0 w-0 h-px bg-white/30 group-hover:w-full transition-all duration-500"></div>
                        </div>
                      ))}
                    </div>
                 </div>
              </div>

              {/* Bottom Insight Bar */}
              <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-8 px-4 md:px-0 opacity-80">
                <div className="space-y-2">
                  <span className="text-[8px] tracking-widest uppercase text-stone-600 block">Lighting Architecture</span>
                  <span className="text-xs text-stone-300 font-light italic">{result?.lightingType}</span>
                </div>
                <div className="space-y-2">
                  <span className="text-[8px] tracking-widest uppercase text-stone-600 block">Alchemical Balance (P/P)</span>
                  <span className="text-xs text-stone-300">{result?.pietraRatio} / {result?.plumeRatio}</span>
                </div>
                <div className="space-y-2 col-span-2">
                  <span className="text-[8px] tracking-widest uppercase text-stone-600 block">Manifestation Intent</span>
                  <p className="text-[11px] text-stone-400 font-light italic leading-relaxed">
                    "{result?.philosophy}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DesignOracle;