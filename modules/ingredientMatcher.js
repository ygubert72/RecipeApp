// modules/ingredientMatcher.js
// Универсальный модуль для сравнения ингредиентов
// Работает с любыми перестановками слов автоматически

export class IngredientMatcher {
    constructor() {
        this.initSynonymMap();
    }
    
    initSynonymMap() {
        // Только специфические синонимы, которые не решаются сортировкой
        // Например: "картофель" и "картошка" - это разные слова
        this.synonymMap = {
            'картофель': ['картошка', 'картофелина'],
            'картошка': ['картофель', 'картофелина'],
            'помидор': ['томат', 'помидоры'],
            'помидоры': ['томат', 'томаты', 'помидор'],
            'томат': ['помидор', 'помидоры'],
            'томаты': ['помидоры', 'помидор'],
            'лук': ['луковица'],
            'чеснок': ['чесночина', 'зубок чеснока'],
            'свекла': ['буряк'],
            'морковь': ['морковка'],
            'масло растительное': ['растительное масло', 'подсолнечное масло', 'масло подсолнечное'],
            'куриное филе': ['курица', 'куриная грудка', 'филе куриное'],
            'яйца': ['яйцо', 'куриное яйцо'],
            'семга': ['лосось'],
            'сельдь': ['селедка']
        };
    }
    
    /**
     * Универсальная нормализация с сортировкой слов
     * Автоматически решает проблему перестановки
     */
    normalizeIngredient(name) {
        if (!name) return '';
        
        let normalized = name.toLowerCase().trim();
        
        // Замена ё на е
        normalized = normalized.replace(/ё/g, 'е');
        
        // Убираем всё, что в скобках
        normalized = normalized.replace(/[\(（][^\)）]*[\)）]/g, '');
        
        // Убираем тире и всё после них
        normalized = normalized.replace(/\s*[-—–]\s*.*$/, '');
        
        // Убираем количество в начале
        normalized = normalized.replace(/^[\d\s\/\+\-\(\)]+/, '');
        
        // Убираем слова-маркеры количества
        normalized = normalized.replace(/^(около|примерно|~|по\s*вкусу|до|несколько)\s*/i, '');
        
        // Убираем единицы измерения
        normalized = normalized.replace(/\s*(г|гр|грамм|грамма|кг|мл|л|шт|штук|штуки|банка|банки|пучок|пучка|зубчик|зубчика|ст\.?\s*ложк[аи]|ложк[аи]|ст\.?\s*л|ч\.?\s*ложк[аи]|ч\.?\s*л|стакан[а]?|стак\.|капля|капель)\b.*$/i, '');
        
        // Убираем общие прилагательные
        const removeWords = [
            'свежий', 'свежие', 'свежая', 'свежее',
            'соленые', 'соленый', 'соленая', 'солёный',
            'маринованные', 'маринованный', 'маринованная',
            'вареная', 'вареный', 'варёный', 'варёная',
            'копченая', 'копченый', 'копчёный', 'копчёная',
            'слабосоленая', 'слабосоленый', 'слабосолёный',
            'сушеный', 'сушеные', 'вяленый', 'вяленые',
            'консервированный', 'консервированная', 'консервированные',
            'замороженный', 'замороженные', 'замороженная'
        ];
        
        for (let word of removeWords) {
            normalized = normalized.replace(new RegExp(`\\b${word}\\s*`, 'gi'), '');
        }
        
        // Убираем "по вкусу", "по желанию"
        normalized = normalized.replace(/\s*по\s*(вкусу|желанию|необходимости)\s*/gi, '');
        
        // Убираем лишние пробелы
        normalized = normalized.trim();
        normalized = normalized.replace(/\s+/g, ' ');
        
        // ========== УНИВЕРСАЛЬНАЯ СОРТИРОВКА СЛОВ ==========
        // Это ключевое решение - сортируем все слова по алфавиту
        // Теперь "грецкий орех" и "орех грецкий" станут одинаковыми
        const words = normalized.split(/\s+/);
        if (words.length > 1) {
            words.sort();
            normalized = words.join(' ');
        }
        
        return normalized;
    }
    
    /**
     * Проверка на совпадение ингредиентов
     */
    isMatch(userIngredient, recipeIngredient) {
        if (!userIngredient || !recipeIngredient) return false;
        
        const userNorm = this.normalizeIngredient(userIngredient);
        const recipeNorm = this.normalizeIngredient(recipeIngredient);
        
        // Прямое сравнение после нормализации
        if (userNorm === recipeNorm) return true;
        
        // Проверка вхождения
        if (userNorm.includes(recipeNorm) || recipeNorm.includes(userNorm)) return true;
        
        // Проверка по словарю синонимов
        if (this.synonymMap[userNorm]) {
            for (let syn of this.synonymMap[userNorm]) {
                const synNorm = this.normalizeIngredient(syn);
                if (synNorm === recipeNorm || recipeNorm.includes(synNorm) || synNorm.includes(recipeNorm)) {
                    return true;
                }
            }
        }
        
        if (this.synonymMap[recipeNorm]) {
            for (let syn of this.synonymMap[recipeNorm]) {
                const synNorm = this.normalizeIngredient(syn);
                if (synNorm === userNorm || userNorm.includes(synNorm) || synNorm.includes(userNorm)) {
                    return true;
                }
            }
        }
        
        // Дополнительная проверка набора слов
        const userWords = userNorm.split(/\s+/);
        const recipeWords = recipeNorm.split(/\s+/);
        
        if (userWords.length > 1 && recipeWords.length > 1) {
            const userSet = new Set(userWords);
            const recipeSet = new Set(recipeWords);
            
            // Если все слова совпадают - это один и тот же ингредиент
            let allMatch = true;
            for (let word of userWords) {
                if (!recipeSet.has(word)) {
                    allMatch = false;
                    break;
                }
            }
            if (allMatch && userWords.length === recipeWords.length) {
                return true;
            }
        }
        
        return false;
    }
    
    findMissingIngredients(recipe, userIngredients) {
        const missing = [];
        const matched = [];
        
        for (let recipeIng of recipe.ingredients) {
            const found = userIngredients.some(userIng => this.isMatch(userIng, recipeIng));
            if (found) {
                matched.push(recipeIng);
            } else {
                missing.push(recipeIng);
            }
        }
        
        return { missing, matched, missingCount: missing.length };
    }
}

export default IngredientMatcher;
