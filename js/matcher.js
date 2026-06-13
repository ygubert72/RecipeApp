// js/matcher.js

/**
 * Приведение слова к единственному числу (упрощенный алгоритм)
 */
function toSingular(word) {
    if (!word) return word;
    
    // Правила для русского языка (самые частые случаи)
    const rules = [
        // Окончания на -ы/-и (мн.ч.) -> ед.ч.
        { from: /ы$/i, to: 'а' },
        { from: /и$/i, to: 'а' },
        // Окончания на -я (мн.ч.) -> ед.ч. на -е
        { from: /я$/i, to: 'е' },
        // Окончания на -а (мн.ч. для ср.рода) -> ед.ч.
        { from: /а$/i, to: 'о' },
        // Особые случаи
        { from: /орехи$/i, to: 'орех' },
        { from: /яйца$/i, to: 'яйцо' },
        { from: /яйцо$/i, to: 'яйцо' },
        { from: /помидоры$/i, to: 'помидор' },
        { from: /огурцы$/i, to: 'огурец' },
        { from: /кабачки$/i, to: 'кабачок' },
        { from: /баклажаны$/i, to: 'баклажан' },
        { from: /перцы$/i, to: 'перец' },
        { from: /грибы$/i, to: 'гриб' },
        { from: /сыры$/i, to: 'сыр' },
        { from: /масла$/i, to: 'масло' },
        { from: /мясо$/i, to: 'мясо' },
        { from: /рыбы$/i, to: 'рыба' },
        { from: /птицы$/i, to: 'птица' },
        { from: /луки$/i, to: 'лук' },
        { from: /моркови$/i, to: 'морковь' },
        { from: /картофелины$/i, to: 'картофелина' },
        { from: /картофель$/i, to: 'картофель' },
        // Окончание -я для слов типа "колбаса" -> "колбасы" не трогаем
    ];
    
    let singular = word;
    for (const rule of rules) {
        if (rule.from.test(singular)) {
            singular = singular.replace(rule.from, rule.to);
            break;
        }
    }
    
    return singular;
}

/**
 * Нормализация ингредиента - универсальный метод
 * Приводит к единственному числу и сортирует слова
 */
export function normalizeIngredient(name) {
    if (!name) return '';
    
    let normalized = name.toLowerCase().trim();
    
    // Замена ё на е
    normalized = normalized.replace(/ё/g, 'е');
    
    // Убираем всё в скобках
    normalized = normalized.replace(/[\(（][^\)）]*[\)）]/g, '');
    
    // Убираем тире и всё после
    normalized = normalized.replace(/\s*[-—–]\s*.*$/, '');
    
    // Убираем цифры и дроби в начале
    normalized = normalized.replace(/^[\d\s\/\+\-\(\)]+/, '');
    
    // Убираем слова-маркеры количества
    normalized = normalized.replace(/^(около|примерно|~|по\s*вкусу|до|несколько|половина|четверть|щепотка|щепотку|пару|пара)\s*/i, '');
    
    // Убираем единицы измерения
    normalized = normalized.replace(/\s*(г|гр|грамм|грамма|граммов|кг|мл|л|шт|штук|штуки|банка|банки|пучок|пучка|зубчик|зубчика|ст\.?\s*ложк[аи]|ложк[аи]|ст\.?\s*л|ч\.?\s*ложк[аи]|ч\.?\s*л|стакан[а]?|стак\.|капля|капель|щепотк[ау]|дольк[аи]|кусоч[еи]к|ломтик[аи]?)\b.*$/i, '');
    normalized = normalized.replace(/\s*(столовая|чайная|десертная)\s*ложка\b.*$/i, '');
    
    // Убираем общие прилагательные-определения
    const removeWords = [
        'свежий', 'свежие', 'свежая', 'свежее', 'свежих',
        'соленый', 'соленые', 'соленая', 'солёный', 'солёные', 'солёная',
        'маринованный', 'маринованные', 'маринованная',
        'вареный', 'вареная', 'варёный', 'варёная',
        'копченый', 'копченая', 'копчёный', 'копчёная',
        'слабосоленый', 'слабосолёный', 'слабосолёная',
        'сушеный', 'сушеные', 'вяленый', 'вяленые',
        'консервированный', 'консервированная', 'консервированные',
        'замороженный', 'замороженные', 'замороженная',
        'кипяченый', 'кипячёный', 'отварной', 'печёный', 'запечёный',
        'тёртый', 'тертый', 'нарезанный', 'измельченный',
        'жидкий', 'густой', 'простой', 'готовый',
        'мелкий', 'крупный', 'средний', 'мелкие', 'крупные',
        'домашний', 'домашние', 'домашняя',
        'натуральный', 'натуральные', 'натуральная',
        'целый', 'целые', 'целая', 'целое',
        'очищенный', 'очищенные', 'очищенная',
        'натертый', 'натертые', 'натертая',
        'молотый', 'молотая', 'молотое', 'молотые',
        'панировочные', 'сладкий', 'сладкие', 'сладкая'
    ];
    
    for (let word of removeWords) {
        normalized = normalized.replace(new RegExp(`\\b${word}\\s*`, 'gi'), '');
    }
    
    // Убираем "по вкусу", "по желанию", "по необходимости"
    normalized = normalized.replace(/\s*по\s*(вкусу|желанию|необходимости)\s*/gi, '');
    
    // Очистка от лишних пробелов
    normalized = normalized.trim();
    normalized = normalized.replace(/\s+/g, ' ');
    
    // Разбиваем на слова
    let words = normalized.split(/\s+/);
    
    // ========== ПРИВОДИМ КАЖДОЕ СЛОВО К ЕДИНСТВЕННОМУ ЧИСЛУ ==========
    words = words.map(word => toSingular(word));
    
    // ========== УНИВЕРСАЛЬНАЯ СОРТИРОВКА СЛОВ ==========
    if (words.length > 1) {
        words.sort();
    }
    
    // Удаляем возможные дубликаты слов
    words = [...new Set(words)];
    
    normalized = words.join(' ');
    
    return normalized;
}

/**
 * Проверка на синонимы (только для особых случаев)
 */
const SYNONYMS = {
    'картофель': ['картошка', 'картофелина'],
    'картошка': ['картофель', 'картофелина'],
    'помидор': ['томат'],
    'томат': ['помидор'],
    'свекла': ['буряк'],
    'морковь': ['морковка'],
    'лук': ['луковица'],
    'чеснок': ['чесночина', 'зубок чеснока'],
    'масло растительное': ['растительное масло', 'подсолнечное масло', 'масло подсолнечное'],
    'куриное филе': ['курица', 'куриная грудка', 'филе куриное'],
    'яйцо': ['яйца', 'куриное яйцо'],
    'яйца': ['яйцо', 'куриное яйцо'],
    'семга': ['лосось'],
    'сельдь': ['селедка'],
    'грецкий орех': ['орех грецкий', 'грецкие орехи', 'орехи грецкие']
};

/**
 * Основная функция сравнения ингредиентов
 */
export function isIngredientMatch(userIngredient, recipeIngredient) {
    if (!userIngredient || !recipeIngredient) return false;
    
    const userNorm = normalizeIngredient(userIngredient);
    const recipeNorm = normalizeIngredient(recipeIngredient);
    
    // Прямое сравнение после нормализации
    if (userNorm === recipeNorm) return true;
    
    // Проверка вхождения
    if (userNorm.includes(recipeNorm) || recipeNorm.includes(userNorm)) return true;
    
    // Проверка по словарю синонимов (с учетом нормализации)
    for (const [key, synonyms] of Object.entries(SYNONYMS)) {
        const keyNorm = normalizeIngredient(key);
        if (userNorm === keyNorm || recipeNorm === keyNorm) {
            for (let syn of synonyms) {
                const synNorm = normalizeIngredient(syn);
                if (userNorm === synNorm || recipeNorm === synNorm) {
                    return true;
                }
            }
        }
    }
    
    // Дополнительная проверка: сравнение наборов слов
    const userWords = userNorm.split(/\s+/);
    const recipeWords = recipeNorm.split(/\s+/);
    
    // Если все слова совпадают (независимо от порядка) - это тот же ингредиент
    if (userWords.length === recipeWords.length) {
        const userSet = new Set(userWords);
        const recipeSet = new Set(recipeWords);
        let allMatch = true;
        for (let word of userWords) {
            if (!recipeSet.has(word)) {
                allMatch = false;
                break;
            }
        }
        if (allMatch) return true;
    }
    
    // Если одно слово является подмножеством другого
    // Например: "орех" и "грецкий орех"
    if (userWords.length === 1 && recipeWords.includes(userWords[0])) return true;
    if (recipeWords.length === 1 && userWords.includes(recipeWords[0])) return true;
    
    return false;
}
