let todoList = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = localStorage.getItem('currentFilter') || 'all';

const inputElement = document.querySelector('.todo-input');
const buttonElement = document.querySelector('.add-btn');
const bodyElement = document.querySelector('body');
const checboxElement = document.querySelector('.checkbox');
const taskCounterElement = document.querySelector('.counter');
const clearAllButtonElement = document.querySelector('.clear-all-div');

const todoDisplay = document.querySelector('.todo-list');

let completedTask = 0;


const saveData = () => {
    localStorage.setItem('todos', JSON.stringify(todoList));
}


   

// Add function
const addTodo = () => {
    if (inputElement.value === '') {
        return alert('You must write something!');
    }
    todoList.push({
        text: inputElement.value,
        isChecked: false,
        id: Date.now()
    });
    renderTodoList();
    
    console.log(todoList);
    inputElement.value = '';
    saveData();
    
}

let visibleList;

// Render To Do HTML
const renderTodoList = () => {
    let todoHTML = '';

    updateFilterButtons();
    visibleList.forEach((todo) => {
    const html = `
        <div class="todo-item">
        <input type="checkbox"
        onclick="toggleCheckbox(${todo.id})"
        ${todo.isChecked ? 'checked' : ''}
        >
        <p class="todo-text ${todo.isChecked ? 'done' : ''}">${todo.text}</p>
        <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
        </div>
        `;
        todoHTML += html;
    });

    
    todoDisplay.innerHTML = todoHTML;
    updateCounter();

    if (todoList.length === 0) {
        taskCounterElement.innerHTML =
        'What needs to be done today?';
    } else if (completedTask > 0) {
        taskCounterElement.innerHTML =
        `Great job! you have completed ${completedTask} tasks.`
    } else if (todoList.length > 0 && completedTask === 0) {
        taskCounterElement.innerHTML =
        `Ready to check off that first box?`
    } 
    
    document.querySelector('.all-filter-btn').innerText = `All (${todoList.length})`;
    document.querySelector('.active-filter-btn').innerText = `Active (${todoList.filter(todo => !todo.isChecked).length})`;
    document.querySelector('.completed-filter-btn').innerText = `Completed (${todoList.filter(todo => todo.isChecked).length})`;
    
    if (todoList.length === 0) {
    let html = '';
    clearAllButtonElement.innerHTML = html;
    } else {html = `
    <button class="clear-btn" onclick="clearTodo()">Clear All</button> `;
    clearAllButtonElement.innerHTML = html;
    }
    
}

// Delete function
const deleteTodo = (id) => {
   const indexToDelete = todoList.findIndex((todo) => todo.id === id);
    if (indexToDelete !== -1) {
    todoList.splice(indexToDelete, 1);
    renderTodoList();
    saveData();
    }
}


// Clear all function
const clearTodo = () => { 
    if (!confirm(`Are you sure you want to clear the whole list? You can't undo this!`)) {
        return
    }
    todoList = [];
    renderTodoList();
    saveData();
    alert('Task cleared');
}



// Checkbox function
const toggleCheckbox = (id) => {
    const index = todoList.findIndex((todo) => todo.id === id);
    
    if (index !== -1) {
    const todo = todoList[index];
    todo.isChecked = !todo.isChecked;
    renderTodoList();
    saveData();
    }
}


// Assign function to buttons
buttonElement.addEventListener('click', () => addTodo());

inputElement.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.stopPropagation();
        addTodo();
    }
});



// Shortcut to write todo
bodyElement.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        if (document.activeElement !== inputElement) {
            inputElement.focus();
        };
    }
})


const updateCounter = () => {
    const completedList = todoList.filter((todo) => todo.isChecked);
    const count = completedList.length;
    completedTask = count;
}



const setFilter = (filterName) => {
    currentFilter = filterName;
    localStorage.setItem('currentFilter', filterName);
    renderTodoList();
    updateFilterButtons();
}

const updateFilterButtons = () => {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('.active-filter');
    });
    if (currentFilter === 'all') {
            visibleList = todoList;
            document.querySelector('.all-filter-btn').classList.add('active-filter');
        } else if (currentFilter === 'active') {
            visibleList = todoList.filter(todo => !todo.isChecked);
            document.querySelector('.active-filter-btn').classList.add('active-filter');
        } else if (currentFilter === 'completed') {
            visibleList = todoList.filter(todo => todo.isChecked);
            document.querySelector('.completed-filter-btn').classList.add('active-filter');
        }
}


renderTodoList();
