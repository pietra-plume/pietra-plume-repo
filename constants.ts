import { RoomType, RoomConfiguration, ArtCategory, FurnitureItem } from './types';

export const ROOM_CONFIGS: Record<RoomType, RoomConfiguration> = {
  [RoomType.LIVING_ROOM]: {
    wallColor: {
      label: 'Wall Color',
      options: [
        { id: 'beige', name: 'Warm Beige', value: 'warm beige' },
        { id: 'white', name: 'Arctic White', value: 'bright white' },
        { id: 'grey', name: 'Urban Grey', value: 'matte grey' },
        { id: 'teal', name: 'Deep Teal', value: 'deep teal accent wall' },
      ]
    },
    flooring: {
      label: 'Flooring',
      options: [
        { id: 'marble', name: 'Italian Marble', value: 'white italian marble' },
        { id: 'wood', name: 'Engineered Oak', value: 'light oak wooden flooring' },
        { id: 'tiles', name: 'Vitrified Tiles', value: 'high gloss cream tiles' },
      ]
    },
    sofa: {
      label: 'Sofa Design',
      options: [
        { id: 'chesterfield', name: 'Leather Chesterfield', value: 'brown leather chesterfield sofa' },
        { id: 'l-shape', name: 'Modern L-Shape', value: 'grey fabric L-shaped sectional' },
        { id: 'minimalist', name: 'Minimalist Futon', value: 'minimalist beige linen sofa' },
      ]
    },
    curtains: {
      label: 'Curtains',
      options: [
        { id: 'sheer', name: 'White Sheer', value: 'floor-to-ceiling white sheer curtains' },
        { id: 'blackout', name: 'Velvet Blackout', value: 'heavy navy blue velvet curtains' },
        { id: 'blinds', name: 'Roman Blinds', value: 'textured fabric roman blinds' },
      ]
    },
    decor: {
      label: 'Accent Decor',
      options: [
        { id: 'pot', name: 'Ceramic Flower Pot', value: 'large ceramic artisanal flower pot with monstera' },
        { id: 'lamp', name: 'Arc Floor Lamp', value: 'modern gold finish arc floor lamp' },
        { id: 'art', name: 'Abstract Canvas', value: 'large abstract canvas art on wall' },
      ]
    }
  },
  [RoomType.BEDROOM]: {
    wallColor: {
      label: 'Wall Color',
      options: [
        { id: 'lavender', name: 'Soft Lavender', value: 'soft pastel lavender' },
        { id: 'cream', name: 'Classic Cream', value: 'rich cream' },
        { id: 'charcoal', name: 'Moody Charcoal', value: 'dark charcoal' },
      ]
    },
    bed: {
      label: 'Bed Frame',
      options: [
        { id: 'poster', name: 'Four Poster', value: 'wooden four-poster bed' },
        { id: 'platform', name: 'Low Platform', value: 'japanese style low platform bed' },
        { id: 'tufted', name: 'Tufted Headboard', value: 'upholstered tufted velvet headboard' },
      ]
    },
    wardrobe: {
      label: 'Wardrobe',
      options: [
        { id: 'sliding', name: 'Glass Sliding', value: 'frosted glass sliding door wardrobe' },
        { id: 'walkin', name: 'Walk-in Style', value: 'open concept walk-in closet system' },
        { id: 'vintage', name: 'Vintage Wooden', value: 'antique finish wooden armoire' },
      ]
    },
    lighting: {
      label: 'Ambient Lighting',
      options: [
        { id: 'sconces', name: 'Wall Sconces', value: 'brass wall sconces reading lights' },
        { id: 'chandelier', name: 'Mini Chandelier', value: 'crystal mini chandelier' },
        { id: 'cove', name: 'Cove Lighting', value: 'hidden warm cove lighting in false ceiling' },
      ]
    }
  },
  [RoomType.KITCHEN]: {
    cabinet: {
      label: 'Cabinet Finish',
      options: [
        { id: 'acrylic', name: 'High Gloss Acrylic', value: 'high gloss red acrylic cabinets' },
        { id: 'matte', name: 'Matte Black', value: 'matte black handleless cabinets' },
        { id: 'wood', name: 'Natural Wood', value: 'natural walnut wood grain cabinets' },
      ]
    },
    countertop: {
      label: 'Countertop',
      options: [
        { id: 'quartz', name: 'White Quartz', value: 'sparkling white quartz countertop' },
        { id: 'granite', name: 'Jet Black Granite', value: 'jet black polished granite' },
        { id: 'butcher', name: 'Butcher Block', value: 'solid wood butcher block countertop' },
      ]
    },
    backsplash: {
      label: 'Backsplash',
      options: [
        { id: 'subway', name: 'White Subway', value: 'white subway tiles' },
        { id: 'mosaic', name: 'Glass Mosaic', value: 'blue and green glass mosaic tiles' },
        { id: 'marble', name: 'Marble Slab', value: 'full height marble slab backsplash' },
      ]
    }
  },
  [RoomType.DINING]: {
      table: {
          label: 'Dining Table',
          options: [
              { id: 'glass', name: 'Tempered Glass', value: 'rectangular tempered glass table with chrome legs'},
              { id: 'wood', name: 'Solid Teak', value: 'massive solid teak wood dining table'},
              { id: 'marble', name: 'Round Marble', value: 'round white marble top dining table'}
          ]
      },
      chairs: {
          label: 'Chairs',
          options: [
              { id: 'upholstered', name: 'Velvet Chairs', value: 'emerald green velvet dining chairs'},
              { id: 'modern', name: 'Eames Style', value: 'white modern plastic molded chairs'},
              { id: 'bench', name: 'Bench Seating', value: 'wooden bench on one side'}
          ]
      }
  },
  [RoomType.BALCONY]: {
      floor: {
          label: 'Decking',
          options: [
              { id: 'grass', name: 'Artificial Grass', value: 'artificial green grass carpet'},
              { id: 'wood', name: 'Wooden Tiles', value: 'interlocking wooden deck tiles'}
          ]
      },
      seating: {
          label: 'Seating',
          options: [
              { id: 'swing', name: 'Cane Swing', value: 'hanging cane swing chair'},
              { id: 'bistro', name: 'Bistro Set', value: 'metal bistro table and two chairs'}
          ]
      }
  },
  [RoomType.HOME_OFFICE]: {
      desk: {
          label: 'Desk',
          options: [
              { id: 'standing', name: 'Standing Desk', value: 'adjustable height electric standing desk'},
              { id: 'executive', name: 'Executive Wood', value: 'large L-shaped mahogany executive desk'}
          ]
      },
      chair: {
          label: 'Ergonomics',
          options: [
              { id: 'mesh', name: 'Mesh Chair', value: 'ergonomic black mesh high-back chair'},
              { id: 'gaming', name: 'Gaming Style', value: 'racer style gaming chair'}
          ]
      }
  }
};

export const ART_INSPIRATIONS: ArtCategory[] = [
  {
    id: 'classical',
    label: 'Classical & Renaissance',
    artists: [
      { id: 'davinci', name: 'Leonardo da Vinci', period: 'High Renaissance', styleDescription: 'harmonic proportions, sfumato lighting, sepia and earth tones, anatomical precision, inventions sketches as decor, timeless elegance' },
      { id: 'michelangelo', name: 'Michelangelo', period: 'High Renaissance', styleDescription: 'sculptural grandeur, marble textures, dramatic frescoes, muscular forms, classical columns, epic scale' },
      { id: 'rembrandt', name: 'Rembrandt', period: 'Baroque', styleDescription: 'chiaroscuro lighting, deep shadows, rich golds and browns, dramatic moody atmosphere, texture and depth' }
    ]
  },
  {
    id: 'impressionism',
    label: 'Impressionism',
    artists: [
      { id: 'vangogh', name: 'Vincent van Gogh', period: 'Post-Impressionism', styleDescription: 'expressive swirling brushstrokes, vibrant yellows and blues, rustic textures, sunflowers, emotional intensity' },
      { id: 'monet', name: 'Claude Monet', period: 'Impressionism', styleDescription: 'soft focus, water lily palettes, pastel greens and purples, dappled light, serene garden atmosphere, airy freshness' }
    ]
  },
  {
    id: 'modern',
    label: 'Modern & Abstract',
    artists: [
      { id: 'picasso', name: 'Pablo Picasso', period: 'Cubism', styleDescription: 'fragmented forms, geometric deconstruction, multiple perspectives, bold lines, abstract faces, avant-garde' },
      { id: 'mondrian', name: 'Piet Mondrian', period: 'De Stijl', styleDescription: 'strict grid composition, primary colors (red, blue, yellow), black lines, white space, extreme minimalism, graphic clarity' },
      { id: 'kandinsky', name: 'Wassily Kandinsky', period: 'Abstract', styleDescription: 'geometric floating shapes, synesthetic color combinations, musical rhythm in visual form, non-objective art' }
    ]
  },
  {
    id: 'surrealism',
    label: 'Surrealism & Pop',
    artists: [
      { id: 'dali', name: 'Salvador Dalí', period: 'Surrealism', styleDescription: 'dreamlike atmosphere, melting forms, eccentric luxury, surreal juxtapositions, desert landscapes, golden accents' },
      { id: 'warhol', name: 'Andy Warhol', period: 'Pop Art', styleDescription: 'repetition, silkscreen aesthetic, high contrast neon colors, celebrity glamour, irony, industrial commercialism' }
    ]
  },
  {
    id: 'contemporary',
    label: 'Contemporary & Architects',
    artists: [
      { id: 'zahahadid', name: 'Zaha Hadid', period: 'Neo-Futurism', styleDescription: 'fluid sweeping curves, parametric architecture, seamless materials, futuristic monochrome, dynamic flow' },
      { id: 'wright', name: 'Frank Lloyd Wright', period: 'Organic Architecture', styleDescription: 'prairie style, horizontal lines, stained glass geometric accents, harmony with nature, natural wood and stone' }
    ]
  }
];

export const FURNITURE_CATALOG: Record<RoomType, FurnitureItem[]> = {
  [RoomType.KITCHEN]: [
    { id: 'fridge', name: 'Refrigerator', width: 3, depth: 2.5, icon: 'Refrigerator', defaultColor: '#cbd5e1' },
    { id: 'stove', name: 'Cooking Range', width: 2.5, depth: 2, icon: 'Flame', defaultColor: '#1e293b' },
    { id: 'sink', name: 'Double Sink', width: 3, depth: 2, icon: 'Droplets', defaultColor: '#94a3b8' },
    { id: 'island', name: 'Kitchen Island', width: 6, depth: 3, icon: 'Layout', defaultColor: '#e2e8f0' },
    { id: 'washer', name: 'Washing Machine', width: 2, depth: 2, icon: 'Waves', defaultColor: '#f8fafc' },
    { id: 'microwave', name: 'Microwave Unit', width: 2, depth: 1.5, icon: 'Box', defaultColor: '#475569' },
  ],
  [RoomType.LIVING_ROOM]: [
    { id: 'sofa3', name: '3-Seater Sofa', width: 7, depth: 3, icon: 'Armchair', defaultColor: '#92400e' },
    { id: 'coffee', name: 'Coffee Table', width: 4, depth: 2, icon: 'Table', defaultColor: '#78350f' },
    { id: 'tv', name: 'TV Unit', width: 5, depth: 1.5, icon: 'Tv', defaultColor: '#0f172a' },
    { id: 'plant', name: 'Large Plant', width: 1.5, depth: 1.5, icon: 'Flower2', defaultColor: '#166534' },
    { id: 'rug', name: 'Area Rug', width: 8, depth: 6, icon: 'Square', defaultColor: '#f1f5f9' },
  ],
  [RoomType.BEDROOM]: [
    { id: 'king', name: 'King Bed', width: 6.5, depth: 7, icon: 'Bed', defaultColor: '#1e293b' },
    { id: 'wardrobe', name: 'Wardrobe', width: 6, depth: 2, icon: 'DoorClosed', defaultColor: '#475569' },
    { id: 'nightstand', name: 'Nightstand', width: 1.5, depth: 1.5, icon: 'Box', defaultColor: '#94a3b8' },
    { id: 'dresser', name: 'Dresser', width: 4, depth: 2, icon: 'LayoutList', defaultColor: '#64748b' },
  ],
  [RoomType.DINING]: [
    { id: 'table6', name: '6-Seater Table', width: 6, depth: 3.5, icon: 'Table', defaultColor: '#78350f' },
    { id: 'console', name: 'Console', width: 4, depth: 1.5, icon: 'RectangleHorizontal', defaultColor: '#334155' },
    { id: 'bar', name: 'Bar Unit', width: 3, depth: 1.5, icon: 'Wine', defaultColor: '#0f172a' },
  ],
  [RoomType.HOME_OFFICE]: [
    { id: 'desk', name: 'Office Desk', width: 5, depth: 2.5, icon: 'Monitor', defaultColor: '#334155' },
    { id: 'chair', name: 'Ergo Chair', width: 2.5, depth: 2.5, icon: 'Armchair', defaultColor: '#0f172a' },
    { id: 'bookshelf', name: 'Bookshelf', width: 3, depth: 1, icon: 'Library', defaultColor: '#78350f' },
  ],
  [RoomType.BALCONY]: [
    { id: 'swing', name: 'Swing', width: 4, depth: 2, icon: 'RockingChair', defaultColor: '#d97706' },
    { id: 'table2', name: 'Coffee Set', width: 2.5, depth: 2.5, icon: 'Coffee', defaultColor: '#1e293b' },
  ]
};

// REPLACE THE URL BELOW with your Google Apps Script Web App URL to enable sheet submission
export const GOOGLE_SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwTqKjTrqJheaXO_JQqkZbHm1wa8FgPjeUXbb_kG9R0CJigqNcwj9uBmqcSL8W0laLq/exec'; 
