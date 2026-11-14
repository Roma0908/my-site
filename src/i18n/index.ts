import { Lang } from '../types';
import { kk } from './kk';
import { ru } from './ru';
import { en } from './en';

export const translations = { kk, ru, en };
export type Dictionary = typeof en;

export function getDict(lang: Lang): Dictionary {
  return translations[lang] || kk;
}
