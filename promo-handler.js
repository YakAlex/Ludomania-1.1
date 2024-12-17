(async function handlePromoCode() {
    const promoInput = document.querySelector('#promoInput'); // Поле вводу промокоду
    const promoButton = document.querySelector('#promoButton'); // Кнопка використання промокоду
    const userId = 'user1'; // Ідентифікатор користувача

    // Обробник натискання кнопки
    promoButton.addEventListener('click', async () => {
        const promoCode = promoInput.value.trim(); // Отримуємо і очищаємо введене значення

        if (promoCode === '#Ludomania') {
            try {
                // 1. Отримуємо поточний баланс
                const response = await fetch(`http://localhost:3000/api/balance?userId=${userId}`);
                const data = await response.json();

                if (data.success) {
                    const currentBalance = data.balance;
                    const newBalance = currentBalance + 1000; // Додаємо 1000 до балансу

                    // 2. Відправляємо оновлений баланс на сервер
                    const updateResponse = await fetch('http://localhost:3000/api/balance', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userId, amount: newBalance }),
                    });

                    const updateData = await updateResponse.json();

                    if (updateData.success) {
                        alert('Промокод застосовано! Ваш баланс поповнено на 1000.');
                        promoInput.value = ''; // Очищаємо поле вводу

                        // Оновлюємо баланс на сторінці
                        const balanceElement = document.querySelector('#balance');
                        balanceElement.textContent = `Баланс: ${newBalance.toFixed(2)}`;
                    } else {
                        alert('Помилка при оновленні балансу.');
                    }
                } else {
                    alert('Помилка отримання балансу.');
                }
            } catch (error) {
                console.error('Помилка:', error);
                alert('Сталася помилка. Спробуйте ще раз.');
            }
        } else {
            alert('Невірний промокод. Спробуйте ще раз.');
        }
    });
})();
