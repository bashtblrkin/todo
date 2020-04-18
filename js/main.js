const form = document.querySelector("#newTaskForm");
const tasksList = document.querySelector("#list-group");
const input = document.querySelector("#addNewTask");

//Прослушиваем submit у формы
form.addEventListener("submit", function (e) {
    //убираем событие, которое должно происходить по клику отправки формы
    e.preventDefault();

    //Берём значение инпута где id=addNewTask
    const taskText = input.value.trim();

    const taskHTML = `
    <li class="list-group-item d-flex justify-content-between"><span contenteditable="true" class="task-title">${taskText}</span>
        <div>
            <button type="button" data-action="ready" class="btn btn-light align-self-end">Готово</button>
            <button type="button" data-action="delete-task" class="btn btn-light align-self-end">Удалить</button>
        </div>
    </li>`;

    //Вставляем код html с необходимым значением вначале после тега list-group
    tasksList.insertAdjacentHTML("afterbegin", taskHTML);

    //очищаем поле добавления новой задачи
    input.value = "";

    //возвращаем фокус на поле ввода
    input.focus();

    //Скрываем или показываем запись о том, что список дел пуст
    toggleEmptyListItem();

    //Показать всплывающее пояснение
    showNotification("new");
});

//Прослушиваем клик внутри всего списка задач
tasksList.addEventListener("click", function (event) {
    console.log(event.target);

    //Првоеряем, что клик произошёл по кнопке удалить
    if (event.target.getAttribute("data-action") == "delete-task") {
        //Находим родительский тег <li> и удаляём его
        event.target.closest(".list-group-item").remove();

        //Скрываем или показываем запись о том, что список дел пуст
        toggleEmptyListItem();

        //Показать всплывающее пояснение
        showNotification("delete");
    } else if (event.target.getAttribute("data-action") == "ready") {

        //Находим родительский li
        const element = event.target.closest(".list-group-item");

        //Добавляем к тегу span дополнительный класс
        element.querySelector(".task-title").classList.add("task-title--done");

        //Убираем у тега span атрибут contenteditable
        element.querySelector(".task-title").setAttribute("contenteditable", "false");

        //Удаляем кнопку готово
        event.target.remove();

        //Перемещаем запись в конец списка
        tasksList.insertAdjacentElement("beforeend", element);
        showNotification("completed");
    }
});

function toggleEmptyListItem() {
    if (tasksList.children.length > 1) {
        document.querySelector("#empty-list-item").style.display = "none";
    } else {
        document.querySelector("#empty-list-item").style.display = "block";
    }
}

function showNotification(type) {
    let notifyElement;

    switch (type) {
        case "new":
            notifyElement = document.createElement("div");
            notifyElement.className = "alert alert-warning";
            notifyElement.textContent = "Задача добавлена!";
            break;
        case "delete":
            notifyElement = document.createElement("div");
            notifyElement.className = "alert alert-danger";
            notifyElement.textContent = "Задача Удалена!";
            break;
        case "completed":
            notifyElement = document.createElement("div");
            notifyElement.className = "alert alert-success";
            notifyElement.textContent = "Задача выполнена!";
            break;
    }

    let notifyHolder = document.querySelector("#notifyHolder");

    if (notifyHolder.childElementCount > 0) {
        while (notifyHolder.firstChild) {
            notifyHolder.removeChild(notifyHolder.firstChild);
        }
        notifyHolder.insertAdjacentElement("afterbegin", notifyElement);
    } else {
        notifyHolder.insertAdjacentElement("afterbegin", notifyElement);
    }

    setTimeout(function () {
        notifyElement.style.opacity = "1";
    }, 300);

    setTimeout(function () {
        notifyElement.style.opacity = "0";
    }, 2300);

    setTimeout(function () {
        notifyElement.remove();
    }, 2600);
}
