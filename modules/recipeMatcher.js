// modules/recipeMatcher.js
import { isIngredientMatch } from '../js/matcher.js';

export class RecipeMatcher {
    constructor(recipes) {
        this.recipes = recipes;
    }
    
    // Главная логика: рецепт ДОЛЖЕН состоять ТОЛЬКО из выбранных продуктов
    findMatches(selectedIngredients, type, cuisine) {
        const selectedSet = new Set(selectedIngredients);
        
        return this.recipes.filter(recipe => {
            if (type && type !== 'all' && recipe.type !== type) return false;
            if (cuisine && cuisine !== 'all' && recipe.cuisine !== cuisine) return false;
            
            // КЛЮЧЕВОЕ ПРАВИЛО: все ингредиенты рецепта должны быть среди выбранных
            const allIngredientsAvailable = recipe.ingredients.every(ing => {
                // Используем улучшенную функцию сравнения из matcher.js
                return Array.from(selectedSet).some(selected => 
                    isIngredientMatch(selected, ing)
                );
            });
            
            return allIngredientsAvailable;
        });
    }
    
    // Рекомендации: каких продуктов не хватает для конкретного рецепта
    getMissingIngredients(recipe, selectedIngredients) {
        const selectedSet = new Set(selectedIngredients);
        return recipe.ingredients.filter(ing => 
            !Array.from(selectedSet).some(selected => 
                isIngredientMatch(selected, ing)
            )
        );
    }
    
    // Новый метод: поиск рецептов с учетом нехватки ингредиентов
    findMatchesWithMissing(selectedIngredients, type, cuisine, maxMissing = 2) {
        const results = {
            perfect: [],
            missing1: [],
            missing2: [],
            missingMore: []
        };
        
        this.recipes.forEach(recipe => {
            if (type && type !== 'all' && recipe.type !== type) return;
            if (cuisine && cuisine !== 'all' && recipe.cuisine !== cuisine) return;
            
            const missingIngredients = this.getMissingIngredients(recipe, selectedIngredients);
            const missingCount = missingIngredients.length;
            
            if (missingCount === 0) {
                results.perfect.push({ ...recipe, missingIngredients: [] });
            } else if (missingCount === 1) {
                results.missing1.push({ ...recipe, missingIngredients });
            } else if (missingCount === 2) {
                results.missing2.push({ ...recipe, missingIngredients });
            } else {
                results.missingMore.push({ ...recipe, missingIngredients });
            }
        });
        
        return results;
    }
}

export default RecipeMatcher;
