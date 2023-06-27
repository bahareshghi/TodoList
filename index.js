const addTodoBtn = document.querySelector('.add-todo__btn');
const addTodoInput = document.querySelector('.add-todo__input');
const todosContainer = document.querySelector('.container__todos');
const sortTodosContainer = document.querySelector('.sort-todos');
const filterTodosContainer = document.querySelector('.filter-todos');
const searchTodosContainer = document.querySelector('.search-container__input');
const todosNumber = document.querySelector('.todos-number');

addTodoBtn.addEventListener('click', addTodo);
addTodoInput.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    addTodo();
  }
});
sortTodosContainer.addEventListener('change', (e) => sortTodos(e.target));
filterTodosContainer.addEventListener('change', (e) => filterTodos(e.target));
searchTodosContainer.addEventListener('input', (e) => searchTodos(e.target));

document.addEventListener('DOMContentLoaded', createTodos(getTodos()));
document.addEventListener('DOMContentLoaded', () => {
  filterTodosContainer.value = 'all';
  sortTodosContainer.value = 'oldest';
  searchTodosContainer.value = '';
  todosNumber.textContent = getTodos().length;
});

// -------------------------------------------------Add Todo------------------------------------------------- //
function addTodo() {
  const todoTitle = addTodoInput.value;
  const id = new Date().getTime();

  // Update LocalStorage
  let todos = getTodos();
  todos = [
    ...todos,
    {
      title: todoTitle,
      completed: false,
      id,
    },
  ];
  saveTodos(todos);
  // Create Todos
  createTodos(todos);
  // Update DOM
  addTodoInput.value = '';
  sortTodos(sortTodosContainer);
}

// -------------------------------------------------Create Todos------------------------------------------------- //
function createTodos(todos) {
  todosContainer.innerHTML = '';
  todos.forEach((todo) => {
    const todoContainer = document.createElement('li');
    todoContainer.classList.add('todo');
    if (todo.completed === true) {
      todoContainer.innerHTML = `
                <input class="todo__title" type="text" value=${todo.title} data-id ='${todo.id}'></input>
                <span class="todo__actions">
                    <i class="fa-regular fa-square-check" data-id ='${todo.id}'></i>
                    <i class="fa-solid fa-trash-can trash" data-id ='${todo.id}'></i>
                </span>
             `;
    } else {
      todoContainer.innerHTML = `
                <input class="todo__title" type="text" value=${todo.title} data-id ='${todo.id}'></input>
                <span class="todo__actions">
                    <i class="fa-regular fa-square" data-id ='${todo.id}'></i>
                    <i class="fa-solid fa-trash-can trash" data-id ='${todo.id}'></i>
                </span>
   `;
    }
    // Update DOM
    todosContainer.append(todoContainer);
  });

  const todosActions = document.querySelectorAll('.todo__actions');
  todosActions.forEach((actions) => {
    actions.addEventListener('click', (e) => todoActions(e.target));
  });
  const todosTitle = document.querySelectorAll('.todo__title');
  todosTitle.forEach((title) => {
    title.addEventListener('input', (e) => todoActions(e.target));
  });

  // Update DOM
  todosNumber.textContent = getTodos().length;
}

// -------------------------------------------------Add Actions To Todos------------------------------------------------- //
function todoActions(item) {
  const type = item.classList;
  const todos = getTodos();
  const changedTodo = todos.find((todo) => todo.id == item.dataset.id);

  if (type.contains('fa-square')) {
    item.classList.remove('fa-square');
    item.classList.add('fa-square-check');
    changedTodo.completed = true;
    // Update LocalStorage
    saveTodos(todos);
  } else if (type.contains('fa-square-check')) {
    item.classList.add('fa-square');
    item.classList.remove('fa-square-check');
    changedTodo.completed = false;
    // Update LocalStorage
    saveTodos(todos);
  } else if (type.contains('fa-trash-can')) {
    const filteredTodos = todos.filter((todo) => todo.id != changedTodo.id);
    // Update LocalStorage
    saveTodos(filteredTodos);
    // Update DOM
    createTodos(filteredTodos);
  } else if (type.contains('todo__title')) {
    changedTodo.title = item.value;
    // Update LocalStorage
    saveTodos(todos);
  }
}

// -------------------------------------------------Search,Sort,Filter Todos------------------------------------------------- //
function sortTodos(e) {
  const todos = getTodos();
  const sortedTodos = todos.sort((a, b) => {
    if (e.value === 'oldest') {
      return a.id - b.id;
    } else {
      return b.id - a.id;
    }
  });
  // Update DOM
  createTodos(sortedTodos);
  filterTodosContainer.value = 'all';
  searchTodosContainer.value = '';
}

function filterTodos(e) {
  const todos = getTodos();
  console.log(e.value);
  if (e.value === 'all') {
    // Update DOM
    createTodos(todos);
  } else if (e.value === 'completed') {
    const filteredTodos = todos.filter((todo) => todo.completed === true);
    // Update DOM
    createTodos(filteredTodos);
  } else {
    const filteredTodos = todos.filter((todo) => todo.completed === false);
    // Update DOM
    createTodos(filteredTodos);
  }
  sortTodosContainer.value = 'oldest';
  searchTodosContainer.value = '';
}

function searchTodos(e) {
  const todos = getTodos();
  const searchedTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(e.value.toLowerCase())
  );
  // Update DOM
  createTodos(searchedTodos);
  filterTodosContainer.value = 'all';
  sortTodosContainer.value = 'oldest';
}
// -------------------------------------------------Get,Save Todos From LocalStorage------------------------------------------------- //
function saveTodos(todosToSave) {
  localStorage.setItem('todos', JSON.stringify(todosToSave));
}

function getTodos() {
  return JSON.parse(localStorage.getItem('todos'))
    ? JSON.parse(localStorage.getItem('todos'))
    : [];
}
