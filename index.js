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
                <input class="todo__title" type="text" value=${todo.title}></input>
                <span>
                    <i class="fa-regular fa-square-check" data-id ='${todo.id}'></i>
                    <i class="fa-solid fa-trash-can trash" data-id ='${todo.id}'></i>
                </span>
             `;
    } else {
      todoContainer.innerHTML = `
      <input class="todo__title" type="text" value=${todo.title}></input>
      <span>
          <i class="fa-regular fa-square" data-id ='${todo.id}'></i>
          <i class="fa-solid fa-trash-can trash" data-id ='${todo.id}'></i>
      </span>
   `;
    }
    todosContainer.append(todoContainer);
  });
}

function saveTodos(todosToSave) {
  localStorage.setItem('todos', JSON.stringify(todosToSave));
}

function getTodos() {
  return JSON.parse(localStorage.getItem('todos'))
    ? JSON.parse(localStorage.getItem('todos'))
    : [];
}
