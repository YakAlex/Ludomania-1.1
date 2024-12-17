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

let balance = 1000; // Локальний баланс (буде синхронізовано із сервером)
let currentCard = getRandomCard();
const userId = 'user1'; // Ідентифікатор користувача

// Отримання випадкової карти
function getRandomCard() {
    return Math.floor(Math.random() * 15) + 1; // Числа від 1 до 15
}

// Функція для отримання балансу з сервера
async function fetchBalance() {
    try {
        const response = await fetch(`http://localhost:3000/api/balance?userId=${userId}`);
        const data = await response.json();
        if (data.success) {
            balance = data.balance;
            updateDisplay();
        } else {
            console.error('Помилка отримання балансу:', data.message);
        }
    } catch (error) {
        console.error('Помилка з’єднання з сервером:', error);
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
            console.error('Помилка оновлення балансу:', data.message);
        }
    } catch (error) {
        console.error('Помилка оновлення балансу на сервері:', error);
    }
}

// Оновлення відображення балансу та поточної карти
function updateDisplay() {
    document.getElementById('balance').innerHTML = `Баланс: <span class="highlight">${balance}</span>`;
    document.getElementById('current-card').textContent = currentCard;
}

// Логіка гри
async function makeGuess(guess) {
    const nextCard = getRandomCard();
    const resultElement = document.getElementById('result');
    let resultMessage = '';

    if (nextCard === currentCard) {
        resultMessage = `Числа однакові! Наступна карта: <span class="highlight">${nextCard}</span>. Баланс не змінюється.`;
    } else if (
        (guess === 'higher' && nextCard > currentCard) ||
        (guess === 'lower' && nextCard < currentCard)
    ) {
        balance += 50;
        resultMessage = `Правильно! Наступна карта: <span class="highlight">${nextCard}</span>. Ви виграли 50!`;
    } else {
        balance -= 80;
        resultMessage = `Неправильно! Наступна карта: <span class="highlight">${nextCard}</span>. Ви програли 80.`;
    }

    currentCard = nextCard;
    resultElement.innerHTML = resultMessage;

    // Оновлюємо баланс на сервері
    await updateServerBalance(balance);
    updateDisplay();

    if (balance < 80) {
        resultElement.innerHTML = `Гру закінчено! У Вас недостатньо коштів.`;
        document.querySelector('.buttons').style.display = 'none';
    }
}

// Завантаження початкових даних
async function initializeGame() {
    await fetchBalance(); // Отримуємо баланс із сервера
    updateDisplay(); // Оновлюємо відображення
}

// Запуск гри
initializeGame();
