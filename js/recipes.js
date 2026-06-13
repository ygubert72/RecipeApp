// js/recipes.js
import { salads } from '../modules/recipes/salads.js';
import { snacks } from '../modules/recipes/snacks.js';
import { soups } from '../modules/recipes/soups.js';
import { mainCourses } from '../modules/recipes/mainCourses.js';

// Объединяем все рецепты
export const allRecipes = [
    ...salads,      // 50 салатов (id: 101-150)
    ...snacks,      // 50 закусок (id: 201-250)
    ...soups,       // 50 супов (id: 301-350)
    ...mainCourses  // 50 вторых блюд (id: 401-450)
];

console.log(`📚 Загружено рецептов: ${allRecipes.length}`);
console.log(`📋 Из них:`);
console.log(`   🥗 Салатов: ${salads.length}`);
console.log(`   🍢 Закусок: ${snacks.length}`);
console.log(`   🍲 Супов: ${soups.length}`);
console.log(`   🍽️ Вторых блюд: ${mainCourses.length}`);
console.log(`   ✅ Всего: ${salads.length + snacks.length + soups.length + mainCourses.length}`);
