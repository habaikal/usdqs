import { en } from './en';

export type TranslationKeys = typeof en;

export { en } from './en';
export { ko } from './ko';
export { zhHK } from './zh-HK';

export type SupportedLanguage = 'en' | 'ko' | 'zh-HK';
