document.addEventListener('DOMContentLoaded', function() {
    const accordionContainer = document.getElementById('accordionContainer');
    const searchInput = document.getElementById('searchInput');
    const visibleCount = document.getElementById('visibleCount');
    const totalCount = document.getElementById('totalCount');
    const currentDate = document.getElementById('currentDate');
    
    let commands = [];
    let filteredCommands = [];
    
    // Устанавливаем текущую дату
    currentDate.textContent = new Date().toLocaleDateString('ru-RU');
    
    // Загружаем JSON данные
    fetch('1.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка загрузки JSON файла');
            }
            return response.json();
        })
        .then(data => {
            commands = data;
            filteredCommands = [...commands];
            totalCount.textContent = commands.length;
            renderAccordion();
        })
        .catch(error => {
            console.error('Error:', error);
            accordionContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Ошибка загрузки данных. Проверьте наличие файла 1.json</p>
                </div>
            `;
        });
    
    // Функция для создания HTML аккордеона
    function renderAccordion() {
        if (filteredCommands.length === 0) {
            accordionContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>Команды не найдены. Попробуйте изменить поисковый запрос.</p>
                </div>
            `;
            visibleCount.textContent = '0';
            return;
        }
        
        accordionContainer.innerHTML = '';
        visibleCount.textContent = filteredCommands.length;
        
        filteredCommands.forEach((command, index) => {
            const item = document.createElement('div');
            item.className = 'accordion-item';
            item.innerHTML = `
                <div class="accordion-header" onclick="toggleAccordion(${index})">
                    <div class="command-title">
                        <i class="fas fa-terminal command-icon"></i>
                        <span class="command-name">${command.command}</span>
                        <span class="command-category">${command.category}</span>
                    </div>
                    <i class="fas fa-chevron-down accordion-toggle" id="toggle-${index}"></i>
                </div>
                <div class="accordion-content" id="content-${index}">
                    <div class="accordion-content-inner">
                        <div class="description">
                            ${command.description}
                        </div>
                        ${command.usage ? `
                        <div class="usage">
                            <h4><i class="fas fa-code"></i> Использование:</h4>
                            <pre>${command.usage}</pre>
                        </div>` : ''}
                        ${command.parameters && command.parameters.length > 0 ? `
                        <div class="parameters">
                            <h4><i class="fas fa-cogs"></i> Параметры:</h4>
                            <ul class="param-list">
                                ${command.parameters.map(param => `
                                    <li><span class="param-name">${param.name}</span>: ${param.description}</li>
                                `).join('')}
                            </ul>
                        </div>` : ''}
                        ${command.examples && command.examples.length > 0 ? `
                        <div class="examples">
                            <h4><i class="fas fa-lightbulb"></i> Примеры:</h4>
                            ${command.examples.map(example => `
                                <div class="example-block">
                                    <pre>${example}</pre>
                                </div>
                            `).join('')}
                        </div>` : ''}
                    </div>
                </div>
            `;
            accordionContainer.appendChild(item);
        });
    }
    
    // Функция для переключения аккордеона (добавляем в глобальную область видимости)
    window.toggleAccordion = function(index) {
        const content = document.getElementById(`content-${index}`);
        const toggle = document.getElementById(`toggle-${index}`);
        
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
            toggle.classList.remove('rotated');
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
            toggle.classList.add('rotated');
        }
    };
    
    // Функция для поиска команд
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            filteredCommands = [...commands];
        } else {
            filteredCommands = commands.filter(command => 
                command.command.toLowerCase().includes(searchTerm) ||
                command.description.toLowerCase().includes(searchTerm) ||
                (command.parameters && command.parameters.some(p => 
                    p.name.toLowerCase().includes(searchTerm) ||
                    p.description.toLowerCase().includes(searchTerm)
                )) ||
                (command.category && command.category.toLowerCase().includes(searchTerm))
            );
        }
        
        renderAccordion();
        
        // Закрываем все открытые аккордеоны после поиска
        document.querySelectorAll('.accordion-content').forEach(content => {
            content.style.maxHeight = null;
        });
        document.querySelectorAll('.accordion-toggle').forEach(toggle => {
            toggle.classList.remove('rotated');
        });
    });
    
    // Добавляем поддержку горячих клавиш
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            searchInput.focus();
        }
    });
});