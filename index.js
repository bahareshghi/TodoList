const addTodoInput = document.querySelector('.add-todo__input');
const todosContainer = document.querySelector('.container__todos');
const sortTodosContainer = document.querySelector('.sort-todos');
const filterTodosContainer = document.querySelector('.filter-todos');
const searchTodosContainer = document.querySelector('.search-container__input');
const todosNumber = document.querySelector('.todos-number');
const addTodoContainer = document.querySelector('.container__add-todo');

addTodoContainer.addEventListener('submit', addTodo);
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
function addTodo(e) {
  e.preventDefault();
  if (!addTodoInput.value) return null;
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

  // Update DOM
  createTodos(todos);
  addTodoInput.value = '';
  sortTodos(sortTodosContainer);
}

// -------------------------------------------------Create Todos------------------------------------------------- //
function createTodos ( todos )
{
  todosContainer.innerHTML = '';
  todos.forEach((todo) => {
    if (!todo.title) return null;
    const todoContainer = document.createElement('li');
    todoContainer.classList.add('todo');
    todoContainer.innerHTML = `<p contenteditable="true" class="todo__title ${
      todo.completed && 'completed'
    }" data-id ='${
      todo.id
    }'>${todo.title}</p><span class="todo__actions"><i class="fa-regular ${
      todo.completed ? 'fa-square-check' : 'fa-square'
    }" data-id ='${
      todo.id
    }'></i>    <i class="fa-solid fa-trash-can trash" data-id ='${
      todo.id
    }'></i></span>`;

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
    // Update LocalStorage
    changedTodo.completed = true;
    saveTodos(todos);

    // Update DOM
    item.classList.remove('fa-square');
    item.classList.add('fa-square-check');
    item.parentElement.previousElementSibling.classList.add('completed');
  } else if (type.contains('fa-square-check')) {
    // Update LocalStorage
    changedTodo.completed = false;
    saveTodos(todos);

    // Update DOM
    item.classList.add('fa-square');
    item.classList.remove('fa-square-check');
    item.parentElement.previousElementSibling.classList.remove('completed');
  } else if (type.contains('fa-trash-can')) {
    const filteredTodos = todos.filter((todo) => todo.id != changedTodo.id);
    // Update LocalStorage
    saveTodos(filteredTodos);
    // Update DOM
    createTodos(filteredTodos);
  } else if (type.contains('todo__title')) {
    changedTodo.title = item.textContent;
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
  switch (e.value) {
    case 'all':
      // Update DOM
      createTodos(todos);
      break;
    case 'completed':
      const completedTodos = todos.filter((todo) => todo.completed === true);
      // Update DOM
      createTodos(completedTodos);
      break;
    case 'uncompleted':
      const uncompletedTodos = todos.filter((todo) => todo.completed === false);
      // Update DOM
      createTodos(uncompletedTodos);
      break;
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
