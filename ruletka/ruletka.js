const btn_promo = document.getElementById('btn-promo');
const promo = document.getElementById('promo');
document.addEventListener('click', function (e) {
    if (!promo.contains(e.target) && !btn_promo.contains(e.target)) {
        promo.classList.remove('active');
    }
});


btn_promo.addEventListener('click', function (e)  {
    e.preventDefault();
    if (promo.classList.contains('active')) {
        promo.classList.remove('active');

        // Затримка перед встановленням display: none
        setTimeout(() => {
            promo.style.display = 'none';
        }, 500); // Час повинен відповідати тривалості анімації
    } else {
        promo.style.display = 'flex'; // Встановлюємо display: flex
        setTimeout(() => {
            promo.classList.add('active'); // Додаємо клас після короткої затримки
        }, 10); // Невелика затримка для активації transition
    }
});


document.addEventListener('DOMContentLoaded', async function () {
    const userId = 'user1'; // Ідентифікатор користувача
    const spinCost = 10;    // Вартість одного прокруту
    const winReward = 500;  // Винагорода за виграш

    const balanceElement = document.querySelector('#balance');
    const resultElement = document.querySelector('#result');

    // Функція для отримання балансу з сервера
    async function fetchBalance() {
        const response = await fetch(`http://localhost:3000/api/balance?userId=${userId}`);
        const data = await response.json();
        if (data.success) {
            return data.balance;
        } else {
            throw new Error('Помилка отримання балансу');
        }
    }

    // Функція для оновлення балансу на сервері
    async function updateBalance(newBalance) {
        const response = await fetch('http://localhost:3000/api/balance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, amount: newBalance }),
        });
        const data = await response.json();
        if (!data.success) throw new Error('Помилка оновлення балансу');
    }

    // Функція оновлення відображення балансу
    async function updateBalanceDisplay() {
        const balance = await fetchBalance();
        balanceElement.textContent = `Баланс: ${balance.toFixed(2)}`;
    }

    // Функція для обертання слотів
    async function spinSlots() {
        const slot1 = document.getElementById('slot1');
        const slot2 = document.getElementById('slot2');
        const slot3 = document.getElementById('slot3');

        let balance = await fetchBalance();

        // Перевірка балансу
        if (balance < spinCost) {
            resultElement.textContent = 'Недостатньо коштів для гри!';
            return;
        }

        // Оновлення балансу
        balance -= spinCost;
        await updateBalance(balance);

        // Генеруємо випадкові символи
        const symbols = ['🍒', '🍋', '🍉', '🍊', '🍓', '🍍', '💎'];
        const getRandomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];

        const symbol1 = getRandomSymbol();
        const symbol2 = getRandomSymbol();
        const symbol3 = getRandomSymbol();

        slot1.textContent = symbol1;
        slot2.textContent = symbol2;
        slot3.textContent = symbol3;

        // Перевірка виграшу
        if (symbol1 === symbol2 && symbol2 === symbol3) {
            resultElement.textContent = 'Виграш! 🎉';
            balance += winReward;
            await updateBalance(balance);
        } else {
            resultElement.textContent = 'Спробуйте ще раз!';
        }

        await updateBalanceDisplay();
    }

    // Прив’язка кнопки до функції
    document.getElementById('spinBtn').addEventListener('click', spinSlots);

    // Ініціалізація балансу
    await updateBalanceDisplay();
});

