export interface ProjectMedia {
  type: 'image' | 'video';
  url: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  video?: string;
  year: string;
  description: string;
  gallery?: ProjectMedia[]; // Changed to support both images and videos
  tags?: string[];
}

export interface Award {
  year: string;
  title: string;
  organization: string;
  result: string;
  video?: string;      // Added for exhibition display
  description?: string; // Added for exhibition display
}

export interface PlaygroundItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  caption?: string; // Optional caption
}

export interface DesignItem {
  id: string;
  title: string;
  category: string; // 예: 'Poster', 'Album Cover', 'Brand Identity', 'Typography'
  image: string;
  year: string;
  description?: string;
  tools?: string[]; // 예: ['Photoshop', 'Illustrator', 'Figma']
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum NavigationItem {
  WORK = 'Work',
  ABOUT = 'About',
  CONTACT = 'Contact'
}