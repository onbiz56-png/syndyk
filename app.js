// ═══════════════════════════════════════════════
// 🎩 СУНДУК — ЦЕНТРАЛЬНЫЙ МОЗГ ПРИЛОЖЕНИЯ
// ═══════════════════════════════════════════════

// Подключаемся к Telegram Web App
const tg = window.Telegram?.WebApp;

// Объявляем глобальный объект пользователя
window.SUNDUK = {
    user: null,
    isInTelegram: false
};

// Функция инициализации приложения
function initSunduk() {
    console.log('🎩 Сундук запускается...');

    if (tg) {
        // Расширяем приложение на весь экран
        tg.expand();

        // Сообщаем Telegram что приложение готово
        tg.ready();

        // Получаем данные пользователя
        const userData = tg.initDataUnsafe?.user;

        if (userData) {
            window.SUNDUK.isInTelegram = true;
            window.SUNDUK.user = {
                id: userData.id,
                firstName: userData.first_name || 'Друг',
                lastName: userData.last_name || '',
                username: userData.username || '',
                photoUrl: userData.photo_url || '',
                languageCode: userData.language_code || 'ru'
            };

            console.log('✅ Пользователь распознан:', window.SUNDUK.user.firstName);
        } else {
            console.log('⚠️ Данные пользователя не получены, используем тестовые');
            setTestUser();
        }
    } else {
        console.log('⚠️ Не в Telegram, используем тестовые данные');
        setTestUser();
    }

    // Обновляем интерфейс
    updateUI();
}

// Тестовые данные (когда открываем не из Telegram)
function setTestUser() {
    window.SUNDUK.user = {
        id: 0,
        firstName: 'Гость',
        lastName: '',
        username: '',
        photoUrl: '',
        languageCode: 'ru'
    };
}

// Функция определения времени суток
function getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Доброе утро';
    if (hour >= 12 && hour < 17) return 'Добрый день';
    if (hour >= 17 && hour < 23) return 'Добрый вечер';
    return 'Доброй ночи';
}

// Обновление элементов интерфейса
function updateUI() {
    const user = window.SUNDUK.user;
    if (!user) return;

    // Обновляем приветствие
    const greetingElement = document.querySelector('[data-sunduk="greeting"]');
    if (greetingElement) {
        greetingElement.textContent = getGreeting();
    }

    // Обновляем имя пользователя
    const nameElements = document.querySelectorAll('[data-sunduk="userName"]');
    nameElements.forEach(el => {
        el.textContent = user.firstName + '!';
    });

    // Обновляем аватарку (если есть)
    const avatarElements = document.querySelectorAll('[data-sunduk="userAvatar"]');
    avatarElements.forEach(el => {
        if (user.photoUrl) {
            el.src = user.photoUrl;
            el.style.display = 'block';
        }
    });

    console.log('🎨 Интерфейс обновлён для:', user.firstName);
}

// Сохранение данных в localStorage
window.SUNDUK.save = function(key, value) {
    try {
        localStorage.setItem('sunduk_' + key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.error('Ошибка сохранения:', e);
        return false;
    }
};

// Загрузка данных из localStorage
window.SUNDUK.load = function(key, defaultValue = null) {
    try {
        const data = localStorage.getItem('sunduk_' + key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
        console.error('Ошибка загрузки:', e);
        return defaultValue;
    }
};

// Переход между экранами
window.SUNDUK.goTo = function(page) {
    window.location.href = page;
};

// Запускаем когда страница загрузилась
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSunduk);
} else {
    initSunduk();
}