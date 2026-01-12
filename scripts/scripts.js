let todoList = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = localStorage.getItem('currentFilter') || 'all';

const inputElement = document.querySelector('.todo-input');
const buttonElement = document.querySelector('.add-btn');
const bodyElement = document.querySelector('body');
const checboxElement = document.querySelector('.checkbox');
const taskCounterElement = document.querySelector('.counter');
const clearAllButtonElement = document.querySelector('.clear-all-div');

const todoDisplay = document.querySelector('.todo-list');


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

// Render To Do HTML
let completedTask = 0;
let visibleList;
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
    updateMessage();

    document.querySelector('.all-filter-btn').innerText = `All (${todoList.length})`;
    document.querySelector('.active-filter-btn').innerText = `To Do (${todoList.filter(todo => !todo.isChecked).length})`;
    document.querySelector('.completed-filter-btn').innerText = `Done (${todoList.filter(todo => todo.isChecked).length})`;

    if (todoList.length === 0) {
        let html = '';
        clearAllButtonElement.innerHTML = html;
    } else {
        html = `
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


// Filter button counter
const updateCounter = () => {
    const completedList = todoList.filter((todo) => todo.isChecked);
    const count = completedList.length;
    completedTask = count;
}


// Filter function
const setFilter = (filterName) => {
    currentFilter = filterName;
    localStorage.setItem('currentFilter', filterName);
    renderTodoList();
    updateFilterButtons();
}

// Add active class to filter button
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

// Active tab message function
const updateMessage = () => {
    const totalTodo = todoList.length;
    const completedTodo = todoList.filter(todo => todo.isChecked).length;
    const activeTodo = totalTodo - completedTodo;

    let message = ``;
    if (currentFilter === 'all') {
        if (totalTodo === 0) {
            message = `Nothing here yet. Let's make today's count!`
        } else if (completedTodo === 0) {
            message = `Ready to check off that first box?`
        } else if (completedTodo === totalTodo) {
            message = `All caught up! Time to relax.`
        } else if (activeTodo >= 0) {
            message = `${completedTodo} tasks done. Keep going!`
        }

    } else if (currentFilter === 'active') {
        if (totalTodo === 0) {
            message = `Nothing here yet. Let's make today's count!`
        } else if (completedTodo === 0) {
            message = `Ready to check off that first box?`
        } else if (completedTodo === totalTodo) {
            message = `All caught up! Time to relax.`
        } else if (activeTodo >= 0) {
            message = `You have ${activeTodo} tasks left to do.`
        }
    } else if (currentFilter === 'completed') {
        if (totalTodo === 0) {
            message = `Nothing here yet. Let's make today's count!`
        } else if (completedTodo === 0) {
            message = `No completed tasks yet. Let's start small!`
        } else if (completedTodo === totalTodo) {
            message = `Look at all these ${completedTodo} wins. Nice work!`
        } else if (activeTodo >= 0) {
            message = `${completedTodo} tasks done. ${activeTodo} tasks left. Keep it up!`
        }
    }

    taskCounterElement.innerHTML = message;
}

renderTodoList();
