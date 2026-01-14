let todoList = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = localStorage.getItem('currentFilter') || 'all';

const inputElement = document.querySelector('.todo-input');
const buttonElement = document.querySelector('.add-btn');
const bodyElement = document.querySelector('body');
const checboxElement = document.querySelector('.checkbox');
const taskCounterElement = document.querySelector('.counter');
const clearAllButtonElement = document.querySelector('.clear-all-div');
const bottomDividerElement = document.querySelector('.bottom-divider');

const todoDisplay = document.querySelector('.todo-list-div');


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
        <div class="todo-item ${todo.isChecked ? 'done' : ''}">
        <div class="todo-item-left-section">
        <input type="checkbox"
        onclick="toggleCheckbox(${todo.id})"
        ${todo.isChecked ? 'checked' : ''}
        >
        <p class="todo-text ${todo.isChecked ? 'done' : ''}">${todo.text}</p>
        </div>
        <button class="delete-btn" onclick="deleteTodo(${todo.id})">
            <span class="material-symbols-outlined">
                delete
            </span>
        </button>
        </div>
        `;
        todoHTML += html;
    });
    todoDisplay.innerHTML = todoHTML;
    updateCounter();
    updateMessage();
    hideDivider();

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
        btn.classList.remove('active-filter');
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

    const plural = completedTask === 1 ? '' : 's';
    const activePlural = activeTodo === 1 ? '' : 's';

    let message = ``;
    if (currentFilter === 'all') {
        if (totalTodo === 0) {
            message = `Nothing here yet. Let's make today's count!`
        } else if (completedTodo === 0) {
            message = `Ready to check off that first box?`
        } else if (completedTodo === totalTodo) {
            message = `All caught up! Time to relax.`
        } else if (activeTodo > 0) {
            message = `${completedTodo} task${plural} done. Keep going!`
        }

    } else if (currentFilter === 'active') {
        if (totalTodo === 0) {
            message = `Nothing here yet. Let's make today's count!`
        } else if (completedTodo === 0) {
            message = `Ready to check off that first box?`
        } else if (completedTodo === totalTodo) {
            message = `All caught up! Time to relax.`
        } else if (activeTodo >= 0) {
            message = `You have ${activeTodo} task${plural} left to do.`
        }
    } else if (currentFilter === 'completed') {
        if (totalTodo === 0) {
            message = `Nothing here yet. Let's make today's count!`
        } else if (completedTodo === 0) {
            message = `No completed tasks yet. It's time to focus!`
        } else if (completedTodo === totalTodo) {
            message = `Look at all these ${completedTodo} wins. Nice work!`
        } else if (activeTodo >= 0) {
            message = `${completedTodo} task${plural} done. ${activeTodo} task${activePlural} left. Keep it up!`
        }
    }

    taskCounterElement.innerHTML = message;
}

// For now I used AI for this real time date and clock
const updateClock = () => {
    const now = new Date();
    const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', dateOptions);

    const timeString = now.toLocaleTimeString('en-US', { timeStyle: 'short' });

    document.getElementById('dateDisplay').innerText = dateString;
    document.getElementById('clockDisplay').innerText = timeString;
}

updateClock();
setInterval(updateClock, 1000);

const hideDivider = () => {
    if (todoList.length === 0) {
        bottomDividerElement.classList.add('hide')
    } else bottomDividerElement.classList.remove('hide');
}

renderTodoList();
