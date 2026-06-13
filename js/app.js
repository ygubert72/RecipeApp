// js/app.js
import { ingredientsGroups } from './ingredients.js';
import { isIngredientMatch } from './matcher.js';
import { getAIAnswer } from './aiHelper.js';
import { allRecipes } from './recipes.js';

let selectedIngredients = new Set();
let selectedType = "all";
let currentCuisine = "all";
let allButtonsList = [];
let groupData = new Map();

// ========== ФУНКЦИИ ОБНОВЛЕНИЯ СОСТОЯНИЯ КНОПОК ==========

// Обновляет кнопку "Выбрать всё" для группы
function updateGroupSelectAllButton(groupName) {
    const data = groupData.get(groupName);
    if (!data) return;
    
    const { buttons, selectAllBtn } = data;
    const selectedInGroup = buttons.filter(btn => btn.classList.contains('selected')).length;
    
    if (selectedInGroup > 0 && selectedInGroup === buttons.length) {
        selectAllBtn.innerHTML = '✅ Выбрано всё';
    } else if (selectedInGroup > 0) {
        selectAllBtn.innerHTML = '✅ Выбрать всё';
    } else {
        selectAllBtn.innerHTML = 'Выбрать всё';
    }
}

// Обновляет кнопку "Убрать всё" для группы
function updateGroupDeselectAllButton(groupName) {
    const data = groupData.get(groupName);
    if (!data) return;
    
    const { buttons, deselectAllBtn } = data;
    const selectedInGroup = buttons.filter(btn => btn.classList.contains('selected')).length;
    
    if (selectedInGroup === 0) {
        deselectAllBtn.innerHTML = '❌ Убрано всё';
    } else {
        deselectAllBtn.innerHTML = 'Убрать всё';
    }
}

// Обновляет глобальные кнопки
function updateGlobalButtons() {
    const selectAllGlobal = document.getElementById('selectAllIngredientsBtn');
    const deselectAllGlobal = document.getElementById('deselectAllIngredientsBtn');
    
    if (!selectAllGlobal || !deselectAllGlobal) return;
    
    const totalProducts = allButtonsList.length;
    const selectedProducts = selectedIngredients.size;
    
    if (selectedProducts === totalProducts && totalProducts > 0) {
        selectAllGlobal.innerHTML = '✅ Выбрано всё';
    } else {
        selectAllGlobal.innerHTML = 'Выбрать всё';
    }
    
    deselectAllGlobal.innerHTML = selectedProducts === 0 ? '❌ Убрано всё' : 'Убрать всё';
}

// Обновляет всё после изменения выбора
function updateAllButtonsState() {
    for (let [groupName, data] of groupData.entries()) {
        updateGroupSelectAllButton(groupName);
        updateGroupDeselectAllButton(groupName);
    }
    updateGlobalButtons();
}

// ========== ГЛОБАЛЬНЫЕ ФУНКЦИИ ==========

window.selectAllIngredients = function() {
    allButtonsList.forEach(btn => {
        if (!btn.classList.contains('selected')) {
            btn.classList.add('selected');
            selectedIngredients.add(btn.textContent);
        }
    });
    updateAllButtonsState();
};

window.deselectAllIngredients = function() {
    allButtonsList.forEach(btn => {
        if (btn.classList.contains('selected')) {
            btn.classList.remove('selected');
            selectedIngredients.delete(btn.textContent);
        }
    });
    updateAllButtonsState();
};

// ========== ОТРИСОВКА КАТЕГОРИЙ ==========

function renderIngredients() {
    const container = document.getElementById('ingredientsGroupsContainer');
    if (!container) return;
    container.innerHTML = '';
    allButtonsList = [];
    groupData.clear();
    
    ingredientsGroups.forEach(group => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'ingredient-group';
        
        const header = document.createElement('div');
        header.className = 'group-header';
        
        const titleSpan = document.createElement('span');
        titleSpan.className = 'group-title';
        titleSpan.textContent = group.name;
        
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'group-actions';
        
        const selectAllBtn = document.createElement('button');
        selectAllBtn.textContent = 'Выбрать всё';
        selectAllBtn.className = 'group-select-all';
        
        const deselectAllBtn = document.createElement('button');
        deselectAllBtn.textContent = 'Убрать всё';
        deselectAllBtn.className = 'group-deselect-all';
        
        actionsDiv.appendChild(selectAllBtn);
        actionsDiv.appendChild(deselectAllBtn);
        
        header.appendChild(titleSpan);
        header.appendChild(actionsDiv);
        
        const itemsDiv = document.createElement('div');
        itemsDiv.className = 'group-items';
        itemsDiv.style.display = 'none';
        
        const groupButtons = [];
        
        group.items.forEach(item => {
            const btn = document.createElement('button');
            btn.textContent = item;
            btn.className = 'ingredient-btn';
            btn.addEventListener('click', () => {
                btn.classList.toggle('selected');
                if (btn.classList.contains('selected')) {
                    selectedIngredients.add(item);
                } else {
                    selectedIngredients.delete(item);
                }
                updateAllButtonsState();
            });
            itemsDiv.appendChild(btn);
            groupButtons.push(btn);
            allButtonsList.push(btn);
        });
        
        // Сохраняем данные о группе
        groupData.set(group.name, {
            buttons: groupButtons,
            selectAllBtn: selectAllBtn,
            deselectAllBtn: deselectAllBtn,
            groupItems: itemsDiv
        });
        
        // Логика для кнопки "Выбрать всё" в группе
        selectAllBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            groupButtons.forEach(btn => {
                if (!btn.classList.contains('selected')) {
                    btn.classList.add('selected');
                    selectedIngredients.add(btn.textContent);
                }
            });
            updateAllButtonsState();
        });
        
        // Логика для кнопки "Убрать всё" в группе
        deselectAllBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            groupButtons.forEach(btn => {
                if (btn.classList.contains('selected')) {
                    btn.classList.remove('selected');
                    selectedIngredients.delete(btn.textContent);
                }
            });
            updateAllButtonsState();
        });
        
        // Сворачивание/разворачивание
        let collapsed = true;
        header.addEventListener('click', (e) => {
            if (e.target === selectAllBtn || e.target === deselectAllBtn ||
                selectAllBtn.contains(e.target) || deselectAllBtn.contains(e.target)) {
                return;
            }
            collapsed = !collapsed;
            itemsDiv.style.display = collapsed ? 'none' : 'flex';
            header.querySelector('.group-title').style.opacity = collapsed ? '0.7' : '1';
        });
        
        groupDiv.appendChild(header);
        groupDiv.appendChild(itemsDiv);
        container.appendChild(groupDiv);
    });
    
    updateAllButtonsState();
}

// ========== ОТРИСОВКА РЕЦЕПТОВ ==========

function renderRecipeCard(recipe, status) {
    let statusBadge = '';
    let missingInfo = '';
    
    if (status === 'perfect') {
        statusBadge = '<span class="recipe-badge perfect-badge">✅ 100% готово</span>';
    } else if (status === 'missing1') {
        statusBadge = '<span class="recipe-badge missing1-badge">🛒 Не хватает 1 продукта</span>';
        missingInfo = `<div class="missing-warning">⚠️ Нужно докупить: <strong>${recipe.missingIngredients[0]}</strong></div>`;
    } else if (status === 'missing2') {
        statusBadge = '<span class="recipe-badge missing2-badge">📝 Не хватает 2 продуктов</span>';
        missingInfo = `<div class="missing-warning">⚠️ Нужно докупить: <strong>${recipe.missingIngredients.join(', ')}</strong></div>`;
    }
    
    const ingredientsPreview = recipe.ingredients.slice(0, 3).join(', ');
    const hasMore = recipe.ingredients.length > 3;
    
    // Эмодзи для разных типов блюд
    const typeEmoji = {
        salad: '🥗',
        snack: '🍢',
        soup: '🍲',
        main: '🍽️',
        sauce: '🥫',
        dessert: '🍰',
        drink: '🥤'
    };
    
    return `
        <div class="recipe-card" data-id="${recipe.id}">
            ${statusBadge}
            <div class="recipe-img-placeholder">${typeEmoji[recipe.type] || '🍽️'}</div>
            <h4>${recipe.name}</h4>
            <div class="recipe-meta">⏱️ ${recipe.cookingTime || 30} мин • 🔥 ${recipe.calories || '?'} ккал</div>
            <small>📋 Ингредиенты: ${ingredientsPreview}${hasMore ? '...' : ''}</small>
            ${missingInfo}
        </div>
    `;
}

function showRecipeModal(recipe) {
    const modalBody = document.getElementById('modalRecipeBody');
    if (!modalBody) return;
    
    let missingSection = '';
    if (recipe.missingIngredients && recipe.missingIngredients.length > 0) {
        missingSection = `<div class="missing-warning" style="margin-bottom: 20px;">⚠️ <strong>Внимание!</strong> Для этого рецепта вам не хватает:<br>📋 ${recipe.missingIngredients.join(', ')}</div>`;
    }
    
    modalBody.innerHTML = `
        <h2>${recipe.name}</h2>
        <div class="recipe-img-placeholder" style="height: 150px; margin-bottom: 15px;">🍽️</div>
        ${missingSection}
        <p><strong>⏱️ Время:</strong> ${recipe.cookingTime || 30} мин | <strong>🔥 Калории:</strong> ${recipe.calories || '?'} ккал</p>
        <h3>📋 Ингредиенты:</h3>
        <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
        <h3>👨‍🍳 Пошаговый рецепт:</h3>
        <div class="steps-list">${recipe.steps.map(s => `<p>${s}</p>`).join('')}</div>
        <h3>💡 Совет шефа:</h3>
        <p class="chef-tip">${recipe.tip || 'Подавай с любовью и свежей зеленью!'}</p>
    `;
    document.getElementById('recipeModal').style.display = 'flex';
}

// ========== ПОИСК РЕЦЕПТОВ ==========

window.findRecipes = function() {
    const resultsDiv = document.getElementById('recipesList');
    if (!resultsDiv) return;
    
    if (selectedIngredients.size === 0) {
        resultsDiv.innerHTML = '<div class="placeholder">⚠️ Выберите продукты в холодильнике</div>';
        return;
    }
    
    const userIngredients = Array.from(selectedIngredients);
    
    let perfectMatches = [];
    let missing1Match = [];
    let missing2Match = [];
    let otherMatches = [];
    
    allRecipes.forEach(recipe => {
        // Фильтр по типу блюда
        if (selectedType !== "all" && recipe.type !== selectedType) return;
        // Фильтр по кухне (если используется)
        if (currentCuisine !== "all" && recipe.cuisine !== currentCuisine) return;
        
        let missingIngredients = [];
        
        recipe.ingredients.forEach(recipeIng => {
            if (!recipeIng || recipeIng.trim() === '') return;
            const found = userIngredients.some(userIng => isIngredientMatch(userIng, recipeIng));
            if (!found) missingIngredients.push(recipeIng);
        });
        
        const missingCount = missingIngredients.length;
        
        if (missingCount === 0) {
            perfectMatches.push({ ...recipe, missingIngredients: [] });
        } else if (missingCount === 1) {
            missing1Match.push({ ...recipe, missingIngredients });
        } else if (missingCount === 2) {
            missing2Match.push({ ...recipe, missingIngredients });
        } else if (missingCount <= 4) {
            otherMatches.push({ ...recipe, missingIngredients });
        }
    });
    
    if (perfectMatches.length === 0 && missing1Match.length === 0 && missing2Match.length === 0 && otherMatches.length === 0) {
        resultsDiv.innerHTML = '<div class="placeholder">😕 Нет рецептов с выбранными продуктами. Попробуйте добавить ещё ингредиенты.</div>';
        return;
    }
    
    let html = '';
    
    if (perfectMatches.length > 0) {
        html += `<div class="results-section"><div class="section-header perfect"><span class="section-icon">✅</span><h3>Можно приготовить прямо сейчас! (${perfectMatches.length})</h3></div><div class="recipes-grid">${perfectMatches.map(r => renderRecipeCard(r, 'perfect')).join('')}</div></div>`;
    }
    
    if (missing1Match.length > 0) {
        html += `<div class="results-section"><div class="section-header missing1"><span class="section-icon">🛒</span><h3>Докупите 1 продукт! (${missing1Match.length})</h3></div><div class="recipes-grid">${missing1Match.map(r => renderRecipeCard(r, 'missing1')).join('')}</div></div>`;
    }
    
    if (missing2Match.length > 0) {
        html += `<div class="results-section"><div class="section-header missing2"><span class="section-icon">📝</span><h3>Докупите 2 продукта (${missing2Match.length})</h3></div><div class="recipes-grid">${missing2Match.map(r => renderRecipeCard(r, 'missing2')).join('')}</div></div>`;
    }
    
    if (otherMatches.length > 0) {
        html += `<div class="results-section"><div class="section-header missing2"><span class="section-icon">📋</span><h3>Нужно докупить 3-4 продукта (${otherMatches.length})</h3></div><div class="recipes-grid">${otherMatches.map(r => renderRecipeCard(r, 'missing2')).join('')}</div></div>`;
    }
    
    resultsDiv.innerHTML = html;
    
    document.querySelectorAll('.recipe-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = parseInt(card.getAttribute('data-id'));
            let recipe = [...perfectMatches, ...missing1Match, ...missing2Match, ...otherMatches].find(r => r.id === id);
            if (recipe) showRecipeModal(recipe);
        });
    });
};

// ========== НАСТРОЙКА ОБРАБОТЧИКОВ ==========

function setupEventListeners() {
    // Глобальные кнопки выбора продуктов
    document.getElementById('selectAllIngredientsBtn')?.addEventListener('click', () => window.selectAllIngredients());
    document.getElementById('deselectAllIngredientsBtn')?.addEventListener('click', () => window.deselectAllIngredients());
    
    // Меню-гамбургер
    document.getElementById('menuToggle')?.addEventListener('click', () => {
        document.getElementById('mobileNav')?.classList.toggle('open');
    });
    
    // Переключение тем
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-theme');
            document.body.classList.remove('theme-green', 'theme-orange');
            document.body.classList.add(`theme-${theme}`);
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            localStorage.setItem('preferredTheme', theme);
        });
    });
    
    // Восстановление сохраненной темы
    const savedTheme = localStorage.getItem('preferredTheme');
    if (savedTheme && savedTheme !== 'green') {
        document.body.classList.remove('theme-green');
        document.body.classList.add(`theme-${savedTheme}`);
        document.querySelector(`.theme-btn[data-theme="${savedTheme}"]`)?.classList.add('active');
        document.querySelector('.theme-btn[data-theme="green"]')?.classList.remove('active');
    }
    
    // Фильтр по типу блюда
    document.querySelectorAll('.type-buttons button').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.type-buttons button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedType = btn.getAttribute('data-type');
            // Автоматически обновляем результаты, если есть выбранные продукты
            if (selectedIngredients.size > 0) window.findRecipes();
        });
    });
    
    // Кнопка поиска рецептов
    document.getElementById('findRecipesBtn')?.addEventListener('click', () => window.findRecipes());
    
    // Навигация по кухням (для мобильного меню)
    document.querySelectorAll('.nav-category').forEach(btn => {
        btn.addEventListener('click', () => {
            currentCuisine = btn.getAttribute('data-category');
            document.getElementById('mobileNav')?.classList.remove('open');
            if (selectedIngredients.size > 0) window.findRecipes();
        });
    });
    
    // AI ассистент
    const aiModal = document.getElementById('aiModal');
    const openAiBtn = document.getElementById('openAiAssistantBtn');
    const closeAi = document.querySelector('.close-ai');
    const askBtn = document.getElementById('askAiBtn');
    const aiQuestion = document.getElementById('aiQuestion');
    const aiAnswer = document.getElementById('aiAnswer');
    
    openAiBtn?.addEventListener('click', () => { if(aiModal) aiModal.style.display = 'flex'; });
    closeAi?.addEventListener('click', () => { if(aiModal) aiModal.style.display = 'none'; });
    
    askBtn?.addEventListener('click', () => {
        const q = aiQuestion?.value.trim();
        if (!q) {
            if(aiAnswer) aiAnswer.innerHTML = '❓ Напишите ваш вопрос о готовке! Например: чем заменить яйца?';
            return;
        }
        const answer = getAIAnswer(q);
        aiAnswer.innerHTML = '🧑‍🍳 <strong>Ответ ИИ-шефа:</strong><br><br>' + answer;
        aiQuestion.value = '';
    });
    
    // Модальное окно рецепта
    const modal = document.getElementById('recipeModal');
    const closeModal = document.querySelector('.close');
    closeModal?.addEventListener('click', () => { if(modal) modal.style.display = 'none'; });
    
    // Закрытие модальных окон при клике вне их области
    window.onclick = (e) => { 
        if (e.target === modal) modal.style.display = 'none'; 
        if (e.target === aiModal) aiModal.style.display = 'none'; 
    };
    
    // Обработка Enter в поле вопроса AI
    aiQuestion?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            askBtn?.click();
        }
    });
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========

// Функция для обновления счетчика выбранных продуктов (опционально)
function updateSelectedCount() {
    const count = selectedIngredients.size;
    const total = allButtonsList.length;
    const counterEl = document.getElementById('selectedCount');
    if (counterEl) {
        counterEl.textContent = `${count} / ${total}`;
    }
}

// Запуск приложения
renderIngredients();
setupEventListeners();

// Выводим информацию о загруженных рецептах в консоль
console.log(`🍽️ Приложение "Шеф-повар" загружено!`);
console.log(`📚 Всего рецептов: ${allRecipes.length}`);
console.log(`🥗 Салатов: ${allRecipes.filter(r => r.type === 'salad').length}`);
console.log(`🍢 Закусок: ${allRecipes.filter(r => r.type === 'snack').length}`);
console.log(`🍲 Супов: ${allRecipes.filter(r => r.type === 'soup').length}`);
console.log(`🍽️ Вторых блюд: ${allRecipes.filter(r => r.type === 'main').length}`);

// Устанавливаем тему по умолчанию
if (!localStorage.getItem('preferredTheme')) {
    document.body.classList.add('theme-green');
} else {
    const saved = localStorage.getItem('preferredTheme');
    document.body.classList.add(`theme-${saved}`);
}

// Экспортируем некоторые функции для отладки (опционально)
if (typeof window !== 'undefined') {
    window.debugApp = {
        selectedIngredients: () => Array.from(selectedIngredients),
        allRecipes: allRecipes,
        clearSelection: () => {
            window.deselectAllIngredients();
            console.log('Выбор очищен');
        }
    };
}
