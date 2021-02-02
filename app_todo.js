const todoList = document.querySelector("#incomplete-tasks");
const completedList = document.querySelector("#completed-tasks");
const lists = document.querySelectorAll("ul");
const btnAdd = document.querySelector("#btn-add");
const inputNewTask = document.querySelector("#new-task");
let template = document.querySelector("#template").innerText;

btnAdd.addEventListener("click", newTask);
lists.forEach((e) => e.addEventListener("click", updateTask));

var tasks = getFromLocalStorage() || [];

if (tasks.length > 0) renderUI(tasks);

function renderUI() {
  completedList.innerHTML = "";
  todoList.innerHTML = "";
  tasks.forEach((e) => {
    let status = e.isComplete;
    console.log(e);
    let html = Mustache.render(template, e);
    if (status) completedList.innerHTML += html;
    else todoList.innerHTML += html;
  });
}

function getFromLocalStorage() {
  let tasks = localStorage.getItem("tasks");
  if (tasks) {
    return (tasks = JSON.parse(tasks));
  }
}

//focus on input default
inputNewTask.focus();

function newTask() {
  let value = inputNewTask.value;
  if (value != "") {
    const task = {
      id: new Date().getTime(),
      todo: inputNewTask.value,
      isComplete: false,
    };
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    inputNewTask.value = "";
    renderUI();
  } else {
    alert("Add something please..!");
  }
}

function updateTask(e) {
  let action = e.target.getAttribute("class") || "";
  let taskItem = e.target.parentNode;
  if (e.target.type == "checkbox") {
    changeStatus(taskItem);
    renderUI();
  } else if (action == "edit") {
    editTask(taskItem);
  } else if (action == "delete") {
    deleteTask(taskItem);
    renderUI();
  }
}

function changeStatus(item) {
  let index = getIndex(item);
  tasks[index].isComplete = !tasks[index].isComplete;
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTask(item) {
  let index = getIndex(item);
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function editTask(item) {
  let index = getIndex(item),
    btnEdit = item.querySelector("button[class='edit']"),
    input = item.querySelector('input[type="text"]'),
    label = item.querySelector("label");

  btnEdit.innerText == "Edit"
    ? (btnEdit.innerText = "Save")
    : (btnEdit.innerText = "Edit");

  if (item.classList.contains("editMode")) {
    label.innerText = input.value;
    tasks[index].todo = input.value;
  } else {
    input.value = label.innerText;
  }
  item.classList.toggle("editMode");
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getIndex(item) {
  let tId = item.getAttribute("id");
  let tIndex = tasks.findIndex((task) => task.id == tId);
  return tIndex;
}
