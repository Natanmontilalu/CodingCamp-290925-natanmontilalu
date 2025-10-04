document.addEventListener('DOMContentLoaded', () => {
    // === DOM Element Selectors ===
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const dueDateInput = document.getElementById('due-date-input');
    const todoList = document.getElementById('todo-list');
    const filterTodos = document.getElementById('filter-todos');
    const deleteAllBtn = document.getElementById('delete-all-btn');
    const noTaskMsg = document.getElementById('no-task-msg');

    // === Application State ===
    // Load todos from localStorage or initialize as an empty array
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    // === Event Listeners ===
    todoForm.addEventListener('submit', addTodo);
    todoList.addEventListener('click', handleTodoActions);
    deleteAllBtn.addEventListener('click', deleteAllTodos);
    filterTodos.addEventListener('change', renderTodos);

    // === Core Functions ===

    /**
     * Renders the todo list to the UI based on the current filter
     */
    function renderTodos() {
        // Clear the current list
        todoList.innerHTML = '';

        // Get the current filter value
        const filterValue = filterTodos.value;

        // Filter the todos based on the selected filter
        const filteredTodos = todos.filter(todo => {
            if (filterValue === 'completed') {
                return todo.completed;
            }
            if (filterValue === 'pending') {
                return !todo.completed;
            }
            return true; // for 'all'
        });

        // Show or hide the "No task found" message
        if (filteredTodos.length === 0) {
            noTaskMsg.classList.add('show');
        } else {
            noTaskMsg.classList.remove('show');
        }

        // Create and append a list item for each todo
        filteredTodos.forEach(todo => {
            const todoItem = document.createElement('li');
            todoItem.classList.add('todo-item');
            todoItem.setAttribute('data-id', todo.id);

            if (todo.completed) {
                todoItem.classList.add('completed');
            }

            const statusText = todo.completed ? 'Completed' : 'Pending';
            const statusClass = todo.completed ? 'completed' : 'pending';

            todoItem.innerHTML = `
                <span class="task-text">${todo.text}</span>
                <span class="due-date-text">${todo.dueDate}</span>
                <span class="status-text ${statusClass}">${statusText}</span>
                <div class="actions">
                    <button class="complete-btn">✔️</button>
                    <button class="delete-btn">🗑️</button>
                </div>
            `;
            todoList.appendChild(todoItem);
        });
    }

    /**
     * Adds a new todo item
     * @param {Event} e - The form submission event
     */
    function addTodo(e) {
        e.preventDefault();

        const todoText = todoInput.value.trim();
        const dueDate = dueDateInput.value;

        // --- Validation ---
        if (todoText === '') {
            alert('Please enter a task.');
            return;
        }
        if (dueDate === '') {
            alert('Please select a due date.');
            return;
        }

        // Create a new todo object
        const newTodo = {
            id: Date.now(), // Unique ID based on timestamp
            text: todoText,
            dueDate: dueDate,
            completed: false
        };

        // Add the new todo to the state array
        todos.push(newTodo);

        // Save to localStorage and re-render the list
        saveAndRender();

        // Clear input fields
        todoInput.value = '';
        dueDateInput.value = '';
    }

    /**
     * Handles clicks on the complete and delete buttons within the todo list
     * @param {Event} e - The click event
     */
    function handleTodoActions(e) {
        const target = e.target;
        const parentLi = target.closest('.todo-item');
        if (!parentLi) return;

        const todoId = Number(parentLi.getAttribute('data-id'));

        if (target.classList.contains('complete-btn')) {
            toggleComplete(todoId);
        }

        if (target.classList.contains('delete-btn')) {
            deleteTodo(todoId);
        }
    }

    /**
     * Toggles the 'completed' status of a todo
     * @param {number} id - The ID of the todo to toggle
     */
    function toggleComplete(id) {
        todos = todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        saveAndRender();
    }

    /**
     * Deletes a specific todo item
     * @param {number} id - The ID of the todo to delete
     */
    function deleteTodo(id) {
        todos = todos.filter(todo => todo.id !== id);
        saveAndRender();
    }

    /**
     * Deletes all todo items
     */
    function deleteAllTodos() {
        if (confirm('Are you sure you want to delete all tasks?')) {
            todos = [];
            saveAndRender();
        }
    }

    /**
     * Saves the current todos array to localStorage and re-renders the UI
     */
    function saveAndRender() {
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
    }

    // --- Initial Render ---
    // Render the list when the page first loads
    renderTodos();
});