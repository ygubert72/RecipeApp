// modules/ingredientMatcher.js
// Универсальный модуль для сравнения ингредиентов
// Поддерживает: перестановку слов, множественное число, синонимы

export class IngredientMatcher {
    constructor() {
        this.initSynonymMap();
    }
    
    initSynonymMap() {
        // Только специфические синонимы, которые не решаются автоматически
        this.synonymMap = {
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
            'семга': ['лосось'],
            'сельдь': ['селедка'],
            'грецкий орех': ['орех грецкий', 'грецкие орехи', 'орехи грецкие']
        };
    }
    
    /**
     * Приведение слова к единственному числу
     */
    toSingular(word) {
        if (!word) return word;
        
        // Специальные случаи (самые частые)
        const specialCases = {
            'орехи': 'орех',
            'яйца': 'яйцо',
            'помидоры': 'помидор',
            'огурцы': 'огурец',
            'кабачки': 'кабачок',
            'баклажаны': 'баклажан',
            'перцы': 'перец',
            'грибы': 'гриб',
            'сыры': 'сыр',
            'масла': 'масло',
            'рыбы': 'рыба',
            'луки': 'лук',
            'моркови': 'морковь',
            'свеклы': 'свекла',
            'тыквы': 'тыква',
            'яблоки': 'яблоко',
            'груши': 'груша',
            'бананы': 'банан',
            'апельсины': 'апельсин',
            'лимоны': 'лимон',
            'мандарины': 'мандарин',
            'персики': 'персик',
            'абрикосы': 'абрикос',
            'сливы': 'слива',
            'вишни': 'вишня',
            'клубники': 'клубника',
            'малины': 'малина',
            'сосиски': 'сосиска',
            'сардельки': 'сарделька'
        };
        
        if (specialCases[word]) {
            return specialCases[word];
        }
        
        // Общие правила
        if (word.endsWith('ы') && !word.endsWith('и')) {
            return word.slice(0, -1);
        }
        if (word.endsWith('и') && word.length > 2) {
            // "огурцы" -> "огурец" (особый случай, уже обработан)
            if (word.endsWith('цы')) return word.slice(0, -2) + 'ц';
            if (word.endsWith('ки')) return word.slice(0, -2) + 'к';
            return word.slice(0, -1);
        }
        if (word.endsWith('я')) {
            return word.slice(0, -1) + 'е';
        }
        
        return word;
    }
    
    /**
     * Универсальная нормализация с сортировкой слов и приведением к ед.числу
     */
    normalizeIngredient(name) {
        if (!name) return '';
        
        let normalized = name.toLowerCase().trim();
        
        // Замена ё на е
        normalized = normalized.replace(/ё/g, 'е');
        
        // Убираем всё в скобках
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
            'вареная', 'вареный', 'варёный',
            'копченая', 'копченый', 'копчёный',
            'слабосоленая', 'слабосоленый',
            'сушеный', 'сушеные', 'вяленый', 'вяленые',
            'консервированный', 'консервированная',
            'замороженный', 'замороженные'
        ];
        
        for (let word of removeWords) {
            normalized = normalized.replace(new RegExp(`\\b${word}\\s*`, 'gi'), '');
        }
        
        // Убираем "по вкусу", "по желанию"
        normalized = normalized.replace(/\s*по\s*(вкусу|желанию|необходимости)\s*/gi, '');
        
        // Убираем лишние пробелы
        normalized = normalized.trim();
        normalized = normalized.replace(/\s+/g, ' ');
        
        // Разбиваем на слова
        let words = normalized.split(/\s+/);
        
        // ========== ПРИВОДИМ КАЖДОЕ СЛОВО К ЕДИНСТВЕННОМУ ЧИСЛУ ==========
        words = words.map(word => this.toSingular(word));
        
        // ========== УНИВЕРСАЛЬНАЯ СОРТИРОВКА СЛОВ ==========
        if (words.length > 1) {
            words.sort();
        }
        
        // Удаляем дубликаты
        words = [...new Set(words)];
        
        return words.join(' ');
    }
    
    /**
     * Проверка на совпадение ингредиентов
     */
    isMatch(userIngredient, recipeIngredient) {
        if (!userIngredient || !recipeIngredient) return false;
        
        const userNorm = this.normalizeIngredient(userIngredient);
        const recipeNorm = this.normalizeIngredient(recipeIngredient);
        
        // Прямое сравнение
        if (userNorm === recipeNorm) return true;
        
        // Проверка вхождения
        if (userNorm.includes(recipeNorm) || recipeNorm.includes(userNorm)) return true;
        
        // Проверка по словарю синонимов
        for (const [key, synonyms] of Object.entries(this.synonymMap)) {
            const keyNorm = this.normalizeIngredient(key);
            if (userNorm === keyNorm || recipeNorm === keyNorm) {
                for (let syn of synonyms) {
                    const synNorm = this.normalizeIngredient(syn);
                    if (userNorm === synNorm || recipeNorm === synNorm) {
                        return true;
                    }
                }
            }
        }
        
        // Проверка набора слов (для случаев, когда одно слово входит в другое)
        const userWords = userNorm.split(/\s+/);
        const recipeWords = recipeNorm.split(/\s+/);
        
        // Если все слова пользователя есть в рецепте
        if (userWords.length <= recipeWords.length) {
            let allMatch = true;
            for (let word of userWords) {
                if (!recipeWords.includes(word)) {
                    allMatch = false;
                    break;
                }
            }
            if (allMatch) return true;
        }
        
        // Если все слова рецепта есть у пользователя
        if (recipeWords.length <= userWords.length) {
            let allMatch = true;
            for (let word of recipeWords) {
                if (!userWords.includes(word)) {
                    allMatch = false;
                    break;
                }
            }
            if (allMatch) return true;
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
