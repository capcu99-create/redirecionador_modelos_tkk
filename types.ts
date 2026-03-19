export type LangCode = 'pt' | 'es' | 'en';

export interface Translation {
  title: string;
  footer: string;
  btn: string;
  steps: string[];
}

export type Translations = Record<LangCode, Translation>;

export interface ModelConfig {
  name: string;
  url: string;
}

export interface ModelLinks {
  pt: string;
  default: string;
}

// Dictionary of available models
export type ModelMap = Record<string, ModelLinks>;

export interface StatData {
  views: number;
  clicks: number;
}

export type StatsMap = Record<string, StatData>;
