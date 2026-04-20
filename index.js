let items = [
    "Сделать проектную работу",
    "Полить цветы",
    "Пройти туториал по Реакту",
    "Сделать фронт для своего проекта",
    "Прогуляться по улице в солнечный день",
    "Помыть посуду",
];

const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");

// --- Функции работы с задачами ---

/**
 * Загружает задачи из LocalStorage или возвращает дефолтный список.
 */
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : items;
}

/**
 * Сохраняет массив задач в LocalStorage.
 * @param {Array} tasks - Массив строк с задачами.
 */
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

/**
 * Собирает текущий список задач из DOM.
 * @returns {Array} Массив строк с задачами.
 */
function getTasksFromDOM() {
    const itemsNamesElements = document.querySelectorAll('.to-do__item-text');
    const tasks = [];
    itemsNamesElements.forEach(el => tasks.push(el.textContent));
    return tasks;
}

/**
 * Создает элемент задачи на основе шаблона.
 * @param {string} item - Текст задачи.
 * @returns {HTMLElement} Готовый элемент списка.
 */
function createItem(item) {
    const template = document.getElementById("to-do__item-template");
    const clone = template.content.querySelector(".to-do__item").cloneNode(true);

    const textElement = clone.querySelector(".to-do__item-text");
    const editButton = clone.querySelector(".to-do__item-button_type_edit");
    const duplicateButton = clone.querySelector(".to-do__item-button_type_duplicate");
    const deleteButton = clone.querySelector(".to-do__item-button_type_delete");

    // Установка текста задачи
    textElement.textContent = item;

    // --- Обработчики событий ---

    // Удаление задачи
    deleteButton.addEventListener('click', () => {
        clone.remove();
        saveTasks(getTasksFromDOM());
    });

    // Копирование задачи
    duplicateButton.addEventListener('click', () => {
        const newItem = createItem(textElement.textContent);
        listElement.prepend(newItem);
        saveTasks(getTasksFromDOM());
    });

    // Редактирование задачи (доп. задание)
    editButton.addEventListener('click', () => {
        textElement.setAttribute('contenteditable', 'true');
        textElement.focus();
    });

    // Сохранение изменений при потере фокуса (доп. задание)
    textElement.addEventListener('blur', () => {
        textElement.setAttribute('contenteditable', 'false');
        saveTasks(getTasksFromDOM());
    });

    return clone;
}

// --- Логика при загрузке страницы ---

// Загружаем задачи и отрисовываем их
items = loadTasks();
items.forEach(itemText => {
    const newItem = createItem(itemText);
    listElement.append(newItem);
});

// --- Логика формы ---

formElement.addEventListener('submit', (e) => {
    e.preventDefault(); // Отключаем перезагрузку страницы

    const newTaskText = inputElement.value.trim();

    if (newTaskText) {
        const newItem = createItem(newTaskText);
        listElement.prepend(newItem); // Добавляем в начало списка

        // Очистка поля и сохранение задач
        inputElement.value = '';
        saveTasks(getTasksFromDOM());
    }
});
