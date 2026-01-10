export interface DesignProfile {
  archetype: string;
  pietraRatio: number; // 0-100 (Solid/Stone)
  plumeRatio: number;  // 0-100 (Light/Feather)
  palette: string[];
  materials: string[];
  philosophy: string;
  sustainabilityScore: number; // 0-100
  lightingType: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  icon: string;
  image: string;
  galleryUrls: string[];
  focusAreas: string[];
  featured?: boolean;
}

export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  galleryUrls: string[];
  description: string;
  pietraRatio: number;
  plumeRatio: number;
  materials: string[];
  location: string;
  year: string;
}

export interface HolidayPackage {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  galleryUrls: string[];
}

export interface TimelinePhase {
  label: string;
  duration: string;
  description: string;
  detailedContent?: string;
  isSabbatical?: boolean;
}

export interface ProjectTypeTimeline {
  id: string;
  title: string;
  totalDuration: string;
  phases: TimelinePhase[];
}

export enum RoomType {
  LIVING_ROOM = "Living Room",
  BEDROOM = "Bedroom",
  KITCHEN = "Kitchen",
  DINING = "Dining",
  BALCONY = "Balcony",
  HOME_OFFICE = "Home Office"
}

export interface Option {
  id: string;
  name: string;
  value: string;
}

export interface CategoryOptions {
  label: string;
  options: Option[];
}

export interface UserSelection {
  [category: string]: string;
}

export interface Artist {
  id: string;
  name: string;
  styleDescription: string;
}

export interface GeneratedDesign {
  roomType: RoomType;
  imageUrl: string;
  palette: string;
  attributes: string;
}

export interface FurnitureItem {
  id: string;
  name: string;
  icon: string;
  width: number;
  depth: number;
  defaultColor?: string;
}

export interface PlannerItem extends FurnitureItem {
  instanceId: string;
  x: number;
  y: number;
  rotation: number;
}