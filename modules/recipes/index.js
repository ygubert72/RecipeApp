// modules/recipes/index.js
import { salads } from './salads.js';
import { snacks } from './snacks.js';
import { soups } from './soups.js';
import { mainCourses } from './mainCourses.js';

// Объединяем все рецепты в один массив (теперь 200 рецептов!)
export const allRecipes = [
    ...salads,    // 50 салатов (id: 101-150)
    ...snacks,    // 50 закусок (id: 201-250)
    ...soups,     // 50 супов (id: 301-350)
    ...mainCourses // 50 вторых блюд (id: 401-450)
];

// Экспортируем отдельно по категориям
export const recipesByType = {
    salad: salads,
    snack: snacks,
    soup: soups,
    main: mainCourses
};

export default allRecipes;
