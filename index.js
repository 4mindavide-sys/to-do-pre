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

function loadTasks() {
  const savedTasks = localStorage.getItem("todoTasks");
  
  if (savedTasks) {
    return JSON.parse(savedTasks);
  } else {
    return items;
  }
}

function createItem(item) {
  const template = document.getElementById("to-do__item-template");
  const clone = template.content.querySelector(".to-do__item").cloneNode(true);
  const textElement = clone.querySelector(".to-do__item-text");
  const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
  const duplicateButton = clone.querySelector(".to-do__item-button_type_duplicate");
  const editButton = clone.querySelector(".to-do__item-button_type_edit");

  // Устанавливаем текст задачи
  textElement.textContent = item;

  // Обработчик для кнопки удаления
  deleteButton.addEventListener("click", () => {
    clone.remove();
    items = getTasksFromDOM();
    saveTasks(items);
  });

  // Обработчик для кнопки копирования
  duplicateButton.addEventListener("click", () => {
    const itemName = textElement.textContent;
    const newItem = createItem(itemName);
    listElement.prepend(newItem);
    items = getTasksFromDOM();
    saveTasks(items);
  });

  // Обработчик для кнопки редактирования
  editButton.addEventListener("click", () => {
    textElement.setAttribute("contenteditable", "true");
    textElement.focus();
  });

  // Обработчик для сохранения изменений после редактирования
  textElement.addEventListener("blur", () => {
    textElement.setAttribute("contenteditable", "false");
    items = getTasksFromDOM();
    saveTasks(items);
  });

  return clone;
}

function getTasksFromDOM() {
  // Находим все элементы с текстом задач
  const itemsNamesElements = document.querySelectorAll(".to-do__item-text");
  
  // Создаем массив для хранения задач
  const tasks = [];
  
  // Проходим по всем элементам и собираем текст задач
  itemsNamesElements.forEach(element => {
    tasks.push(element.textContent);
  });
  
  return tasks;
}

function saveTasks(tasks) {
  // Сохраняем задачи в localStorage
  localStorage.setItem("todoTasks", JSON.stringify(tasks));
}

// Инициализация приложения при загрузке
// Загружаем задачи
items = loadTasks();

// Отображаем все задачи
items.forEach(item => {
  const newItem = createItem(item);
  listElement.append(newItem);
});

// Обработчик для формы добавления новой задачи
formElement.addEventListener("submit", (event) => {
  event.preventDefault();
  
  // Получаем текст из поля ввода
  const taskText = inputElement.value.trim();
  
  // Проверяем, что поле не пустое
  if (taskText) {
    // Создаем новый элемент
    const newItem = createItem(taskText);
    
    // Добавляем его в начало списка
    listElement.prepend(newItem);
    
    // Обновляем и сохраняем задачи
    items = getTasksFromDOM();
    saveTasks(items);
    
    // Очищаем поле ввода
    inputElement.value = "";
  }
});