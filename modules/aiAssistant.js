* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', sans-serif;
    transition: background 0.3s, color 0.2s;
    padding: 0 16px 32px;
}

/* ТЕМА ЗЕЛЕНАЯ (по умолчанию) */
body.theme-green {
    --primary: #2b7a3e;
    --primary-dark: #1e5a2c;
    --primary-light: #e8f3e9;
    --bg-card: #ffffff;
    --text: #1f2e1c;
    --text-secondary: #4a5b46;
    --accent-bg: #d9f0da;
    --border: #c0dfc1;
    --shadow: rgba(0,0,0,0.05);
}

/* ТЕМА ОРАНЖЕВАЯ */
body.theme-orange {
    --primary: #d97a2b;
    --primary-dark: #b85e1a;
    --primary-light: #fff0e6;
    --bg-card: #ffffff;
    --text: #3e2a1f;
    --text-secondary: #6b4c33;
    --accent-bg: #ffe1cc;
    --border: #ffccaa;
    --shadow: rgba(0,0,0,0.05);
}

body {
    background: var(--primary-light);
    color: var(--text);
}

.app-container {
    max-width: 1400px;
    margin: 0 auto;
}

/* ========== HEADER ========== */
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    background: var(--bg-card);
    padding: 16px 24px;
    border-radius: 32px;
    margin: 20px 0;
    box-shadow: 0 4px 12px var(--shadow);
    border: 1px solid var(--border);
    position: sticky;
    top: 10px;
    z-index: 100;
    backdrop-filter: blur(10px);
    background: rgba(255,255,255,0.95);
}

h1 {
    font-size: 1.5rem;
    font-weight: 600;
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}

.menu-toggle {
    display: none;
    font-size: 28px;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--primary);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    transition: background 0.2s;
}

.menu-toggle:hover {
    background: var(--primary-light);
}

.theme-switch {
    display: flex;
    gap: 8px;
}

.theme-switch button {
    background: none;
    border: 1px solid var(--border);
    padding: 6px 14px;
    border-radius: 40px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
    font-size: 14px;
}

.theme-switch button:hover {
    transform: scale(1.02);
}

.theme-switch .active {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
}

/* ========== МОБИЛЬНОЕ МЕНЮ ========== */
.mobile-nav {
    display: none;
    background: var(--bg-card);
    border-radius: 28px;
    margin-bottom: 20px;
    padding: 16px;
    border: 1px solid var(--border);
    box-shadow: 0 8px 20px var(--shadow);
}

.mobile-nav.open {
    display: block;
    animation: slideDown 0.3s ease;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.mobile-nav ul {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}

.mobile-nav hr {
    margin: 8px 0;
    border-color: var(--border);
}

.mobile-nav button {
    background: var(--primary-light);
    border: none;
    padding: 10px 18px;
    border-radius: 40px;
    font-weight: 500;
    cursor: pointer;
    color: var(--text);
    transition: all 0.2s;
    font-size: 14px;
}

.mobile-nav button:hover {
    background: var(--primary);
    color: white;
    transform: translateY(-2px);
}

.mobile-nav .ai-assist-btn {
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    color: white;
}

/* ========== ПАНЕЛЬ ФИЛЬТРОВ ========== */
.filters-panel {
    background: var(--bg-card);
    border-radius: 32px;
    padding: 24px;
    margin-bottom: 32px;
    border: 1px solid var(--border);
    box-shadow: 0 4px 12px var(--shadow);
}

h3 {
    margin-bottom: 12px;
    font-size: 1.2rem;
    color: var(--primary);
}

/* Группировка продуктов */
.ingredient-group {
    margin-bottom: 16px;
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
    background: var(--bg-card);
}

.group-header {
    background: var(--accent-bg);
    padding: 12px 16px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    font-weight: 600;
    transition: background 0.2s;
}

.group-header:hover {
    background: var(--border);
}

.group-title {
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.group-toggle {
    font-size: 12px;
    transition: transform 0.2s;
}

.group-items {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 12px;
    max-height: 300px;
    overflow-y: auto;
}

.ingredient-btn {
    background: var(--primary-light);
    border: 1px solid var(--border);
    padding: 8px 16px;
    border-radius: 40px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 13px;
    font-weight: 500;
    color: var(--text);
}

.ingredient-btn:hover {
    transform: scale(1.02);
    background: var(--accent-bg);
}

.ingredient-btn.selected {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
    box-shadow: 0 2px 8px rgba(43, 122, 62, 0.3);
}

/* Типы блюд */
.type-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin: 12px 0;
}

.type-buttons button {
    background: var(--primary-light);
    border: none;
    padding: 10px 24px;
    border-radius: 40px;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 500;
    font-size: 14px;
}

.type-buttons button:hover {
    transform: translateY(-2px);
}

.type-buttons button.active {
    background: var(--primary);
    color: white;
    box-shadow: 0 4px 12px rgba(43, 122, 62, 0.3);
}

.find-btn {
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    color: white;
    border: none;
    padding: 14px 28px;
    font-size: 18px;
    font-weight: bold;
    border-radius: 60px;
    margin-top: 16px;
    cursor: pointer;
    width: 100%;
    transition: all 0.3s;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.find-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(43, 122, 62, 0.4);
}

/* ========== РЕЗУЛЬТАТЫ ========== */
.results-area h2 {
    margin-bottom: 20px;
    font-size: 1.5rem;
}

.recipes-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
    margin-top: 16px;
}

.recipe-card {
    background: var(--bg-card);
    border-radius: 28px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.3s;
    border: 1px solid var(--border);
    box-shadow: 0 4px 12px var(--shadow);
}

.recipe-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 28px var(--shadow);
}

.recipe-img, .recipe-img-placeholder {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 20px;
    background: linear-gradient(135deg, var(--primary-light), var(--accent-bg));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 56px;
    margin-bottom: 16px;
}

.recipe-card h4 {
    font-size: 1.2rem;
    margin-bottom: 8px;
    color: var(--primary);
}

.recipe-meta {
    font-size: 12px;
    opacity: 0.7;
    margin: 8px 0;
    display: flex;
    gap: 12px;
}

.placeholder {
    text-align: center;
    padding: 60px 20px;
    opacity: 0.7;
    font-size: 1.1rem;
    background: var(--bg-card);
    border-radius: 32px;
    border: 1px dashed var(--border);
}

/* ========== МОДАЛЬНЫЕ ОКНА ========== */
.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7);
    z-index: 1000;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(4px);
}

.modal-content {
    background: var(--bg-card);
    max-width: 700px;
    width: 90%;
    border-radius: 40px;
    padding: 28px;
    max-height: 85vh;
    overflow-y: auto;
    position: relative;
    color: var(--text);
    animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

.modal-content img {
    width: 100%;
    border-radius: 24px;
    margin: 12px 0;
}

.close, .close-ai {
    position: absolute;
    right: 20px;
    top: 16px;
    font-size: 32px;
    cursor: pointer;
    transition: transform 0.2s;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: var(--primary-light);
}

.close:hover, .close-ai:hover {
    transform: rotate(90deg);
    background: var(--border);
}

.modal-content h2 {
    color: var(--primary);
    margin-bottom: 16px;
    padding-right: 40px;
}

.modal-content h3 {
    margin-top: 20px;
    margin-bottom: 12px;
    font-size: 1.2rem;
}

.modal-content ul, .modal-content ol {
    margin-left: 20px;
    margin-bottom: 16px;
}

.modal-content li {
    margin: 8px 0;
    line-height: 1.5;
}

.steps-list p {
    margin: 12px 0;
    padding-left: 20px;
    border-left: 3px solid var(--primary);
    line-height: 1.6;
}

.chef-tip {
    background: var(--primary-light);
    padding: 16px;
    border-radius: 20px;
    font-style: italic;
    margin-top: 16px;
    border-left: 4px solid var(--primary);
}

/* ========== ИИ-АССИСТЕНТ ========== */
.ai-modal textarea {
    width: 100%;
    padding: 14px;
    border-radius: 24px;
    border: 1px solid var(--border);
    margin: 16px 0;
    font-family: inherit;
    font-size: 14px;
    resize: vertical;
    background: var(--bg-card);
}

.ai-modal textarea:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px var(--primary-light);
}

#askAiBtn {
    background: var(--primary);
    color: white;
    border: none;
    padding: 12px 28px;
    border-radius: 40px;
    cursor: pointer;
    font-weight: bold;
    font-size: 16px;
    transition: all 0.2s;
}

#askAiBtn:hover {
    background: var(--primary-dark);
    transform: scale(1.02);
}

.ai-answer {
    background: var(--accent-bg);
    border-radius: 24px;
    padding: 20px;
    margin-top: 20px;
    white-space: pre-wrap;
    line-height: 1.5;
    border-left: 4px solid var(--primary);
}

/* ========== АДАПТИВ ДЛЯ МОБИЛЬНЫХ ========== */
@media (max-width: 768px) {
    body {
        padding: 0 12px 20px;
    }
    
    .menu-toggle {
        display: block;
    }
    
    .theme-switch {
        margin-top: 12px;
        width: 100%;
        justify-content: center;
    }
    
    header {
        flex-wrap: wrap;
        position: sticky;
        top: 0;
    }
    
    h1 {
        font-size: 1.2rem;
    }
    
    .group-items {
        max-height: 200px;
        overflow-y: auto;
    }
    
    .ingredient-btn {
        padding: 6px 12px;
        font-size: 12px;
    }
    
    .type-buttons button {
        padding: 8px 16px;
        font-size: 12px;
    }
    
    .recipes-list {
        grid-template-columns: 1fr;
        gap: 16px;
    }
    
    .recipe-card {
        padding: 16px;
    }
    
    .modal-content {
        padding: 20px;
        width: 95%;
    }
    
    .modal-content h2 {
        font-size: 1.3rem;
    }
}

/* ========== АНИМАЦИИ ========== */
@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}

.loading {
    animation: pulse 1s infinite;
}

/* ========== СКРОЛЛБАР ========== */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: var(--primary-light);
    border-radius: 10px;
}

::-webkit-scrollbar-thumb {
    background: var(--primary);
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--primary-dark);
}

/* ========== ДОПОЛНИТЕЛЬНЫЕ УЛУЧШЕНИЯ ========== */
hr {
    border: none;
    border-top: 1px solid var(--border);
    margin: 10px 0;
}

button {
    font-family: inherit;
}

.recipe-card small {
    display: block;
    margin-top: 10px;
    opacity: 0.8;
    font-size: 12px;
}

.recipe-card small br {
    display: none;
}
