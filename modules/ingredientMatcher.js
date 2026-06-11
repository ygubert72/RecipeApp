// modules/ingredientMatcher.js
// Универсальный модуль для сравнения ингредиентов

export class IngredientMatcher {
    constructor() {
        this.initSynonymMap();
    }
    
    initSynonymMap() {
        // Расширенный словарь синонимов
        this.synonymMap = {
            'масло подсолнечное': ['масло растительное', 'подсолнечное масло', 'растительное масло', 'масло'],
            'масло растительное': ['масло подсолнечное', 'подсолнечное масло', 'масло'],
            'масло оливковое': ['оливковое масло', 'масло'],
            'салат': ['салат листовой', 'листья салата', 'салатные листья', 'лист салата'],
            'салат листовой': ['салат', 'листья салата'],
            'сельдерей': ['сельдерей черешковый', 'сельдерей стеблевой', 'черешковый сельдерей'],
            'сельдерей черешковый': ['сельдерей', 'сельдерей стеблевой'],
            'перец черный': ['перец черный молотый', 'черный перец', 'молотый перец'],
            'перец черный молотый': ['перец черный', 'черный перец'],
            'сыр': ['сыр твердый', 'сыр твёрдый'],
            'сыр твердый': ['сыр', 'твёрдый сыр'],
            'курица': ['куриное филе', 'куриная грудка', 'курица копченая'],
            'курица копченая': ['курица', 'копченая курица'],
            'яйцо': ['яйца', 'куриное яйцо'],
            'яйца': ['яйцо', 'куриное яйцо'],
            'майонез': ['майонез провансаль'],
            'сметана': ['сметана 20%'],
            'лук': ['лук репчатый'],
            'лук репчатый': ['лук'],
            'чеснок': ['зубчик чеснока'],
            'масло сливочное': ['сливочное масло'],
            'уксус': ['уксус столовый'],
            'лимон': ['лимонный сок']
        };
        
        // Специальные пары для прямого сравнения
        this.specialPairs = [
            ['курица', 'куриное филе'], ['куриное филе', 'курица'],
            ['курица', 'куриная грудка'], ['куриная грудка', 'курица'],
            ['огурец', 'огурцы'], ['помидор', 'помидоры'],
            ['яйцо', 'яйца'], ['сыр', 'сыр твердый'],
            ['сыр твердый', 'сыр'], ['перец черный', 'перец черный молотый'],
            ['перец черный молотый', 'перец черный'],
            ['масло подсолнечное', 'масло растительное'],
            ['масло растительное', 'масло подсолнечное'],
            ['салат', 'салат листовой'], ['сельдерей', 'сельдерей черешковый'],
            ['сметана', 'сметана 20%'], ['сметана 20%', 'сметана'],
            ['лук', 'лук репчатый'], ['лук репчатый', 'лук'],
            ['чеснок', 'зубчик чеснока'], ['зубчик чеснока', 'чеснок']
        ];
    }
    
    normalizeIngredient(name) {
        let normalized = name.toLowerCase().trim();
        
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
        
        // Убираем прилагательные
        const removeWords = [
            'свежий', 'свежие', 'свежая', 'свежее',
            'соленые', 'соленый', 'соленая',
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
        
        // Приведение множественного числа к единственному
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
        
        return normalized;
    }
    
    isMatch(userIngredient, recipeIngredient) {
        const userNorm = this.normalizeIngredient(userIngredient);
        const recipeNorm = this.normalizeIngredient(recipeIngredient);
        
        if (userNorm === recipeNorm) return true;
        
        // Проверка вхождения
        if (userNorm.includes(recipeNorm) || recipeNorm.includes(userNorm)) return true;
        
        // Проверка по словарю синонимов
        if (this.synonymMap[userNorm]) {
            for (let syn of this.synonymMap[userNorm]) {
                if (syn === recipeNorm || recipeNorm.includes(syn) || syn.includes(recipeNorm)) {
                    return true;
                }
            }
        }
        
        if (this.synonymMap[recipeNorm]) {
            for (let syn of this.synonymMap[recipeNorm]) {
                if (syn === userNorm || userNorm.includes(syn) || syn.includes(userNorm)) {
                    return true;
                }
            }
        }
        
        // Проверка специальных пар
        for (let pair of this.specialPairs) {
            if ((userNorm === pair[0] && recipeNorm === pair[1]) ||
                (userNorm === pair[1] && recipeNorm === pair[0])) {
                return true;
            }
        }
        
        return false;
    }
    
    findMissingIngredients(recipe, userIngredients) {
        const missing = [];
        const matched = [];
        
        recipe.ingredients.forEach(recipeIng => {
            const found = userIngredients.some(userIng => this.isMatch(userIng, recipeIng));
            if (found) {
                matched.push(recipeIng);
            } else {
                missing.push(recipeIng);
            }
        });
        
        return { missing, matched, missingCount: missing.length };
    }
}

export default IngredientMatcher;
