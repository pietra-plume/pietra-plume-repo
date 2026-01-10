import React, { useState, useRef, useEffect } from 'react';
import { RoomType, FurnitureItem, PlannerItem, GeneratedDesign } from '../../types';
import { FURNITURE_CATALOG } from '../../constants';
import { generateLayoutSuggestion } from '../../services/geminiService';
import { 
  Maximize, 
  Move, 
  Trash2, 
  RotateCw, 
  Bot, 
  LayoutGrid, 
  Palette,
  Armchair,
  Refrigerator,
  Flame,
  Droplets,
  Waves,
  Box,
  Monitor,
  Library,
  DoorClosed,
  Bed,
  Table,
  Wine,
  RectangleHorizontal,
  LayoutList,
  Tv,
  Square,
  Flower2,
  Coffee,
  RockingChair,
  Info,
  Save,
  FolderOpen,
  Image as ImageIcon,
  Eye,
  ArrowDownToLine
} from 'lucide-react';

const Icons: Record<string, React.ElementType> = {
  Armchair, Refrigerator, Flame, Droplets, Waves, Box, Monitor, Library, 
  DoorClosed, Bed, Table, Wine, RectangleHorizontal, LayoutList, Tv, 
  Square, Flower2, Coffee, RockingChair
};

interface SmartPlannerProps {
  studioDesign?: GeneratedDesign | null;
}

export const SmartPlanner: React.FC<SmartPlannerProps> = ({ studioDesign }) => {
  const [activeRoom, setActiveRoom] = useState<RoomType>(RoomType.KITCHEN);
  const [roomWidth, setRoomWidth] = useState(12); // Feet
  const [roomDepth, setRoomDepth] = useState(10); // Feet
  const [colorPalette, setColorPalette] = useState("Modern White & Grey");
  
  const [itemsOnCanvas, setItemsOnCanvas] = useState<PlannerItem[]>([]);
  const [draggedItem, setDraggedItem] = useState<FurnitureItem | null>(null);
  const [draggedCanvasItemIndex, setDraggedCanvasItemIndex] = useState<number | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiReasoning, setAiReasoning] = useState<string>("");
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // New state for background overlay
  const [showDesignBackground, setShowDesignBackground] = useState(false);
  const [backgroundOpacity, setBackgroundOpacity] = useState(50);
  
  const canvasRef = useRef<HTMLDivElement>(null);

  // When a studio design is passed, show notification or logic can be added here
  // But we let the user explicitly click "Import" to avoid overriding their work unintentionally

  // Clear canvas when room changes
  useEffect(() => {
    setItemsOnCanvas([]);
    setAiReasoning("");
    setSaveStatus(null);
    setShowDesignBackground(false); // Reset background when room changes
  }, [activeRoom]);

  // --- Persistence Logic ---

  const handleSave = () => {
    const layoutData = {
      roomWidth,
      roomDepth,
      colorPalette,
      itemsOnCanvas,
      savedAt: new Date().toISOString()
    };
    try {
      localStorage.setItem(`pietra_planner_${activeRoom}`, JSON.stringify(layoutData));
      setSaveStatus("Layout Saved!");
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (e) {
      console.error("Save failed", e);
      setSaveStatus("Save Failed");
    }
  };

  const handleLoad = () => {
    try {
      const saved = localStorage.getItem(`pietra_planner_${activeRoom}`);
      if (saved) {
        const data = JSON.parse(saved);
        setRoomWidth(data.roomWidth);
        setRoomDepth(data.roomDepth);
        setColorPalette(data.colorPalette);
        setItemsOnCanvas(data.itemsOnCanvas || []);
        setSaveStatus("Layout Loaded!");
        setTimeout(() => setSaveStatus(null), 2000);
      } else {
        setSaveStatus("No saved layout");
        setTimeout(() => setSaveStatus(null), 2000);
      }
    } catch (e) {
       console.error("Load failed", e);
       setSaveStatus("Load Failed");
    }
  };

  const handleImportStudioDesign = () => {
    if (studioDesign) {
      setActiveRoom(studioDesign.roomType);
      setColorPalette(studioDesign.palette.slice(0, 30) + "..."); // Shorten palette for display
      setShowDesignBackground(true);
      setSaveStatus("Studio Design Imported!");
      setTimeout(() => setSaveStatus(null), 2000);
    }
  };

  // --- Drag and Drop Logic ---

  const handleDragStartCatalog = (e: React.DragEvent, item: FurnitureItem) => {
    setDraggedItem(item);
    setDraggedCanvasItemIndex(null);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragStartCanvas = (e: React.DragEvent, index: number) => {
    setDraggedCanvasItemIndex(index);
    setDraggedItem(null);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = draggedCanvasItemIndex !== null ? "move" : "copy";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert pixels to percentage to be responsive
    const xPercent = Math.min(Math.max((x / rect.width) * 100, 0), 95);
    const yPercent = Math.min(Math.max((y / rect.height) * 100, 0), 95);

    if (draggedItem) {
      // New Item from Catalog
      const newItem: PlannerItem = {
        ...draggedItem,
        instanceId: Date.now().toString(),
        x: xPercent,
        y: yPercent,
        rotation: 0
      };
      setItemsOnCanvas(prev => [...prev, newItem]);
    } else if (draggedCanvasItemIndex !== null) {
      // Moving existing item
      setItemsOnCanvas(prev => {
        const updated = [...prev];
        updated[draggedCanvasItemIndex] = {
          ...updated[draggedCanvasItemIndex],
          x: xPercent,
          y: yPercent
        };
        return updated;
      });
    }
    
    setDraggedItem(null);
    setDraggedCanvasItemIndex(null);
  };

  const handleRotate = (index: number) => {
    setItemsOnCanvas(prev => {
      const updated = [...prev];
      updated[index].rotation = (updated[index].rotation + 90) % 360;
      return updated;
    });
  };

  const handleDelete = (index: number) => {
    setItemsOnCanvas(prev => prev.filter((_, i) => i !== index));
  };

  // --- AI Logic ---

  const handleAutoLayout = async () => {
    if (itemsOnCanvas.length === 0) {
        // If empty, add default items for the room to start with
        const defaults = FURNITURE_CATALOG[activeRoom].slice(0, 4);
        setItemsOnCanvas(defaults.map((d, i) => ({
            ...d, 
            instanceId: `auto-${i}`, 
            x: 50, 
            y: 50, 
            rotation: 0 
        })));
        // Then arrange them
        setTimeout(() => performAiLayout(defaults.map(d => ({ ...d, instanceId: 'temp', x:0, y:0, rotation:0 }))), 100);
    } else {
        performAiLayout(itemsOnCanvas);
    }
  };

  const performAiLayout = async (items: PlannerItem[]) => {
    setIsGenerating(true);
    setAiReasoning("");
    try {
      const suggestion = await generateLayoutSuggestion(
        activeRoom, 
        roomWidth, 
        roomDepth, 
        items,
        colorPalette
      );
      
      setAiReasoning(suggestion.reasoning);
      
      const newLayout = [...items];
      
      suggestion.items.forEach(suggested => {
        const targetIndex = newLayout.findIndex(i => i.name === suggested.name);
        if (targetIndex !== -1) {
            newLayout[targetIndex] = {
                ...newLayout[targetIndex],
                x: suggested.x,
                y: suggested.y,
                rotation: suggested.rotation
            };
        }
      });
      
      setItemsOnCanvas(newLayout);

    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes("API Key")) {
         setAiReasoning("AI Layout unavailable: API Key missing.");
      } else {
         setAiReasoning("Could not generate layout. Try dragging items manually.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // --- Render Helpers ---

  const getPixelDimensions = (itemW: number, itemD: number, rotation: number) => {
    const isRotated = rotation % 180 !== 0;
    const effectiveW = isRotated ? itemD : itemW;
    const effectiveD = isRotated ? itemW : itemD;

    return {
      width: `${(effectiveW / roomWidth) * 100}%`,
      height: `${(effectiveD / roomDepth) * 100}%`
    };
  };

  // --- Derived background styles ---
  
  // Base grid
  let backgroundStyle: React.CSSProperties = {
     backgroundImage: 'linear-gradient(to right, #292524 1px, transparent 1px), linear-gradient(to bottom, #292524 1px, transparent 1px)',
     backgroundSize: `${100/roomWidth}% ${100/roomDepth}%`
  };

  // If Studio Image is active
  if (showDesignBackground && studioDesign?.imageUrl) {
     backgroundStyle = {
         backgroundImage: `url(${studioDesign.imageUrl})`,
         backgroundSize: 'cover',
         backgroundPosition: 'center',
         opacity: 1 // We handle opacity in a pseudo element or wrapper usually, but for simple layer we might need a wrapper
     };
  }

  return (
    <section id="planner" className="py-24 bg-stone-900 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
           <span className="text-amber-500 font-bold tracking-widest text-xs uppercase mb-2 block">Agile Space Planning</span>
           <h2 className="text-3xl md:text-4xl font-serif text-white">Smart Layout Planner</h2>
           <p className="text-stone-400 mt-4 max-w-2xl mx-auto">
             Don't just guess. Plan your {activeRoom} with precision. 
             Define dimensions, drag appliances to scale, and let AI optimize your flow.
           </p>
        </div>

        <div className="bg-stone-800 rounded-xl overflow-hidden border border-stone-700 shadow-2xl flex flex-col xl:flex-row min-h-[800px]">
          
          {/* Controls Sidebar */}
          <div className="w-full xl:w-80 bg-stone-950 p-6 flex flex-col border-r border-stone-800 gap-6">
            
            {/* Studio Integration Panel */}
            {studioDesign && (
              <div className="bg-gradient-to-br from-amber-900/40 to-stone-900 p-4 rounded border border-amber-800/50 mb-2">
                <div className="flex items-start gap-3 mb-3">
                    <img 
                        src={studioDesign.imageUrl} 
                        alt="Studio Preview" 
                        className="w-16 h-16 object-cover rounded border border-stone-600" 
                    />
                    <div>
                        <h4 className="text-xs font-bold text-amber-500 uppercase">Studio Design Ready</h4>
                        <p className="text-[10px] text-stone-400 mt-1">{studioDesign.roomType}</p>
                    </div>
                </div>
                <button 
                    onClick={handleImportStudioDesign}
                    className="w-full py-2 bg-amber-700/50 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wider rounded border border-amber-600/50 flex items-center justify-center gap-2 transition-colors"
                >
                    <ArrowDownToLine size={14} /> Import to Planner
                </button>
              </div>
            )}

            {/* Room Settings */}
            <div className="space-y-4 pb-6 border-b border-stone-800">
               <h3 className="text-white font-serif text-lg flex items-center gap-2">
                 <Maximize size={18} className="text-amber-500"/> Dimensions
               </h3>
               
               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-xs text-stone-500 uppercase font-bold">Width (ft)</label>
                    <input 
                      type="number" 
                      value={roomWidth} 
                      onChange={(e) => setRoomWidth(Number(e.target.value))}
                      className="w-full bg-stone-900 border border-stone-700 text-white p-2 rounded mt-1 focus:border-amber-500 outline-none"
                    />
                 </div>
                 <div>
                    <label className="text-xs text-stone-500 uppercase font-bold">Depth (ft)</label>
                    <input 
                      type="number" 
                      value={roomDepth} 
                      onChange={(e) => setRoomDepth(Number(e.target.value))}
                      className="w-full bg-stone-900 border border-stone-700 text-white p-2 rounded mt-1 focus:border-amber-500 outline-none"
                    />
                 </div>
               </div>

               <div>
                 <label className="text-xs text-stone-500 uppercase font-bold flex items-center gap-2 mb-1">
                    <Palette size={12}/> Color Palette
                 </label>
                 <select 
                    value={colorPalette}
                    onChange={(e) => setColorPalette(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 text-white p-2 rounded outline-none"
                 >
                    <option>Modern White & Grey</option>
                    <option>Warm Earth Tones</option>
                    <option>Industrial Black & Brick</option>
                    <option>Scandinavian Pastel</option>
                 </select>
               </div>
            </div>

            {/* Room Type Selector */}
            <div className="pb-6 border-b border-stone-800">
                <label className="text-xs text-stone-500 uppercase font-bold block mb-2">Room Type</label>
                <div className="grid grid-cols-2 gap-2">
                    {Object.values(RoomType).map(type => (
                        <button
                            key={type}
                            onClick={() => setActiveRoom(type)}
                            className={`text-xs px-2 py-2 rounded text-left truncate ${
                                activeRoom === type ? 'bg-amber-600 text-white' : 'bg-stone-900 text-stone-400 hover:bg-stone-800'
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Save/Load Controls */}
            <div className="pb-6 border-b border-stone-800">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-xs text-stone-500 uppercase font-bold">Project</label>
                    {saveStatus && <span className="text-xs text-amber-500 animate-pulse">{saveStatus}</span>}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleSave}
                        className="flex-1 bg-stone-900 border border-stone-700 hover:border-amber-500 hover:text-amber-500 text-stone-300 text-xs py-2 px-3 rounded flex items-center justify-center gap-2 transition-all"
                    >
                        <Save size={14} /> Save
                    </button>
                    <button
                        onClick={handleLoad}
                        className="flex-1 bg-stone-900 border border-stone-700 hover:border-amber-500 hover:text-amber-500 text-stone-300 text-xs py-2 px-3 rounded flex items-center justify-center gap-2 transition-all"
                    >
                        <FolderOpen size={14} /> Load
                    </button>
                </div>
            </div>

            {/* Item Catalog */}
            <div className="flex-grow overflow-y-auto">
                <h3 className="text-white font-serif text-lg flex items-center gap-2 mb-4">
                    <LayoutGrid size={18} className="text-amber-500"/> Components
                </h3>
                <p className="text-xs text-stone-500 mb-4">Drag these items onto the grid.</p>
                
                <div className="grid grid-cols-2 gap-3">
                    {FURNITURE_CATALOG[activeRoom].map((item) => {
                        const Icon = Icons[item.icon] || Box;
                        return (
                            <div 
                                key={item.id}
                                draggable
                                onDragStart={(e) => handleDragStartCatalog(e, item)}
                                className="bg-stone-900 p-3 rounded border border-stone-700 hover:border-amber-500 cursor-grab active:cursor-grabbing group transition-all"
                            >
                                <div className="flex justify-center mb-2 text-stone-400 group-hover:text-amber-500">
                                    <Icon size={24} />
                                </div>
                                <div className="text-xs text-center font-medium text-stone-300">{item.name}</div>
                                <div className="text-[10px] text-center text-stone-600 mt-1">{item.width}' x {item.depth}'</div>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            {/* AI Action */}
            <div>
                 <button
                    onClick={handleAutoLayout}
                    disabled={isGenerating}
                    className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded shadow-lg hover:from-amber-500 hover:to-amber-600 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                 >
                    {isGenerating ? <RotateCw className="animate-spin" size={18} /> : <Bot size={18} />}
                    {itemsOnCanvas.length === 0 ? "Generate & Arrange Layout" : "Optimize Layout with AI"}
                 </button>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 bg-stone-800 relative flex flex-col">
            {/* Canvas Header */}
            <div className="h-16 border-b border-stone-700 flex items-center justify-between px-6 bg-stone-800/50 backdrop-blur">
                <div className="flex items-center gap-4">
                    <span className="text-stone-400 text-sm">Grid Scale: 1 Block = 1 Sq Ft (approx)</span>
                </div>
                <div className="flex items-center gap-4">
                    {/* Background Toggle Controls */}
                    {studioDesign && studioDesign.roomType === activeRoom && (
                        <div className="flex items-center gap-3 bg-stone-900/50 px-3 py-1.5 rounded-full border border-stone-700">
                            <span className="text-[10px] uppercase font-bold text-stone-500">Backdrop:</span>
                            <button 
                                onClick={() => setShowDesignBackground(false)}
                                className={`p-1 rounded ${!showDesignBackground ? 'text-amber-500 bg-amber-500/10' : 'text-stone-500'}`}
                                title="Show Grid"
                            >
                                <LayoutGrid size={14} />
                            </button>
                            <button 
                                onClick={() => setShowDesignBackground(true)}
                                className={`p-1 rounded ${showDesignBackground ? 'text-amber-500 bg-amber-500/10' : 'text-stone-500'}`}
                                title="Show Studio Image"
                            >
                                <ImageIcon size={14} />
                            </button>
                            {showDesignBackground && (
                                <input 
                                    type="range" 
                                    min="10" 
                                    max="100" 
                                    value={backgroundOpacity} 
                                    onChange={(e) => setBackgroundOpacity(Number(e.target.value))}
                                    className="w-16 h-1 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                />
                            )}
                        </div>
                    )}

                    {aiReasoning && (
                        <div className="text-xs text-amber-400 bg-amber-900/30 px-3 py-1 rounded-full border border-amber-900/50 flex items-center gap-2 animate-in fade-in">
                            <Info size={12}/> AI Insight: {aiReasoning}
                        </div>
                    )}
                </div>
            </div>

            {/* The Grid Canvas */}
            <div className="flex-grow p-8 overflow-hidden relative flex items-center justify-center bg-[#1c1917]">
                <div 
                    ref={canvasRef}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="relative bg-stone-900 shadow-2xl border-2 border-stone-600 transition-all duration-500"
                    style={{
                        width: '100%',
                        maxWidth: '800px',
                        aspectRatio: `${roomWidth} / ${roomDepth}`,
                    }}
                >
                     {/* Background Layers */}
                     {/* 1. Grid Layer */}
                     {!showDesignBackground && (
                        <div 
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                backgroundImage: 'linear-gradient(to right, #292524 1px, transparent 1px), linear-gradient(to bottom, #292524 1px, transparent 1px)',
                                backgroundSize: `${100/roomWidth}% ${100/roomDepth}%` 
                            }}
                        />
                     )}

                     {/* 2. Image Layer */}
                     {showDesignBackground && studioDesign && (
                        <div 
                            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                            style={{
                                backgroundImage: `url(${studioDesign.imageUrl})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                opacity: backgroundOpacity / 100
                            }}
                        />
                     )}

                    {/* Measurements Label */}
                    <div className="absolute -top-6 left-0 w-full text-center text-xs text-stone-500 font-mono">{roomWidth} ft</div>
                    <div className="absolute top-0 -left-6 h-full flex items-center text-xs text-stone-500 font-mono" style={{writingMode: 'vertical-rl'}}>{roomDepth} ft</div>

                    {/* Dropped Items */}
                    {itemsOnCanvas.map((item, index) => {
                         const Icon = Icons[item.icon] || Box;
                         const dims = getPixelDimensions(item.width, item.depth, item.rotation);
                         
                         return (
                            <div
                                key={item.instanceId}
                                draggable
                                onDragStart={(e) => handleDragStartCanvas(e, index)}
                                className="absolute cursor-grab active:cursor-grabbing group hover:z-50"
                                style={{
                                    left: `${item.x}%`,
                                    top: `${item.y}%`,
                                    width: dims.width,
                                    height: dims.height,
                                    backgroundColor: showDesignBackground ? `${item.defaultColor}dd` : item.defaultColor, // Slight transparency if image is bg
                                    // Center the transformation origin for rotation
                                    transform: `translate(-50%, -50%)`, 
                                }}
                            >
                                <div className="w-full h-full relative border border-white/20 shadow-sm flex items-center justify-center overflow-hidden">
                                    <Icon 
                                        size={16} 
                                        className="text-stone-900/50 transition-transform duration-300"
                                        style={{ transform: `rotate(${item.rotation}deg)` }} 
                                    />
                                    
                                    {/* Item Controls (Show on Hover) */}
                                    <div 
                                        className="absolute -top-8 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 flex gap-2 items-center pointer-events-auto shadow-lg border border-stone-700"
                                        onMouseDown={(e) => e.stopPropagation()} // Prevent dragging when clicking controls
                                    >
                                        <span className="font-bold">{item.name}</span>
                                        <div className="h-3 w-[1px] bg-stone-700 mx-1"></div>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRotate(index);
                                            }} 
                                            className="hover:text-amber-500 p-1 hover:bg-stone-800 rounded transition-colors"
                                            title="Rotate 90°"
                                        >
                                            <RotateCw size={12}/>
                                        </button>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(index);
                                            }} 
                                            className="hover:text-red-500 p-1 hover:bg-stone-800 rounded transition-colors"
                                            title="Delete Item"
                                        >
                                            <Trash2 size={12}/>
                                        </button>
                                    </div>
                                    
                                    {/* Dimensions indicator */}
                                    <div className="absolute bottom-0 right-0 bg-black/50 text-[8px] text-white px-1">
                                        {item.width}'x{item.depth}'
                                    </div>
                                </div>
                            </div>
                         );
                    })}

                    {itemsOnCanvas.length === 0 && !isGenerating && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                             <div className="text-center">
                                <p className="text-stone-700 font-bold text-xl uppercase tracking-widest opacity-20">Drop Items Here</p>
                                {showDesignBackground && <p className="text-amber-500/50 text-xs mt-2 uppercase tracking-wider">Tracing Mode Active</p>}
                             </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Legend / Instructions */}
            <div className="h-12 bg-stone-950 border-t border-stone-800 flex items-center justify-between px-6 text-xs text-stone-500">
                <div className="flex gap-4">
                    <span className="flex items-center gap-1"><Move size={12}/> Drag to Move</span>
                    <span className="flex items-center gap-1"><RotateCw size={12}/> Hover to Rotate</span>
                    {showDesignBackground && <span className="flex items-center gap-1 text-amber-500"><Eye size={12}/> Image Overlay Active</span>}
                </div>
                <div>
                   {itemsOnCanvas.length} Items placed
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};