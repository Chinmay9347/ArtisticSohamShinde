export interface ArtistInfo {
  name: string;
  title: string;
  location: string;
  description: string[];
  signature: string;
}

export interface WhyChooseItem {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface WebsiteDeveloper {
  title: string;
  developer: string;
  description: string[];
  github: string;
  linkedin: string;
  instagram: string;
  whatsapp: string;
}

export interface BehindPortrait {
  title: string;
  description: string;
  image: string;
}