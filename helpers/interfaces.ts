export interface Head {
  title: string;
  text: string;
  button: string;
}

export interface ExperienceProject {
  image: string;
  link: string;
}

export interface Job {
  title: string;
  date: string;
  texture: string;
  responsibilities: string;
  projects: ExperienceProject[];
}

export interface Experience {
  title: string;
  job: Job[];
}

export interface Slide {
  text: string;
  highlighted?: boolean;
}

export interface Requisites {
  type: string;
  link: string;
}

export interface Details {
  texture: string;
  requisites: Requisites[];
}

export interface Project {
  preview?: string;
  repo?: string;
  image: string;
  gif: string;
  isLive: boolean;
  isHovered?: boolean;
  scrollTrigger?: ScrollTrigger;
}

export interface Projects {
  title: string;
  project: Project[];
}

export interface Service {
  title: string;
  subtitle?: string;
  text: string;
  texture: string;
}

export interface Services {
  title: string;
  service: Service[];
}

export interface Technologies {
  title: string;
  technology: string[];
}

export interface ErrorPage {
  title: string;
  button: string;
}
