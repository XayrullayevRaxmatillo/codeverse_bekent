import html from './html/index';
import css from './css/index';
import javascript from './javascript/index';
import react from './react/index';

export const courses = [html, css, javascript, react];

// Kelgusi dunyolar — xaritada "tez orada" sifatida ko'rinadi
export const comingSoon = [
  { slug: 'typescript', world: 'typescript-mountains', order: 5, color: '#3178C6', icon: 'mountain', prerequisite: 'javascript', title: ["TypeScript tog'lari", 'Горы TypeScript', 'TypeScript Mountains'], description: ['Turlar bilan xavfsiz JavaScript.', 'Безопасный JavaScript с типами.', 'Safer JavaScript with types.'] },
  { slug: 'backend', world: 'backend-galaxy', order: 6, color: '#10B981', icon: 'server', prerequisite: 'javascript', title: ['Backend galaktikasi', 'Галактика Backend', 'Backend Galaxy'], description: ['Node.js, Express, ma\'lumotlar bazalari va API.', 'Node.js, Express, базы данных и API.', 'Node.js, Express, databases and APIs.'] },
  { slug: 'fullstack', world: 'fullstack-universe', order: 7, color: '#EC4899', icon: 'galaxy', prerequisite: 'react', title: ['Full Stack koinoti', 'Вселенная Full Stack', 'Full Stack Universe'], description: ['Frontend + backend: to\'liq ilovalar yaratish.', 'Frontend + backend: полноценные приложения.', 'Frontend + backend: building complete apps.'] },
];
