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