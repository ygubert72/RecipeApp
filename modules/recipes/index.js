// modules/recipes/index.js
import { salads } from './salads.js';
import { snacks } from './snacks.js';

// Объединяем все рецепты в один массив
export const allRecipes = [
    ...salads,    // 50 салатов (id: 101-150)
    ...snacks     // 50 закусок (id: 201-250)
];

// Экспортируем отдельно по категориям
export const recipesByType = {
    salad: salads,
    snack: snacks
};

export default allRecipes;
