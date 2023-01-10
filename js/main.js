import { form, input, taskList, emptyListItem } from "./domElements.js";

let tasks = [];

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((elem) => {
    elem.done
      ? renderTaskHTML(elem, elem.text, "done")
      : renderTaskHTML(elem, elem.text);
  });
}

checkListItems();

function renderTaskHTML(newTask, inputValue, classDone = "") {
  const taskHTML = `<li id="${newTask.id}" class="tasks-list__item ${classDone}">
         <p class="list__item-text">${inputValue}</p>
        <div class="list__item-buttons">
               <button id="check-btn" class="btn">
                 <img src="/img/check.svg" alt="check-svg" />
                </button>
                <button id="delete-btn" class="btn">
               <img src="/img/delete.svg" alt="" />
              </button>
         </div>
     </li>`;
  taskList.insertAdjacentHTML("beforeend", taskHTML);
}

function addTask(e) {
  const taskText = input.value;
  e.preventDefault();
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };
  tasks.push(newTask);
  saveToLocalStorage();
  renderTaskHTML(newTask, newTask.text);
  checkListItems();
}
function clearInput() {
  input.value = "";
  input.focus();
}

function deleteTask(e) {
  const parentNode = e.target.closest(".tasks-list__item");
  if (e.target.id === "delete-btn") {
    e.target.closest("li").remove();
    tasks = tasks.filter((task) => task.id !== Number(parentNode.id));
  }
  saveToLocalStorage();
  checkListItems();
}

function doneTask(e) {
  const parentNode = e.target.closest(".tasks-list__item");
  if (e.target.id === "check-btn") {
    e.target.closest("li").classList.toggle("done");
    const task = tasks.find((task) => task.id === Number(parentNode.id));
    task.done = !task.done;
  }
  saveToLocalStorage();
}

function checkListItems() {
  if (tasks.length === 0 && taskList.childNodes.length === 0) {
    const emptyListElemHTML = `<li class="tasks-list__empty-item">
                                   <p class="list__empty-text">Список дел пуст</p>
                                  </li>`;
    taskList.insertAdjacentHTML("afterbegin", emptyListElemHTML);
  }
  if (tasks.length > 0 && taskList.childNodes.length > 0) {
    const emptyListEl = document.querySelector(".tasks-list__empty-item");
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

taskList.addEventListener("click", doneTask);
taskList.addEventListener("click", deleteTask);

form.addEventListener("submit", (e) => {
  input.value === "" ? e.preventDefault() : addTask(e);
  clearInput();
});
