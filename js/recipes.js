// js/recipes.js
import { salads } from '../modules/recipes/salads.js';
import { snacks } from '../modules/recipes/snacks.js';
import { soups } from '../modules/recipes/soups.js';

// Объединяем все рецепты
export const allRecipes = [
    ...salads,
    ...snacks,
    ...soups
];

console.log(`📚 Загружено рецептов: ${allRecipes.length}`);
console.log(`📋 Из них: салатов - ${salads.length}, закусок - ${snacks.length}, супов - ${soups.length}`);
