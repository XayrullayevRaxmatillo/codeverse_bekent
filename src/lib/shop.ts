// Do'kon buyumlari: avatarlar, mavzular (accent rang), profil ramkalari
const T = (uz: string, ru: string, en: string) => ({ uz, ru, en });

export type ShopItem = { key: string; type: 'avatar' | 'theme' | 'frame'; value: string; price: number; minLevel: number; name: { uz: string; ru: string; en: string } };

export const SHOP_ITEMS: readonly ShopItem[] = Object.freeze([
  { key: 'avatar-rocket', type: 'avatar', value: '🚀', price: 0, minLevel: 1, name: T('Raketa', 'Ракета', 'Rocket') },
  { key: 'avatar-cat', type: 'avatar', value: '🐱', price: 40, minLevel: 1, name: T('Mushuk', 'Кот', 'Cat') },
  { key: 'avatar-robot', type: 'avatar', value: '🤖', price: 60, minLevel: 1, name: T('Robot', 'Робот', 'Robot') },
  { key: 'avatar-fox', type: 'avatar', value: '🦊', price: 80, minLevel: 2, name: T('Tulki', 'Лиса', 'Fox') },
  { key: 'avatar-ninja', type: 'avatar', value: '🥷', price: 120, minLevel: 3, name: T('Ninja', 'Ниндзя', 'Ninja') },
  { key: 'avatar-wizard', type: 'avatar', value: '🧙', price: 150, minLevel: 4, name: T('Sehrgar', 'Волшебник', 'Wizard') },
  { key: 'avatar-astronaut', type: 'avatar', value: '🧑‍🚀', price: 200, minLevel: 5, name: T('Kosmonavt', 'Космонавт', 'Astronaut') },
  { key: 'avatar-dragon', type: 'avatar', value: '🐉', price: 400, minLevel: 7, name: T('Ajdaho', 'Дракон', 'Dragon') },
  { key: 'theme-default', type: 'theme', value: '#7C5CFC', price: 0, minLevel: 1, name: T('Kosmik binafsha', 'Космический фиолетовый', 'Cosmic violet') },
  { key: 'theme-ocean', type: 'theme', value: '#0EA5E9', price: 60, minLevel: 1, name: T('Okean', 'Океан', 'Ocean') },
  { key: 'theme-forest', type: 'theme', value: '#22C55E', price: 60, minLevel: 2, name: T('O\'rmon', 'Лес', 'Forest') },
  { key: 'theme-sunset', type: 'theme', value: '#F97316', price: 90, minLevel: 3, name: T('Shafaq', 'Закат', 'Sunset') },
  { key: 'theme-rose', type: 'theme', value: '#EC4899', price: 90, minLevel: 3, name: T('Atirgul', 'Роза', 'Rose') },
  { key: 'theme-gold', type: 'theme', value: '#EAB308', price: 250, minLevel: 6, name: T('Oltin', 'Золото', 'Gold') },
  { key: 'frame-none', type: 'frame', value: 'none', price: 0, minLevel: 1, name: T('Ramkasiz', 'Без рамки', 'No frame') },
  { key: 'frame-neon', type: 'frame', value: 'neon', price: 100, minLevel: 2, name: T('Neon', 'Неон', 'Neon') },
  { key: 'frame-fire', type: 'frame', value: 'fire', price: 150, minLevel: 4, name: T('Olov', 'Огонь', 'Fire') },
  { key: 'frame-ice', type: 'frame', value: 'ice', price: 150, minLevel: 4, name: T('Muz', 'Лёд', 'Ice') },
  { key: 'frame-gold', type: 'frame', value: 'gold', price: 300, minLevel: 6, name: T('Oltin', 'Золото', 'Gold') },
  { key: 'frame-legend', type: 'frame', value: 'legend', price: 600, minLevel: 9, name: T('Afsona', 'Легенда', 'Legend') },
]);

export const shopItem = (key: string): ShopItem | null => SHOP_ITEMS.find((i) => i.key === key) ?? null;
