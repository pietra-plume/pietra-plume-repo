import { RoomType } from './types';

// Webhook for the "Begin the Dialogue" and Consultation forms
export const GOOGLE_SHEET_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbyPNKkK1kuaWLl2OWGxggn83c0s-JVdCKaAioqVDx31xeXQAONhpy1piHMAs2Nifxx3/exec";

// Configuration for Design Studio Room Attributes
export const ROOM_CONFIGS = {
  [RoomType.LIVING_ROOM]: {
    flooring: { label: "Flooring", options: [{ id: 'f1', name: "Italian Marble", value: "Italian Marble" }, { id: 'f2', name: "Engineered Oak", value: "Engineered Oak" }, { id: 'f3', name: "Polished Concrete", value: "Polished Concrete" }] },
    lighting: { label: "Lighting", options: [{ id: 'l1', name: "Warm Cove", value: "Warm Cove" }, { id: 'l2', name: "Statement Chandelier", value: "Statement Chandelier" }, { id: 'l3', name: "Track Systems", value: "Track Systems" }] },
    walls: { label: "Wall Finish", options: [{ id: 'w1', name: "Venetian Plaster", value: "Venetian Plaster" }, { id: 'w2', name: "Silk Wallpaper", value: "Silk Wallpaper" }, { id: 'w3', name: "Limewash", value: "Limewash" }] }
  },
  [RoomType.BEDROOM]: {
    flooring: { label: "Flooring", options: [{ id: 'f1', name: "Plush Wool Carpet", value: "Plush Wool Carpet" }, { id: 'f2', name: "Herringbone Wood", value: "Herringbone Wood" }] },
    lighting: { label: "Lighting", options: [{ id: 'l1', name: "Soft Ambient", value: "Soft Ambient" }, { id: 'l2', name: "Reading Spots", value: "Reading Spots" }] },
    walls: { label: "Wall Finish", options: [{ id: 'w1', name: "Fabric Paneling", value: "Fabric Paneling" }, { id: 'w2', name: "Matte Paint", value: "Matte Paint" }] }
  },
  [RoomType.KITCHEN]: {
    flooring: { label: "Flooring", options: [{ id: 'f1', name: "Large Format Tile", value: "Large Format Tile" }, { id: 'f2', name: "Stone", value: "Stone" }] },
    lighting: { label: "Lighting", options: [{ id: 'l1', name: "Under Cabinet", value: "Under Cabinet" }, { id: 'l2', name: "Pendants", value: "Pendants" }] },
    walls: { label: "Backsplash", options: [{ id: 'w1', name: "Quartz Slab", value: "Quartz Slab" }, { id: 'w2', name: "Mosaic Tile", value: "Mosaic Tile" }] }
  },
  [RoomType.DINING]: {
    flooring: { label: "Flooring", options: [{ id: 'f1', name: "Wood Inlay", value: "Wood Inlay" }, { id: 'f2', name: "Marble", value: "Marble" }] },
    lighting: { label: "Lighting", options: [{ id: 'l1', name: "Crystal Chandelier", value: "Crystal Chandelier" }, { id: 'l2', name: "Linear Pendant", value: "Linear Pendant" }] },
    walls: { label: "Wall Finish", options: [{ id: 'w1', name: "Mirrored", value: "Mirrored" }, { id: 'w2', name: "Textured Paper", value: "Textured Paper" }] }
  },
  [RoomType.BALCONY]: {
    flooring: { label: "Flooring", options: [{ id: 'f1', name: "Decking", value: "Decking" }, { id: 'f2', name: "Outdoor Tile", value: "Outdoor Tile" }] },
    lighting: { label: "Lighting", options: [{ id: 'l1', name: "Fairy Lights", value: "Fairy Lights" }, { id: 'l2', name: "Wall Scones", value: "Wall Scones" }] },
    walls: { label: "Railing", options: [{ id: 'w1', name: "Glass", value: "Glass" }, { id: 'w2', name: "Metal", value: "Metal" }] }
  },
  [RoomType.HOME_OFFICE]: {
    flooring: { label: "Flooring", options: [{ id: 'f1', name: "Wood", value: "Wood" }, { id: 'f2', name: "Carpet Tile", value: "Carpet Tile" }] },
    lighting: { label: "Lighting", options: [{ id: 'l1', name: "Task Lighting", value: "Task Lighting" }, { id: 'l2', name: "Bright Overhead", value: "Bright Overhead" }] },
    walls: { label: "Wall Finish", options: [{ id: 'w1', name: "Sound Proofing", value: "Sound Proofing" }, { id: 'w2', name: "Bookshelves", value: "Bookshelves" }] }
  }
};

// Artist Inspirations
export const ART_INSPIRATIONS = [
  { 
    id: 'minimalism', 
    label: 'Minimalism', 
    artists: [
      { id: 'a1', name: 'Tadao Ando', styleDescription: 'Concrete, light, and silence' },
      { id: 'a2', name: 'John Pawson', styleDescription: 'Radical simplicity and spatial clarity' }
    ] 
  },
  { 
    id: 'organic', 
    label: 'Organic Modern', 
    artists: [
      { id: 'a3', name: 'Zaha Hadid', styleDescription: 'Fluid curves and futuristic forms' },
      { id: 'a4', name: 'Frank Lloyd Wright', styleDescription: 'Harmony with nature and geometric patterns' }
    ] 
  },
  { 
    id: 'industrial', 
    label: 'Industrial Luxe', 
    artists: [
      { id: 'a5', name: 'Tom Dixon', styleDescription: 'Metallics, raw materials, and British eccentricity' }
    ] 
  }
];

// Furniture Catalog for Smart Planner
export const FURNITURE_CATALOG = {
  [RoomType.LIVING_ROOM]: [
    { id: 'sofa', name: 'L-Shape Sofa', icon: 'Armchair', width: 8, depth: 3, defaultColor: '#e7e5e4' },
    { id: 'coffee-table', name: 'Coffee Table', icon: 'Coffee', width: 4, depth: 2.5, defaultColor: '#a8a29e' },
    { id: 'tv-unit', name: 'TV Unit', icon: 'Tv', width: 6, depth: 1.5, defaultColor: '#57534e' },
    { id: 'armchair', name: 'Accent Chair', icon: 'Armchair', width: 3, depth: 3, defaultColor: '#d6d3d1' },
    { id: 'rug', name: 'Area Rug', icon: 'Square', width: 8, depth: 6, defaultColor: '#f5f5f4' },
    { id: 'plant', name: 'Potted Plant', icon: 'Flower2', width: 2, depth: 2, defaultColor: '#84cc16' }
  ],
  [RoomType.BEDROOM]: [
    { id: 'bed-king', name: 'King Bed', icon: 'Bed', width: 6.5, depth: 7, defaultColor: '#e7e5e4' },
    { id: 'wardrobe', name: 'Wardrobe', icon: 'DoorClosed', width: 8, depth: 2, defaultColor: '#78716c' },
    { id: 'nightstand', name: 'Nightstand', icon: 'Box', width: 2, depth: 1.5, defaultColor: '#a8a29e' },
    { id: 'dresser', name: 'Dresser', icon: 'LayoutList', width: 5, depth: 2, defaultColor: '#a8a29e' }
  ],
  [RoomType.KITCHEN]: [
    { id: 'island', name: 'Kitchen Island', icon: 'Table', width: 6, depth: 3, defaultColor: '#d6d3d1' },
    { id: 'fridge', name: 'Refrigerator', icon: 'Refrigerator', width: 3, depth: 2.5, defaultColor: '#94a3b8' },
    { id: 'stove', name: 'Cooking Range', icon: 'Flame', width: 2.5, depth: 2.5, defaultColor: '#1c1917' },
    { id: 'sink', name: 'Double Sink', icon: 'Droplets', width: 3, depth: 2, defaultColor: '#cbd5e1' }
  ],
  [RoomType.DINING]: [
    { id: 'dining-table', name: '8-Seater Table', icon: 'Table', width: 8, depth: 3.5, defaultColor: '#b45309' },
    { id: 'chair', name: 'Dining Chair', icon: 'Armchair', width: 1.5, depth: 1.5, defaultColor: '#e7e5e4' },
    { id: 'bar', name: 'Bar Unit', icon: 'Wine', width: 4, depth: 1.5, defaultColor: '#78716c' }
  ],
  [RoomType.BALCONY]: [
    { id: 'swing', name: 'Swing Chair', icon: 'RockingChair', width: 3, depth: 3, defaultColor: '#d6d3d1' },
    { id: 'bistro', name: 'Bistro Table', icon: 'Coffee', width: 2.5, depth: 2.5, defaultColor: '#78716c' },
    { id: 'planter-long', name: 'Long Planter', icon: 'Flower2', width: 6, depth: 1, defaultColor: '#65a30d' }
  ],
  [RoomType.HOME_OFFICE]: [
    { id: 'desk', name: 'Executive Desk', icon: 'RectangleHorizontal', width: 6, depth: 3, defaultColor: '#78350f' },
    { id: 'office-chair', name: 'Ergo Chair', icon: 'Armchair', width: 2.5, depth: 2.5, defaultColor: '#1c1917' },
    { id: 'bookshelf', name: 'Bookshelf', icon: 'Library', width: 4, depth: 1.5, defaultColor: '#78716c' },
    { id: 'monitor', name: 'Monitor Setup', icon: 'Monitor', width: 3, depth: 1, defaultColor: '#000000' }
  ]
};