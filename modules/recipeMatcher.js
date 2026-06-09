export class RecipeMatcher {
    constructor(recipes) {
        this.recipes = recipes;
    }
    
    // Главная логика: рецепт ДОЛЖЕН состоять ТОЛЬКО из выбранных продуктов
    findMatches(selectedIngredients, type, cuisine) {
        const selectedSet = new Set(selectedIngredients);
        
        return this.recipes.filter(recipe => {
            if (type && recipe.type !== type) return false;
            if (cuisine && cuisine !== 'all' && recipe.cuisine !== cuisine) return false;
            
            // КЛЮЧЕВОЕ ПРАВИЛО: все ингредиенты рецепта должны быть среди выбранных
            const allIngredientsAvailable = recipe.ingredients.every(ing => {
                // Проверяем вхождение (например, "Лук" подходит для "Лук репчатый")
                return Array.from(selectedSet).some(selected => 
                    ing.toLowerCase().includes(selected.toLowerCase()) || 
                    selected.toLowerCase().includes(ing.toLowerCase())
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
                ing.toLowerCase().includes(selected.toLowerCase()) ||
                selected.toLowerCase().includes(ing.toLowerCase())
            )
        );
    }
}
