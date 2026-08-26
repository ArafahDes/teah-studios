export const IMAGES = {
  'f-bone': '/images/f-bone.webp',
  'f-wine': '/images/f-wine.webp',
  'f-black': '/images/f-black.webp',
  'f-cognac': '/images/f-cognac.webp',
  hero: '/images/hero.webp',
  'p2-cognac': '/images/p2-cognac.webp',
  'p2-bone': '/images/p2-bone.webp',
  'p4-wine': '/images/p4-wine.webp',
  'p4-black': '/images/p4-black.webp',
  'p4-bone': '/images/p4-bone.webp',
  'p5-wine': '/images/p5-wine.webp',
  offer: '/images/offer.webp',
  'p5-cognac': '/images/p5-cognac.webp',
  'p5-black': '/images/p5-black.webp',
  'p5-bone': '/images/p5-bone.webp',
  'p2-wine': '/images/p2-wine.webp',
  'p2-black': '/images/p2-black.webp',
  'p4-cognac': '/images/p4-cognac.webp',
  tsuno: '/images/tsuno.webp',
};

export function img(key) {
  return IMAGES[key] || '';
}
