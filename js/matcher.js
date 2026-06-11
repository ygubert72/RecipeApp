// js/matcher.js

// Нормализация ингредиента (убирает количество, единицы измерения, приводит к ед.числу)
export function normalizeIngredient(name) {
    let normalized = name.toLowerCase().trim();
    
    // Убираем всё в скобках
    normalized = normalized.replace(/[\(（][^\)）]*[\)）]/g, '');
    // Убираем тире и всё после
    normalized = normalized.replace(/\s*[-—–]\s*.*$/, '');
    // Убираем цифры и дроби в начале
    normalized = normalized.replace(/^[\d\s\/\+\-\(\)]+/, '');
    // Убираем слова-маркеры
    normalized = normalized.replace(/^(около|примерно|~|по\s*вкусу|до|несколько)\s*/i, '');
    // Убираем единицы измерения
    normalized = normalized.replace(/\s*(г|гр|грамм|грамма|кг|мл|л|шт|штук|штуки|банка|банки|пучок|пучка|зубчик|зубчика|ст\.?\s*ложк[аи]|ложк[аи]|ст\.?\s*л|ч\.?\s*ложк[аи]|ч\.?\s*л|стакан[а]?|стак\.|капля|капель)\b.*$/i, '');
    normalized = normalized.replace(/\s*(столовая|чайная|десертная)\s*ложка\b.*$/i, '');
    
    // Убираем прилагательные
    const removeWords = ['свежий', 'свежие', 'свежая', 'свежее', 'соленые', 'соленый', 'соленая', 'маринованные', 'маринованный', 'маринованная', 'вареная', 'вареный', 'варёный', 'копченая', 'копченый', 'копчёный', 'слабосоленая', 'слабосоленый', 'сушеный', 'сушеные', 'вяленый', 'вяленые', 'консервированный', 'консервированная', 'замороженный', 'замороженные'];
    for (let word of removeWords) {
        normalized = normalized.replace(new RegExp(`\\b${word}\\s*`, 'gi'), '');
    }
    
    // Убираем "по вкусу", "по желанию"
    normalized = normalized.replace(/\s*по\s*(вкусу|желанию|необходимости)\s*/gi, '');
    normalized = normalized.trim();
    
    // Множественное число → единственное
    const pluralRules = [
        { from: /яйц[ао]$/i, to: 'яйцо' }, { from: /яиц$/i, to: 'яйцо' },
        { from: /огурц[ыи]$/i, to: 'огурец' }, { from: /помидор[ыа]$/i, to: 'помидор' },
        { from: /картофел[ия]$/i, to: 'картофель' }, { from: /морков[и]$/i, to: 'морковь' },
        { from: /лук[аи]$/i, to: 'лук' }, { from: /сосисок$/i, to: 'сосиска' },
        { from: /сосиск[и]$/i, to: 'сосиска' }, { from: /яблок[ао]$/i, to: 'яблоко' },
        { from: /груш[и]$/i, to: 'груша' }, { from: /банан[овы]?$/i, to: 'банан' },
        { from: /апельсин[аов]?$/i, to: 'апельсин' }, { from: /лимоны$/i, to: 'лимон' },
        { from: /сыр[аов]?$/i, to: 'сыр' }, { from: /гриб[аов]?$/i, to: 'гриб' },
        { from: /орех[аов]?$/i, to: 'орех' }, { from: /лист[ьа]?я?$/i, to: 'лист' },
        { from: /веточк[аи]$/i, to: 'веточка' }
    ];
    for (let rule of pluralRules) {
        if (rule.from.test(normalized)) {
            normalized = normalized.replace(rule.from, rule.to);
            break;
        }
    }
    
    // Убираем окончание "и" в конце
    if (normalized.endsWith('и') && normalized.length > 2) {
        const withoutI = normalized.slice(0, -1);
        if (!withoutI.endsWith('к') && !withoutI.endsWith('ш')) {
            normalized = withoutI;
        }
    }
    
    // 🔥 НОВОЕ: Нормализация порядка слов (сортируем слова по алфавиту)
    // "тыквенные семечки" → "семечки тыквенные" → оба варианта станут одинаковыми
    const words = normalized.split(/\s+/);
    if (words.length > 1) {
        words.sort();
        normalized = words.join(' ');
    }
    
    return normalized;
}

// Сравнение ингредиентов с учётом синонимов
export function isIngredientMatch(userIngredient, recipeIngredient) {
    const userNorm = normalizeIngredient(userIngredient);
    const recipeNorm = normalizeIngredient(recipeIngredient);
    
    if (userNorm === recipeNorm) return true;
    if (userNorm.includes(recipeNorm) || recipeNorm.includes(userNorm)) return true;
    
    // Синонимы
    const synonymMap = {
        'масло подсолнечное': ['масло растительное', 'подсолнечное масло', 'растительное масло', 'масло'],
        'масло растительное': ['масло подсолнечное', 'подсолнечное масло', 'масло'],
        'масло оливковое': ['оливковое масло', 'масло'],
        'салат': ['салат листовой', 'листья салата', 'салатные листья', 'лист салата'],
        'сыр': ['сыр твердый', 'сыр твёрдый'],
        'курица': ['куриное филе', 'куриная грудка', 'курица копченая'],
        'яйцо': ['яйца', 'куриное яйцо']
    };
    
    if (synonymMap[userNorm]) {
        for (let syn of synonymMap[userNorm]) {
            if (syn === recipeNorm || recipeNorm.includes(syn) || syn.includes(recipeNorm)) return true;
        }
    }
    if (synonymMap[recipeNorm]) {
        for (let syn of synonymMap[recipeNorm]) {
            if (syn === userNorm || userNorm.includes(syn) || syn.includes(userNorm)) return true;
        }
    }
    
    // Специальные пары
    const specialPairs = [
        ['курица', 'куриное филе'], ['огурец', 'огурцы'], ['помидор', 'помидоры'],
        ['яйцо', 'яйца'], ['сыр', 'сыр твердый'], ['лук', 'лук репчатый'], ['чеснок', 'зубчик чеснока']
    ];
    for (let pair of specialPairs) {
        if ((userNorm === pair[0] && recipeNorm === pair[1]) || (userNorm === pair[1] && recipeNorm === pair[0])) {
            return true;
        }
    }
    
    return false;
}
