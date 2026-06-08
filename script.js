// Ждём загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    // ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
    let selectedIngredients = new Set();
    let selectedType = null;
    let allRecipes = typeof recipes !== 'undefined' ? recipes : [];
    let currentCategory = 'all';

    // ========== DOM ЭЛЕМЕНТЫ ==========
    const ingredientsGrid = document.getElementById('ingredientsGrid');
    const typeBtns = document.querySelectorAll('.type-buttons button');
    const findBtn = document.getElementById('findRecipesBtn');
    const recipesListDiv = document.getElementById('recipesList');
    const modal = document.getElementById('recipeModal');
    const modalBody = document.getElementById('modalRecipeBody');
    const closeModal = document.querySelector('.close');
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const themeBtns = document.querySelectorAll('.theme-btn');
    const openAiBtn = document.getElementById('openAiAssistantBtn');
    const aiModal = document.getElementById('aiModal');
    const closeAi = document.querySelector('.close-ai');
    const askAiBtn = document.getElementById('askAiBtn');
    const aiQuestion = document.getElementById('aiQuestion');
    const aiAnswer = document.getElementById('aiAnswer');

    // ========== ИНИЦИАЛИЗАЦИЯ ПРОДУКТОВ ==========
    const ingredientsList = [
        '🍅 Помидоры', '🥒 Огурцы', '🥔 Картофель', '🧅 Лук', '🥕 Морковь',
        '🍗 Курица', '🥩 Говядина', '🐟 Рыба', '🥚 Яйца', '🧀 Сыр',
        '🍚 Рис', '🍝 Макароны', '🥛 Сметана', '🧄 Чеснок', '🌿 Зелень',
        '🍎 Яблоки', '🍌 Бананы', '🍫 Шоколад', '🥛 Молоко', '🍯 Мед'
    ];

    function renderIngredients() {
        ingredientsGrid.innerHTML = '';
        ingredientsList.forEach(ing => {
            const btn = document.createElement('button');
            btn.textContent = ing;
            btn.classList.add('ingredient-btn');
            if (selectedIngredients.has(ing)) btn.classList.add('selected');
            btn.addEventListener('click', () => {
                if (selectedIngredients.has(ing)) {
                    selectedIngredients.delete(ing);
                } else {
                    selectedIngredients.add(ing);
                }
                renderIngredients();
            });
            ingredientsGrid.appendChild(btn);
        });
    }

    // Тип блюда
    typeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            typeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedType = btn.getAttribute('data-type');
        });
    });

    // Поиск рецептов
    function findRecipes() {
        if (selectedIngredients.size === 0) {
            recipesListDiv.innerHTML = '<div class="placeholder">⚠️ Выбери хотя бы один продукт!</div>';
            return;
        }
        
        let filtered = allRecipes.filter(recipe => {
            // фильтр по типу
            if (selectedType && recipe.type !== selectedType) return false;
            // фильтр по категории (кухня)
            if (currentCategory !== 'all' && recipe.cuisine !== currentCategory) return false;
            // проверка ингредиентов (хотя бы 1 совпал)
            const hasIngredient = recipe.ingredients.some(ing => 
                Array.from(selectedIngredients).some(selected => selected.includes(ing) || ing.includes(selected))
            );
            return hasIngredient;
        });
        
        if (filtered.length === 0) {
            recipesListDiv.innerHTML = '<div class="placeholder">😕 Нет рецептов с такими продуктами. Попробуй добавить ещё ингредиенты.</div>';
            return;
        }
        
        renderRecipeCards(filtered);
    }
    
    function renderRecipeCards(recipesArray) {
        recipesListDiv.innerHTML = '';
        recipesArray.forEach(recipe => {
            const card = document.createElement('div');
            card.classList.add('recipe-card');
            card.innerHTML = `
                <h4>${recipe.name}</h4>
                <p>🍽️ ${getCuisineEmoji(recipe.cuisine)} ${recipe.cuisine} • ${getTypeEmoji(recipe.type)} ${recipe.type}</p>
                <small>✨ Нужно: ${recipe.ingredients.slice(0, 3).join(', ')}${recipe.ingredients.length > 3 ? '...' : ''}</small>
            `;
            card.addEventListener('click', () => showRecipeModal(recipe));
            recipesListDiv.appendChild(card);
        });
    }
    
    function getCuisineEmoji(cuisine) {
        if (cuisine === 'Русская') return '🍞';
        if (cuisine === 'Восточная') return '🥘';
        return '🍷';
    }
    
    function getTypeEmoji(type) {
        const map = { salad: '🥗', snack: '🍢', soup: '🥣', main: '🍛', dessert: '🍰' };
        return map[type] || '🍽️';
    }
    
    function showRecipeModal(recipe) {
        modalBody.innerHTML = `
            <h2>${recipe.name}</h2>
            <p><strong>🍴 Кухня:</strong> ${recipe.cuisine} | <strong>Тип:</strong> ${recipe.type}</p>
            <h3>📋 Ингредиенты:</h3>
            <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
            <h3>👨‍🍳 Пошаговый рецепт:</h3>
            <ol>${recipe.steps.map(s => `<li>${s}</li>`).join('')}</ol>
            <p><strong>💡 Совет:</strong> ${recipe.tip || 'Подавай с любовью!'}</p>
        `;
        modal.style.display = 'flex';
    }
    
    // Мобильное меню
    menuToggle.addEventListener('click', () => {
        mobileNav.classList.toggle('open');
    });
    
    // Навигация по кухням
    document.querySelectorAll('.nav-category').forEach(btn => {
        btn.addEventListener('click', () => {
            currentCategory = btn.getAttribute('data-category');
            mobileNav.classList.remove('open');
            if (selectedIngredients.size > 0) findRecipes();
            else recipesListDiv.innerHTML = '<div class="placeholder">Выбери ингредиенты и нажми "Найти"</div>';
        });
    });
    
    // Тема оформления
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-theme');
            document.body.classList.remove('theme-green', 'theme-orange');
            document.body.classList.add(`theme-${theme}`);
            themeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // ИИ-ассистент (имитация)
    openAiBtn.addEventListener('click', () => {
        aiModal.style.display = 'flex';
    });
    
    closeAi.addEventListener('click', () => {
        aiModal.style.display = 'none';
    });
    
    askAiBtn.addEventListener('click', () => {
        const question = aiQuestion.value.trim();
        if (!question) {
            aiAnswer.innerHTML = '❓ Напиши свой вопрос о готовке!';
            return;
        }
        aiAnswer.innerHTML = '🤔 Думаю...';
        setTimeout(() => {
            const answers = {
                'сок': 'Чтобы мясо было сочным, не пережаривай, замаринуй в луке/кефире за час.',
                'хруст': 'Для хрустящей корочки обсуши продукты перед жаркой и используй панировку.',
                'суп': 'Кидай овощи в кипящий бульон, а соль в конце варки.',
                'default': `Отличный вопрос! Совет: всегда пробуй блюдо в процессе готовки. Для "${question}" рекомендую поискать видео с конкретным рецептом.`
            };
            let answer = answers.default;
            for (let key in answers) {
                if (question.toLowerCase().includes(key)) answer = answers[key];
            }
            aiAnswer.innerHTML = `🧑‍🍳 ${answer}`;
        }, 500);
    });
    
    // Закрытие модалок
    closeModal.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => {
        if (e.target === modal) modal.style.display = 'none';
        if (e.target === aiModal) aiModal.style.display = 'none';
    };
    
    findBtn.addEventListener('click', findRecipes);
    renderIngredients();
    
    // Установим тему зеленую по умолчанию
    document.body.classList.add('theme-green');
});
