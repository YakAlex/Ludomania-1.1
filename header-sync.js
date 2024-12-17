
// Синхронізація заголовка з балансом з сервера
(async function syncHeaderBalance() {
    const userId = 'user1'; // Унікальний ідентифікатор користувача
    const balanceElement = document.querySelector('#balance'); // Елемент з балансом у header

    // Функція для отримання балансу з сервера
    async function fetchBalance() {
        try {
            const response = await fetch(`http://localhost:3000/api/balance?userId=${userId}`);
            const data = await response.json();
            if (data.success) {
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

    // Оновлення відображення балансу
    async function updateBalanceDisplay() {
        const balance = await fetchBalance();
        balanceElement.textContent = `Баланс: ${balance.toFixed(2)}`;
    }

    // Оновлюємо баланс при завантаженні сторінки
    await updateBalanceDisplay();
})();
