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


document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const balanceDisplay = document.getElementById('balance'); // Баланс у header
    const userId = 'user1'; // Ідентифікатор користувача
    let outcomes = [];

    // Функція для отримання балансу з сервера
    async function fetchBalance() {
        try {
            const response = await fetch(`http://localhost:3000/api/balance?userId=${userId}`);
            const data = await response.json();
            if (data.success) {
                updateBalanceDisplay(data.balance);
                return data.balance;
            } else {
                console.error('Помилка отримання балансу:', data.message);
                return 0;
            }
        } catch (error) {
            console.error('Помилка з’єднання з сервером:', error);
            return 0;
        }
    }

    // Функція для оновлення балансу на сервері
    async function updateServerBalance(newBalance) {
        try {
            const response = await fetch('http://localhost:3000/api/balance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, amount: newBalance }),
            });
            const data = await response.json();
            if (!data.success) {
                throw new Error('Помилка оновлення балансу');
            }
        } catch (error) {
            console.error('Помилка оновлення балансу на сервері:', error);
        }
    }

    // Функція для оновлення балансу в UI
    function updateBalanceDisplay(amount) {
        balanceDisplay.textContent = `Баланс: ${amount}`;
    }

    // Генеруємо випадкові виграші та програші
    function generateOutcomes() {
        outcomes = Array.from({ length: 20 }, () => (Math.random() > 0.6 ? 'win' : 'lose'));
    }

    // Оновлення балансу (зміна локально та на сервері)
    async function updateBalance(amount) {
        const currentBalance = await fetchBalance();
        const newBalance = currentBalance + amount;
        await updateServerBalance(newBalance);
        updateBalanceDisplay(newBalance);
    }

    // Обробка кліку на коробку
    async function handleBoxClick(event) {
        const box = event.target;

        if (box.classList.contains('flipped')) return; // Не даємо перевертати вдруге

        box.classList.add('flipped');
        const index = Array.from(gameBoard.children).indexOf(box);
        const outcome = outcomes[index];

        if (outcome === 'win') {
            box.textContent = '+30';
            box.classList.add('win');
            await updateBalance(30);
        } else {
            box.textContent = '-10';
            box.classList.add('lose');
            await updateBalance(-10);
        }
    }

    // Створюємо коробки
    function createBoxes() {
        gameBoard.innerHTML = ''; // Очищаємо поле
        for (let i = 0; i < 20; i++) {
            const box = document.createElement('div');
            box.className = 'box';
            box.textContent = ''; // Порожній текст
            box.classList.remove('flipped', 'win', 'lose');
            box.addEventListener('click', handleBoxClick);
            gameBoard.appendChild(box);
        }
    }

    // Обробка кнопки оновлення
    const refreshButton = document.createElement('button');
    refreshButton.textContent = 'Розпочати заново';
    refreshButton.className = 'refresh-button';
    refreshButton.addEventListener('click', () => {
        generateOutcomes();
        createBoxes();
    });

    // Ініціалізація гри
    async function initializeGame() {
        const initialBalance = await fetchBalance(); // Отримуємо початковий баланс
        updateBalanceDisplay(initialBalance); // Оновлюємо відображення балансу
        generateOutcomes();
        createBoxes();
        document.querySelector('.container').appendChild(refreshButton);
    }

    initializeGame(); // Запускаємо ініціалізацію гри
});

