// modules/recipes/index.js
import { salads } from './salads.js';
// import { snacks } from './snacks.js';
// import { soups } from './soups.js';
// import { mainCourses } from './mainCourses.js';
// import { desserts } from './desserts.js';
// import { sauces } from './sauces.js';

// Объединяем все рецепты в один массив
export const allRecipes = [
    ...salads,
    // ...snacks,
    // ...soups,
    // ...mainCourses,
    // ...desserts,
    // ...sauces
];

// Экспортируем отдельно по категориям
export const recipesByType = {
    salad: salads,
    // snack: snacks,
    // soup: soups,
    // main: mainCourses,
    // dessert: desserts,
    // sauce: sauces
};

export default allRecipes;
