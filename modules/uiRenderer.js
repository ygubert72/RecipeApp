export class UIRenderer {
    constructor(ingredientsDB, matcher) {
        this.ingredientsDB = ingredientsDB;
        this.matcher = matcher;
        this.selectedIngredients = new Set();
        this.selectedType = null;
        this.currentCuisine = 'all';
    }
    
    init() {
        this.renderIngredientsGroups();
        this.bindEvents();
    }
    
    renderIngredientsGroups() {
        const container = document.getElementById('ingredientsGroupsContainer');
        container.innerHTML = '';
        
        this.ingredientsDB.groups.forEach(group => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'ingredient-group';
            
            const header = document.createElement('div');
            header.className = 'group-header';
            header.innerHTML = `<span class="group-title">${group.name}</span><span class="group-toggle">▶</span>`;
            
            const itemsDiv = document.createElement('div');
            itemsDiv.className = 'group-items';
            
            group.items.forEach(item => {
                const btn = document.createElement('button');
                btn.textContent = item;
                btn.className = 'ingredient-btn';
                btn.addEventListener('click', () => {
                    btn.classList.toggle('selected');
                    if (btn.classList.contains('selected')) {
                        this.selectedIngredients.add(item);
                    } else {
                        this.selectedIngredients.delete(item);
                    }
                });
                itemsDiv.appendChild(btn);
            });
            
            let collapsed = false;
            header.addEventListener('click', () => {
                collapsed = !collapsed;
                itemsDiv.style.display = collapsed ? 'none' : 'flex';
                header.querySelector('.group-toggle').textContent = collapsed ? '▶' : '▼';
            });
            
            groupDiv.appendChild(header);
            groupDiv.appendChild(itemsDiv);
            container.appendChild(groupDiv);
        });
    }
    
    bindEvents() {
        document.getElementById('findRecipesBtn').addEventListener('click', () => {
            this.searchRecipes();
        });
        
        document.querySelectorAll('.type-buttons button').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.type-buttons button').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedType = btn.getAttribute('data-type');
            });
        });
        
        document.querySelectorAll('.nav-category').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentCuisine = btn.getAttribute('data-category');
                document.getElementById('mobileNav').classList.remove('open');
                if (this.selectedIngredients.size > 0) this.searchRecipes();
            });
        });
        
        // Гамбургер-меню
        document.getElementById('menuToggle').addEventListener('click', () => {
            document.getElementById('mobileNav').classList.toggle('open');
        });
        
        // Смена темы
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.getAttribute('data-theme');
                document.body.classList.remove('theme-green', 'theme-orange');
                document.body.classList.add(`theme-${theme}`);
                document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // Модалка рецепта
        const modal = document.getElementById('recipeModal');
        const close = document.querySelector('.close');
        close.onclick = () => modal.style.display = 'none';
        window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
    }
    
    searchRecipes() {
        if (this.selectedIngredients.size === 0) {
            document.getElementById('recipesList').innerHTML = '<div class="placeholder">⚠️ Выбери продукты, которые есть дома</div>';
            return;
        }
        
        const results = this.matcher.findMatches(
            Array.from(this.selectedIngredients),
            this.selectedType,
            this.currentCuisine
        );
        
        this.renderResults(results);
    }
    
    renderResults(recipes) {
        const container = document.getElementById('recipesList');
        
        if (recipes.length === 0) {
            container.innerHTML = '<div class="placeholder">😕 Нет рецептов, которые можно приготовить только из твоих продуктов. Попробуй добавить ещё ингредиенты.</div>';
            return;
        }
        
        container.innerHTML = recipes.map(recipe => `
            <div class="recipe-card" data-id="${recipe.id}">
                ${recipe.image ? `<img src="${recipe.image}" class="recipe-img" alt="${recipe.name}">` : '<div class="recipe-img-placeholder">🍽️</div>'}
                <h4>${recipe.name}</h4>
                <p>${this.getCuisineEmoji(recipe.cuisine)} ${this.getCuisineName(recipe.cuisine)} • ${recipe.type}</p>
                <p class="recipe-meta">⏱️ ${recipe.cookingTime || 30} мин • 🔥 ${recipe.calories || '?'} ккал</p>
                <small>📋 Нужно: ${recipe.ingredients.slice(0, 4).join(', ')}${recipe.ingredients.length > 4 ? '...' : ''}</small>
            </div>
        `).join('');
        
        document.querySelectorAll('.recipe-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = parseInt(card.getAttribute('data-id'));
                const recipe = recipes.find(r => r.id === id);
                this.showRecipeModal(recipe);
            });
        });
    }
    
    showRecipeModal(recipe) {
        const modalBody = document.getElementById('modalRecipeBody');
        modalBody.innerHTML = `
            <h2>${recipe.name}</h2>
            ${recipe.image ? `<img src="${recipe.image}" style="width:100%; border-radius:20px; margin:12px 0;">` : ''}
            <p>⏱️ Время: ${recipe.cookingTime || 30} мин | 🔥 ${recipe.calories || '?'} ккал</p>
            <h3>📋 Ингредиенты:</h3>
            <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
            <h3>👨‍🍳 Пошаговый рецепт:</h3>
            <div class="steps-list">${recipe.steps.map(s => `<p>${s}</p>`).join('')}</div>
            <h3>💡 Совет шефа:</h3>
            <p class="chef-tip">${recipe.tip || 'Подавай с любовью и свежей зеленью!'}</p>
        `;
        document.getElementById('recipeModal').style.display = 'flex';
    }
    
    getCuisineEmoji(cuisine) {
        const map = { russian: '🍞', eastern: '🥘', european: '🍷' };
        return map[cuisine] || '🍽️';
    }
    
    getCuisineName(cuisine) {
        const map = { russian: 'Русская', eastern: 'Восточная', european: 'Европейская' };
        return map[cuisine] || cuisine;
    }
}
