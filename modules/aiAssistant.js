export class AIAssistant {
    init() {
        const openBtn = document.getElementById('openAiAssistantBtn');
        const modal = document.getElementById('aiModal');
        const close = document.querySelector('.close-ai');
        const askBtn = document.getElementById('askAiBtn');
        const question = document.getElementById('aiQuestion');
        const answer = document.getElementById('aiAnswer');
        
        openBtn.onclick = () => modal.style.display = 'flex';
        close.onclick = () => modal.style.display = 'none';
        window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
        
        askBtn.onclick = () => {
            const q = question.value.trim();
            if (!q) {
                answer.innerHTML = '❓ Напиши свой вопрос о готовке!';
                return;
            }
            
            answer.innerHTML = '🤔 Анализирую кулинарную мудрость...';
            
            setTimeout(() => {
                answer.innerHTML = this.getAnswer(q);
            }, 300);
        };
    }
    
    getAnswer(question) {
        const q = question.toLowerCase();
        
        const answers = {
            'заменить яйца': 'Яйца можно заменить: банановым пюре (1 яйцо = 1/2 банана), льняной мукой с водой (1 ст.л. муки + 3 ст.л. воды), или тофу',
            'заменить сливки': 'Сливки заменяют: кокосовое молоко, смесь молока с маслом (200 мл молока + 2 ст.л. масла), или густая сметана с молоком',
            'заменить сыр': 'Для пиццы — тофу с дрожжами, веганский сыр, или питательные дрожжи (дают сырный вкус)',
            'сочное мясо': 'Маринуй в кефире/йогурте 2 часа, не пережаривай, дай отдохнуть 5-10 минут после готовки',
            'хрустящая корочка': 'Обсуши продукты перед жаркой, используй панировку (сухари/мука), жарь на хорошо разогретой сковороде',
            'суп прозрачный': 'Снимай пену при варке бульона, не мешай активно, процеди через марлю, добавь яичный белок для осветления'
        };
        
        for (let key in answers) {
            if (q.includes(key)) return answers[key];
        }
        
        return `🧑‍🍳 Отличный вопрос! Мои советы для "${question}": всегда пробуй блюдо в процессе, экспериментируй со специями, и помни — лучший повар тот, кто не боится ошибаться! Если нужен конкретный рецепт или замена — спроси подробнее.`;
    }
}
