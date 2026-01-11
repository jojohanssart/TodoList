const todoList = JSON.parse(localStorage.getItem('todos')) || [];

const inputElement = document.querySelector('.todo-input');
const buttonElement = document.querySelector('.add-btn');
const bodyElement = document.querySelector('body');
const checboxElement = document.querySelector('.checkbox');
const taskCounterElement = document.querySelector('.counter');

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
        isChecked: false
    });
    renderTodoList();
    
    console.log(todoList);
    inputElement.value = '';
    saveData();
    
}


// Render To Do HTML
const renderTodoList = () => {
    let todoHTML = '';
    let visibleList;

    
    if (currentFilter === 'all') {
        visibleList = todoList;
    } else if (currentFilter === 'active') {
        visibleList = todoList.filter(todo => !todo.isChecked);
    } else if (currentFilter === 'completed') {
        visibleList = todoList.filter(todo => todo.isChecked);
    }

    visibleList.forEach((todo, index) => {
    const html = `
        <div class="todo-item">
        <input type="checkbox"
        onclick="toggleCheckbox(${index})"
        ${todo.isChecked ? 'checked' : ''}
        >
        <p class="todo-text ${todo.isChecked ? 'done' : ''}">${todo.text}</p>
        <button class="delete-btn" onclick="deleteTodo(${index})">Delete</button>
        </div>
        `;
        todoHTML += html;
    });

    document.querySelector('.all-filter-btn').innerText = `All (${todoList.length})`;
    document.querySelector('.active-filter-btn').innerText = `Active (${todoList.filter(todo => !todo.isChecked).length})`;
    document.querySelector('.completed-filter-btn').innerText = `Completed (${todoList.filter(todo => todo.isChecked).length})`;

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

    todoDisplay.innerHTML = todoHTML;
    updateCounter();
}

// Delete function
const deleteTodo = (index) => {
    todoList.splice(index, 1);
    renderTodoList();
    console.log(todoList);
    saveData();
}

// Checkbox function
function toggleCheckbox (index) {
    todoList[index].isChecked = !todoList[index].isChecked;

    renderTodoList();
    saveData();
}


// Assign function to buttons
buttonElement.addEventListener('click', () => {
    addTodo();
});

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
    const completedList = todoList.filter((todo) => {
        return todo.isChecked;
    });
    const count = completedList.length;
    completedTask = count;
    console.log(count);
}


let currentFilter = 'all';
const setFilter = (filterName) => {
    currentFilter = filterName;
    renderTodoList();
}


renderTodoList();
