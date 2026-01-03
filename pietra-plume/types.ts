export enum RoomType {
  LIVING_ROOM = 'Living Room',
  BEDROOM = 'Master Bedroom',
  KITCHEN = 'Modular Kitchen',
  DINING = 'Dining Area',
  BALCONY = 'Balcony',
  HOME_OFFICE = 'Home Office'
}

export interface DesignOption {
  id: string;
  name: string;
  value: string;
}

export interface CategoryOptions {
  label: string;
  options: DesignOption[];
}

export interface RoomConfiguration {
  [key: string]: CategoryOptions;
}

export interface UserSelection {
  [categoryKey: string]: string; // stores the selected value
}

export interface Artist {
  id: string;
  name: string;
  period: string;
  styleDescription: string;
}

export interface ArtCategory {
  id: string;
  label: string;
  artists: Artist[];
}

// New Types for Smart Planner
export interface FurnitureItem {
  id: string;
  name: string;
  width: number; // in feet
  depth: number; // in feet
  icon: string; // lucide icon name
  defaultColor: string;
}

export interface PlannerItem extends FurnitureItem {
  instanceId: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  rotation: number; // degrees
}

export interface LayoutSuggestion {
  items: {
    name: string;
    x: number;
    y: number;
    rotation: number;
  }[];
  reasoning: string;
}

// Shared Design Type
export interface GeneratedDesign {
  roomType: RoomType;
  imageUrl: string;
  palette: string;
  attributes: string;
}