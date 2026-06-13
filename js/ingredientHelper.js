// js/ingredientHelper.js
// Универсальный хелпер для работы с ингредиентами
// Автоматически обрабатывает перестановки слов

/**
 * Базовые стоп-слова, которые удаляются при нормализации
 */
const STOP_WORDS = new Set([
    'свежий', 'свежая', 'свежее', 'свежие',
    'соленый', 'соленая', 'соленое', 'соленые',
    'солёный', 'солёная', 'солёное', 'солёные',
    'маринованный', 'маринованная', 'маринованное', 'маринованные',
    'вареный', 'вареная', 'вареное', 'варёный',
    'копченый', 'копченая', 'копченое', 'копчёный',
    'вяленый', 'вяленая', 'вяленое',
    'сушеный', 'сушеная', 'сушеное',
    'консервированный', 'консервированная', 'консервированное',
    'замороженный', 'замороженная', 'замороженное',
    'молотый', 'молотая', 'молотое', 'молотые',
    'тертый', 'тертая', 'тертое', 'тёртый',
    'мелкий', 'мелкая', 'мелкое', 'мелкие',
    'крупный', 'крупная', 'крупное', 'крупные',
    'домашний', 'домашняя', 'домашнее',
    'натуральный', 'натуральная', 'натуральное',
    'целый', 'целая', 'целое', 'целые',
    'очищенный', 'очищенная', 'очищенное',
    'панировочный', 'панировочная', 'панировочные'
]);

/**
 * Нормализация ингредиента с сортировкой слов
 */
export function normalizeIngredient(ingredient) {
    if (!ingredient) return '';
    
    let normalized = ingredient.toLowerCase().trim();
    
    // Замена ё на е
    normalized = normalized.replace(/ё/g, 'е');
    
    // Удаление скобок и их содержимого
    normalized = normalized.replace(/[\(（][^\)）]*[\)）]/g, '');
    
    // Удаление тире и всего после
    normalized = normalized.replace(/\s*[-—–]\s*.*$/, '');
    
    // Удаление цифр в начале
    normalized = normalized.replace(/^[\d\s\/\+\-\(\)]+/, '');
    
    // Удаление единиц измерения
    normalized = normalized.replace(/\s*(г|гр|грамм|кг|мл|л|шт|банка|пучок|зубчик|ложка|стакан)\b.*$/i, '');
    
    // Разбиваем на слова и фильтруем стоп-слова
    let words = normalized.split(/\s+/).filter(word => 
        word.length > 0 && !STOP_WORDS.has(word)
    );
    
    if (words.length === 0) return '';
    
    // ========== КЛЮЧЕВОЕ РЕШЕНИЕ: СОРТИРУЕМ СЛОВА ==========
    // Теперь порядок слов не имеет значения
    words.sort();
    
    // Удаляем возможные дубликаты
    words = [...new Set(words)];
    
    return words.join(' ');
}

/**
 * Расширенное сравнение ингредиентов
 */
export function isIngredientMatch(userIngredient, recipeIngredient) {
    if (!userIngredient || !recipeIngredient) return false;
    
    const userNorm = normalizeIngredient(userIngredient);
    const recipeNorm = normalizeIngredient(recipeIngredient);
    
    // Прямое сравнение (уже с учетом порядка слов)
    if (userNorm === recipeNorm) return true;
    
    // Проверка вхождения (один ингредиент является частью другого)
    if (userNorm.includes(recipeNorm) || recipeNorm.includes(userNorm)) return true;
    
    // Специальные синонимы (только для разных слов)
    const specialSynonyms = {
        'картофель': 'картошка',
        'картошка': 'картофель',
        'помидор': 'томат',
        'помидоры': 'томаты',
        'томат': 'помидор',
        'томаты': 'помидоры',
        'свекла': 'буряк',
        'морковь': 'морковка',
        'лук': 'луковица',
        'чеснок': 'чесночина'
    };
    
    if (specialSynonyms[userNorm] === recipeNorm || specialSynonyms[recipeNorm] === userNorm) {
        return true;
    }
    
    return false;
}

/**
 * Проверка, является ли ингредиент подмножеством другого
 * Например: "сыр" является подмножеством "сыр твердый"
 */
export function isSubsetMatch(userIngredient, recipeIngredient) {
    if (!userIngredient || !recipeIngredient) return false;
    
    const userNorm = normalizeIngredient(userIngredient);
    const recipeNorm = normalizeIngredient(recipeIngredient);
    
    const userWords = userNorm.split(/\s+/);
    const recipeWords = recipeNorm.split(/\s+/);
    
    // Если все слова пользователя есть в рецепте
    let allUserWordsInRecipe = true;
    for (let word of userWords) {
        if (!recipeWords.includes(word)) {
            allUserWordsInRecipe = false;
            break;
        }
    }
    
    // Если все слова рецепта есть у пользователя
    let allRecipeWordsInUser = true;
    for (let word of recipeWords) {
        if (!userWords.includes(word)) {
            allRecipeWordsInUser = false;
            break;
        }
    }
    
    return allUserWordsInRecipe || allRecipeWordsInUser;
}
