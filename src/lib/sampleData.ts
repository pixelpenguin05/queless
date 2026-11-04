import { MenuItem } from './types';

// Initial menu items starts completely empty - to be filled by canteen owners
export const INITIAL_MENU_ITEMS: MenuItem[] = [];

export const CATEGORIES = [
  { id: 'all', label: 'All Items', icon: '🍽️' },
  { id: 'meals', label: 'Thali & Meals', icon: '🍛' },
  { id: 'combos', label: 'Student Combos', icon: '⚡' },
  { id: 'snacks', label: 'Snacks & Bites', icon: '🥪' },
  { id: 'south-indian', label: 'South Indian', icon: '🥞' },
  { id: 'chinese', label: 'Chinese & Momos', icon: '🥟' },
  { id: 'beverages', label: 'Chai & Shakes', icon: '🥤' },
  { id: 'bakery', label: 'Desserts', icon: '🍰' },
];
