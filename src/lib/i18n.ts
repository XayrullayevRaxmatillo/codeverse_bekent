export const LANGS = ['uz', 'ru', 'en'] as const;
export type Lang = (typeof LANGS)[number];
export const pickLang = (v: unknown): Lang => (LANGS.includes(v as Lang) ? (v as Lang) : 'uz');
/** {uz,ru,en} dan tanlangan tilni olish (yo'q bo'lsa uz → en) */
export const tx = (obj: any, lang: string = 'uz'): string => (obj && typeof obj === 'object' ? obj[lang] || obj.uz || obj.en || '' : String(obj ?? ''));
