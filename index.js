const express = require('express');
const cors = require('cors');

// Імітуємо базу даних у пам'яті
const users = {
    user1: { balance: 1000 }, // Початковий баланс користувача
};

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Для обробки JSON у запитах

// Ендпоінт для отримання балансу
app.get('/api/balance', (req, res) => {
    const { userId } = req.query; // userId передається як параметр
    if (!users[userId]) {
        return res.status(404).json({ success: false, message: 'Користувач не знайдений' });
    }
    res.json({ success: true, balance: users[userId].balance });
});

// Ендпоінт для оновлення балансу
app.post('/api/balance', (req, res) => {
    const { userId, amount } = req.body; // userId і новий баланс передаються у тілі запиту
    if (!users[userId]) {
        return res.status(404).json({ success: false, message: 'Користувач не знайдений' });
    }
    users[userId].balance = amount;
    res.json({ success: true });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущено на http://localhost:${PORT}`);
});
