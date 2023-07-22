"use strict";

//-------------------------------------------------------------|| initialization / declaration of variables ||-------------------------
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

const state = [];
let language = "en";
let filteredTodos;

// -------------------------------------------------------|| execution of functions ||------------------------------------------

// load state
window.addEventListener("load", (event) => {
  loadStateFromApi();
  checkboxAll.checked = true;
});

// event listener for Add-todo button
buttonAddTodo.addEventListener("click", function (event) {
  const newTodo = { description: textInput.value.trim(), done: false };
  let double = false;
  // no button action if input is empty
  if (textInput.value.trim() === "") {
    return;
  } else {
    state.forEach((todo) => {
      // check for doubles
      if (
        newTodo.description.toString().toLowerCase() ===
        todo.description.toString().toLowerCase()
      ) {
        double = true;
        textInput.value = "";
      }
    });
    // post new Todo to API & state, overwrite localstorage with new state
    if (double === false) {
      fetch("http://localhost:4730/todos", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(newTodo),
      })
        .then((res) => res.json())
        .then((newTodoFromApi) => {
          state.push(newTodoFromApi);
          saveState();
          sortTodos();
          renderTodos();
        });
    }
  }
});

// render todo list according to checkbox state
checkboxContainer.addEventListener("change", function (event) {
  sortTodos();
  renderTodos();
});

// remove done todos if button is clicked
buttonRemoveTodo.addEventListener("click", function (event) {
  removeTodos();
});
//---------------------------------------------------------------|| functions for base functionality of the app ||-----------------------------------------------------

// gets resource items from API, loads items to state & local storage, sorts storage entries and renders them
function loadStateFromApi() {
  fetch("http://localhost:4730/todos")
    .then((res) => res.json())
    .then((todosArrayApi) => {
      console.log(todosArrayApi);
      todosArrayApi.forEach((todo) => {
        state.push(todo);
      });
      saveState();
      sortTodos();
      renderTodos();
    });
}

// save state to storage
function saveState() {
  const jsonState = JSON.stringify(state);
  localStorage.setItem("storageState", jsonState);
}

// sort todos according to current checkbox state
function sortTodos() {
  if (checkboxAll.checked) {
    filteredTodos = state.filter((todo) => {
      return todo.done || !todo.done;
    });
    return filteredTodos;
  }
  if (checkboxOpen.checked) {
    filteredTodos = state.filter((todo) => !todo.done);
    return filteredTodos;
  }
  if (checkboxDone.checked) {
    filteredTodos = state.filter((todo) => todo.done);
    return filteredTodos;
  }
  if (!checkboxAll.checked && !checkboxDone.checked && !checkboxOpen.checked) {
    filteredTodos = state.filter((todo) => {
      return todo.done || !todo.done;
    });

    return filteredTodos;
  }
}

// renders todos in todo list
function renderTodos() {
  // empty redered list
  todoList.innerText = "";
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

// filters todo list and removes done todos from API resource & state, saves state to local storage and renders state
function removeTodos() {
  state.forEach((todo) => {
    if (todo.done === true) {
      const todoID = todo.id;

      fetch("http://localhost:4730/todos/" + todoID, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then(() => {
          const todoIndex = state.indexOf(todo);
          state.splice(todoIndex, 1);
          saveState();
          sortTodos();
          renderTodos();
        });
    }
  });
}

// -------------------------------------------------------------|| language toggle----------------------------------------------------------

// event listener for language switch button
btnSwitchLanguage.addEventListener("click", function (event) {
  ToggleLanguageState();
  changeLanguage();
  renderTodos();
});

// set language class according to state
function setLanguageClass() {
  if (language === "de") {
    btnSwitchLanguage.classList.add("btn-language-german");
  }
}

// toggle language
function ToggleLanguageState() {
  btnSwitchLanguage.classList.toggle("btn-language-german");
  if (btnSwitchLanguage.classList.contains("btn-language-german")) {
    language = "de";
  }
  if (!btnSwitchLanguage.classList.contains("btn-language-german")) {
    language = "en";
  }
}

// change language
function changeLanguage() {
  if (language === "en") {
    language = "en";
    btnSwitchLanguage.innerText = "DE";
    buttonAddTodo.innerText = "Add Todo";
    buttonRemoveTodo.innerText = "Remove done Todos";
    labelAllTodos.innerText = "All";
    labelOpenTodos.innerText = "Open";
    labelDoneTodos.innerText = "Done";
    textInput.setAttribute("placeholder", " What needs to be done?");
  } else if (language === "de") {
    language = "de";
    btnSwitchLanguage.innerText = "EN";
    buttonAddTodo.innerText = "Neues Todo";
    buttonRemoveTodo.innerText = "Lösche erledigte Todos";
    labelAllTodos.innerText = "Alle";
    labelOpenTodos.innerText = "Offene";
    labelDoneTodos.innerText = "Erledigte";
    textInput.setAttribute("placeholder", " Was ist zu erledigen?");
  }
}
