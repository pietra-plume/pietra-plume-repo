import React, { useState, useRef } from 'react';
import { generateVeoVideo } from '../../services/geminiService';
import { Video, Upload, Play, Film, Loader2, Image as ImageIcon, AlertCircle, RectangleHorizontal, Key, ExternalLink } from 'lucide-react';

interface VideoGeneratorProps {
  hasApiKey: boolean | null;
  onSelectKey: () => void;
}

export const VideoGenerator: React.FC<VideoGeneratorProps> = ({ hasApiKey, onSelectKey }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setGeneratedVideoUrl(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedVideoUrl(null);

    try {
      const videoUrl = await generateVeoVideo(selectedImage, prompt, aspectRatio);
      setGeneratedVideoUrl(videoUrl);
    } catch (err: any) {
      console.error("Video Generation Error:", err);
      // Reset key state if the entity wasn't found (likely key issue)
      if (err.message && err.message.includes("Requested entity was not found")) {
        setError("Your API key session might have expired. Please select a valid paid API key again.");
      } else {
        setError(err.message || "Failed to generate video. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section id="veo-studio" className="py-24 bg-white border-t border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-amber-600 font-bold tracking-widest text-xs uppercase mb-2 block">AI Video Studio</span>
          <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-4">Cinematic Walkthroughs</h2>
          <div className="w-24 h-1 bg-amber-600 mx-auto mb-6"></div>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Bring your designs to life with Veo. This premium feature requires a paid API key from a Google Cloud Project with billing enabled.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Controls */}
          <div className="space-y-8">
            {!hasApiKey ? (
              <div className="bg-stone-50 border-2 border-dashed border-amber-200 rounded-lg p-10 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Key size={32} />
                </div>
                <h3 className="text-xl font-serif text-stone-900 mb-3">Premium Access Required</h3>
                <p className="text-stone-600 text-sm mb-6 leading-relaxed">
                  To use the high-fidelity Veo video generator, you must select your own paid API key. 
                  Ensure your project has billing enabled.
                </p>
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={onSelectKey}
                    className="w-full py-4 bg-stone-900 text-white font-bold tracking-widest uppercase rounded-sm hover:bg-amber-600 transition-all flex items-center justify-center gap-2"
                  >
                    Select API Key
                  </button>
                  <a 
                    href="https://ai.google.dev/gemini-api/docs/billing" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-amber-600 flex items-center justify-center gap-1 hover:underline font-bold uppercase tracking-widest"
                  >
                    Billing Documentation <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in duration-500 space-y-8">
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
                    selectedImage ? 'border-amber-600 bg-amber-50' : 'border-stone-300 hover:border-amber-400 hover:bg-stone-50'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  {selectedImage ? (
                    <div className="relative w-full aspect-video rounded overflow-hidden shadow-sm">
                       <img src={selectedImage} alt="Selected" className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <span className="text-white font-bold uppercase text-xs tracking-widest flex items-center gap-2"><Upload size={16}/> Change Image</span>
                       </div>
                    </div>
                  ) : (
                    <div className="py-10">
                       <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 mx-auto mb-4">
                          <ImageIcon size={32} />
                       </div>
                       <p className="text-stone-900 font-bold mb-2">Upload Reference Image</p>
                       <p className="text-stone-500 text-sm">Click to browse your device</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Cinematic Prompt</label>
                    <textarea 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="E.g., Slow pan to the right, cinematic lighting, realistic textures..."
                      className="w-full p-4 bg-stone-50 border border-stone-200 rounded-sm focus:border-amber-600 focus:outline-none transition-colors h-32 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Aspect Ratio</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => setAspectRatio('16:9')}
                        className={`p-3 border rounded text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                          aspectRatio === '16:9' ? 'border-amber-600 bg-amber-600 text-white' : 'border-stone-200 text-stone-600 hover:border-stone-400'
                        }`}
                      >
                        <RectangleHorizontal size={18} /> Landscape (16:9)
                      </button>
                      <button 
                        onClick={() => setAspectRatio('9:16')}
                        className={`p-3 border rounded text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                          aspectRatio === '9:16' ? 'border-amber-600 bg-amber-600 text-white' : 'border-stone-200 text-stone-600 hover:border-stone-400'
                        }`}
                      >
                        <RectangleHorizontal size={18} className="rotate-90" /> Portrait (9:16)
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={handleGenerate}
                    disabled={!selectedImage || isGenerating}
                    className="w-full py-4 bg-stone-900 text-white font-bold tracking-widest uppercase rounded-sm hover:bg-amber-600 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl mt-4"
                  >
                    {isGenerating ? (
                       <>
                         <Loader2 className="animate-spin" size={20} /> Generating Veo Video...
                       </>
                    ) : (
                       <>
                         <Film size={20} /> Generate Video
                       </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Result Preview */}
          <div className="bg-stone-900 rounded-lg p-1 shadow-2xl overflow-hidden min-h-[400px] flex flex-col relative">
             <div className="absolute top-4 left-4 z-10 flex gap-2">
                 <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1">
                    <Video size={10} /> Live Preview
                 </div>
             </div>

             {generatedVideoUrl ? (
                <div className="relative w-full h-full flex-grow bg-black flex items-center justify-center">
                   <video 
                     src={generatedVideoUrl} 
                     controls 
                     autoPlay 
                     loop 
                     className="max-w-full max-h-[600px] w-auto h-auto"
                   />
                </div>
             ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-stone-600 p-12 text-center">
                    {isGenerating ? (
                        <div className="flex flex-col items-center animate-pulse">
                            <div className="w-20 h-20 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-6"></div>
                            <h3 className="text-white font-serif text-xl mb-2">Creating your scene...</h3>
                            <p className="text-stone-400 text-sm max-w-xs">Veo is processing your image and prompt to generate a high-fidelity video.</p>
                        </div>
                    ) : (
                        <>
                           <div className="w-24 h-24 rounded-full bg-stone-800 flex items-center justify-center mb-6 text-stone-700">
                               <Play size={40} className="ml-2" />
                           </div>
                           <h3 className="text-stone-300 font-serif text-lg mb-2">No Video Generated Yet</h3>
                           <p className="text-sm">Upload an image and click generate to see the magic.</p>
                        </>
                    )}
                </div>
             )}
             
             {error && (
                <div className="absolute bottom-4 left-4 right-4 bg-red-500/90 text-white p-4 rounded backdrop-blur-sm flex items-start gap-3">
                   <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                   <p className="text-sm">{error}</p>
                </div>
             )}
          </div>
        </div>
      </div>
    </section>
  );
};