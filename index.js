const addTodoBtn = document.querySelector('.add-todo__btn');
const addTodoInput = document.querySelector('.add-todo__input');
const todosContainer = document.querySelector('.container__todos');

addTodoBtn.addEventListener('click', addTodo);
document.addEventListener('DOMContentLoaded', createTodos(getTodos()));
// -------------------------------------------------Add New Todo------------------------------------------------- //
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
  // Reset
  addTodoInput.value = '';
}

// -------------------------------------------------Create todos------------------------------------------------- //
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
}

function todoActions(item) {
  const type = item.classList;
  let todos = getTodos();
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
    console.log(item.value);
    // Update LocalStorage
    saveTodos(todos);
  }
}

function saveTodos(todosToSave) {
  localStorage.setItem('todos', JSON.stringify(todosToSave));
}

function getTodos() {
  return JSON.parse(localStorage.getItem('todos'))
    ? JSON.parse(localStorage.getItem('todos'))
    : [];
}
