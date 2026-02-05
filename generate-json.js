const fs = require('fs');

const categories = ['SystemD', 'Docker', 'Логи', 'Сеть', 'Безопасность', 'Файлы', 'Пользователи', 'Процессы'];
const commands = [];

for (let i = 1; i <= 200; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    commands.push({
        id: i,
        command: `command${i}`,
        category: category,
        description: `Подробное описание команды ${i} для администратора системы. Эта команда выполняет важные функции управления.`,
        usage: `sudo command${i} [OPTIONS]`,
        parameters: [
            { name: '-h, --help', description: 'Показать справку по команде' },
            { name: '-v, --version', description: 'Показать версию утилиты' }
        ],
        examples: [
            `sudo command${i} --help`,
            `command${i} -v`
        ]
    });
}

fs.writeFileSync('1.json', JSON.stringify(commands, null, 2));
console.log('Файл 1.json создан с 200 командами');