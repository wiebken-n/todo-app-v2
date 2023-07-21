const textInput = document.querySelector(".text-todo-input");
const buttonAddTodo = document.querySelector(".button-add-todo");
const buttonRemoveTodo = document.querySelector(".button-remove-done-todos");
const checkboxContainer = document.querySelector(".todo-selection-container");
const checkboxAll = document.querySelector(".check-all-todos");
const checkboxOpen = document.querySelector(".check-open-todos");
const checkboxDone = document.querySelector(".check-done-todos");
const todoList = document.querySelector(".todo-list");
const btnSwitchLanguage = document.querySelector(".btn-switch-language");
const labelAllTodos = document.querySelector(".label-all-todos");
const labelOpenTodos = document.querySelector(".label-open-todos");
const labelDoneTodos = document.querySelector(".label-done-todos");

const state = {};
let filteredTodos;

// ----------------------------------------------

// load state
window.addEventListener("load", (event) => {
  loadState();
  renderTodos();
});

// event listener for Add-todo button
buttonAddTodo.addEventListener("click", function (event) {
  // no button action if input is empty
  if (textInput.value.trim() === "") {
    return;
  }
  // check if todo of that description already exists - if yes, no action & empty input field
  for (let i = 0; i < state.todos.length; i++) {
    if (
      state.todos[i].description.toLowerCase() === textInput.value.toLowerCase()
    ) {
      textInput.value = "";
      return;
    }
  }

  saveTodo();
  sortTodos();
  saveState();
  renderTodos();
});

// render todo list according to checkbox state
checkboxContainer.addEventListener("change", function (event) {
  sortTodos();
  renderTodos();
});

// remove done todos if button is clicked
buttonRemoveTodo.addEventListener("click", function (event) {
  removeTodos();
  sortTodos();
  saveState();
  renderTodos();
});

//-------------------------------------------------------

function renderTodos() {
  // empty redered list

  todoList.innerText = "";
  sortTodos();
  // render todo list
  filteredTodos.forEach((todo) => {
    // create new li with checkbox & description
    const newTodoLi = document.createElement("li");
    const newCheckbox = document.createElement("input");
    const newLabel = document.createElement("label");
    const newTodoText = document.createTextNode(todo.description);
    newLabel.setAttribute("for", todo.description);
    newCheckbox.setAttribute("id", todo.description);

    // render checkbox state
    newCheckbox.type = "checkbox";
    newCheckbox.checked = todo.done;
    if (todo.done === true) {
      newTodoLi.classList.toggle("done-todo");
    }

    // add event listener to checkbox
    newCheckbox.addEventListener("change", function (event) {
      // save todo as done if box is checked
      todo.done = event.target.checked;
      // add strike-through-text class for (un)done todo
      newTodoLi.classList.toggle("done-todo");
      saveState();
    });

    // assign description of todo as name to li element
    newCheckbox.name = todo.description;
    // attach new li to todo-ul
    newTodoLi.append(newCheckbox, newLabel);
    newLabel.appendChild(newTodoText);
    todoList.appendChild(newTodoLi);
  });
  // empty text input
  textInput.value = "";
}

function saveTodo() {
  // initialize variable with text input
  const newTodo = textInput.value.trim();
  // initialize variable with current global ID
  const newTodoID = state.ID;
  // increment global ID
  state.ID++;
  // push todo description, undone state & ID to state object
  state.todos.push({ description: newTodo, done: false, ID: newTodoID });
}

// filter todo list and return undone todos
function removeTodos() {
  for (let i = 0; i < state.todos.length; i++) {
    if (state.todos[i].done === true) {
      state.todos.splice(i, 1);
      i--;
    }
  }
}

// sort todos according to current checkbox state
function sortTodos() {
  if (checkboxAll.checked) {
    filteredTodos = state.todos.filter((todo) => {
      return todo.done || !todo.done;
    });
    return filteredTodos;
  }
  if (checkboxOpen.checked) {
    filteredTodos = state.todos.filter((todo) => !todo.done);
    return filteredTodos;
  }
  if (checkboxDone.checked) {
    filteredTodos = state.todos.filter((todo) => todo.done);
    return filteredTodos;
  }
  if (!checkboxAll.checked && !checkboxDone.checked && !checkboxOpen.checked) {
    filteredTodos = state.todos.filter((todo) => {
      return todo.done || !todo.done;
    });

    return filteredTodos;
  }
}

// load state from storage - if none present, initialize default state
function loadState() {
  if (localStorage.getItem("storageState") === null) {
    const defaultState = {
      todos: [{ description: "Add Todo", done: false, ID: 1 }],
    };
    Object.assign(state, defaultState);
    checkboxAll.checked = true;
  }
  const loadStorage = JSON.parse(localStorage.getItem("storageState"));
  Object.assign(state, loadStorage);
  checkboxAll.checked = true;
}

// save state to storage
function saveState() {
  const jsonState = JSON.stringify(state);
  localStorage.setItem("storageState", jsonState);
}

// -------------------------------- language toggle function --- not maintenanced for now -----------------------
/*


// event listener for language switch button
btnSwitchLanguage.addEventListener("click", function (event) {
  ToggleLanguageState();
  changeLanguage();
  loadDummyTodo();
  renderTodos();
});




// set language class according to state
function setLanguageClass() {
  if (state.language === "de") {
    btnSwitchLanguage.classList.add("btn-language-german");
  }
}


// toggle language
function ToggleLanguageState() {
  btnSwitchLanguage.classList.toggle("btn-language-german");
  if (btnSwitchLanguage.classList.contains("btn-language-german")) {
    state.language = "de";
  }
  if (!btnSwitchLanguage.classList.contains("btn-language-german")) {
    state.language = "en";
  }
  saveState();
}


// change language
function changeLanguage() {
  if (state.language === "en") {
    state.language = "en";
    btnSwitchLanguage.innerText = "DE";
    buttonAddTodo.innerText = "Add Todo";
    buttonRemoveTodo.innerText = "Remove done Todos";
    labelAllTodos.innerText = "All";
    labelOpenTodos.innerText = "Open";
    labelDoneTodos.innerText = "Done";
    textInput.setAttribute("placeholder", " What needs to be done?");
  } else if (state.language === "de") {
    state.language = "de";
    btnSwitchLanguage.innerText = "EN";
    buttonAddTodo.innerText = "Neues Todo";
    buttonRemoveTodo.innerText = "Lösche erledigte Todos";
    labelAllTodos.innerText = "Alle";
    labelOpenTodos.innerText = "Offene";
    labelDoneTodos.innerText = "Erledigte";
    textInput.setAttribute("placeholder", " Was ist zu erledigen?");
  }
}



// set language of default todo
function loadDummyTodo() {
  if (state.todos[0].ID === 1 && state.language === "de") {
    state.todos[0].description = "Füge Todos hinzu";
  }
  if (state.todos[0].ID === 1 && state.language === "en") {
    state.todos[0].description = "Add Todos";
  }
  saveState();
}
*/
