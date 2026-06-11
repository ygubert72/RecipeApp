// js/recipes.js
import { allRecipes as salads } from '../modules/recipes/salads.js';
import { allRecipes as snacks } from '../modules/recipes/snacks.js';
import { allRecipes as soups } from '../modules/recipes/soups.js';

// Объединяем все рецепты
export const allRecipes = [
    ...salads,
    ...snacks,
    ...soups
];

console.log(`📚 Загружено рецептов: ${allRecipes.length}`);
