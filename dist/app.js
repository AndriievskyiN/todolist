// Selectors
const todoList = document.querySelector('.todo-list');
const button = document.querySelector('.todo-button');
const input = document.querySelector('input');
const filterOption = document.querySelector('.filter-todo');

// Class Storage: Handles tasks in the localStorage
class Storage{
    static getTasks(){
        let todos;
        if(localStorage.getItem('todos') == null){
            todos = [];
        }else{
            todos = JSON.parse(localStorage.getItem('todos'));
        }
        return todos
    }

    static addToStorage(todo){
        const todos = Storage.getTasks();
        todos.push(todo);
        localStorage.setItem('todos', JSON.stringify(todos))
    }

    static removeLocalTasks(todo){
        const tasks = Storage.getTasks();
        const taskIndex = todo.children[0].innerHTML;
        tasks.splice(tasks.indexOf(taskIndex),1);
        localStorage.setItem('todos', JSON.stringify(tasks))
    }
}


class CompletedStorage{
    static getCompletedTasks(){
        let completedTasks;
        if (localStorage.getItem('completedTasks') == null){
            completedTasks = [];
        }else{
            completedTasks = JSON.parse(localStorage.getItem('completedTasks'));
        }
        return completedTasks;
    }

    static addCompletedTasks(CompletedTodo){
        const todos = CompletedStorage.getCompletedTasks();
        todos.push(CompletedTodo);
        localStorage.setItem('completedTasks', JSON.stringify(todos))
    }
}

// Class UI: Handles UI
class UI{

    static displayFromStorage(){
        const todos = Storage.getTasks();
        todos.forEach(function(todo){
        // Create a div
        const div = document.createElement('div');
        div.classList.add('todo');
    
        // Create an li
        const newTodo = document.createElement('li');
        newTodo.innerHTML = todo;
        newTodo.classList.add('todo-item');
        div.appendChild(newTodo);
        todoList.appendChild(div);
    
        // Create a completed button
        const completedButton = document.createElement('button');
        completedButton.innerHTML = '<i class="fas fa-check"></i>';
        completedButton.classList.add('completed-btn')
        div.appendChild(completedButton);
    
        // Create a trash button
        const trashButton = document.createElement('button');
        trashButton.innerHTML = '<i class="fas fa-trash"></i>';
        trashButton.classList.add('trash-btn');
        div.appendChild(trashButton);
        });
    }
    
    static clearField(){
        document.querySelector('input').value = '';
    }

    static removeTask(e){
        const task = e.target;
        if(task.classList[0] === 'trash-btn'){
            const todo = task.parentElement;

            // Remove tasks from localStorage
            Storage.removeLocalTasks(todo);
            
            // Animation
            todo.classList.add('disappear')
            todo.addEventListener('transitionend', e => todo.remove())
        }
    }

    static CompleteTask(e){
        const task = e.target;
        if(task.classList[0] == 'completed-btn'){
            const todo = task.parentElement;
            todo.classList.toggle('completed');
        }
    }

    static filteredTodo(e){
        const tasks = todoList.childNodes;

        console.log(e.target.value)
        tasks.forEach(function(todo){
            switch(e.target.value){
                case "all":
                    todo.style.display = 'flex';
                    break;
                case "completed":
                    if(todo.classList.contains('completed')){
                        todo.style.display = 'flex';
                        CompletedStorage.addCompletedTasks('one');
                    }else{
                        todo.style.display = 'none';
                    }
                    break;
                case 'not-completed':
                    if(!todo.classList.contains('completed')){
                        todo.style.display = 'flex';
                    }else{
                        todo.style.display = 'none';
                    }
                    break;
            }
        })
    }

    static alertMessage(message, alertType){
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${alertType}`;
        alertDiv.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('.form-todo');
        container.insertBefore(alertDiv, form);

        // Vanish after 2 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 2000);
        }
        
    
}

// Display Tasks
button.addEventListener('click', addTaskToList);
function addTaskToList(event){

    // Prevent default
    event.preventDefault();

    // Create a div
    const div = document.createElement('div');
    div.classList.add('todo');

    // Create an li
    const newTodo = document.createElement('li');
    newTodo.innerHTML = input.value;;
    newTodo.classList.add('todo-item');
    div.appendChild(newTodo);

    // Create a completed button
    const completedButton = document.createElement('button');
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add('completed-btn')
    div.appendChild(completedButton);

    // Create a trash button
    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add('trash-btn');
    div.appendChild(trashButton);

    // Input Validation (empty input)
    if (input.value.trim() != ''){
        const tasks = Storage.getTasks();

        // Input Validation (duplicate)
        if(tasks.includes(input.value.trim())){
            UI.alertMessage('This task already exists!', 'info');        
        }else{
        // Append the div to the localStorage
        todoList.appendChild(div);
        Storage.addToStorage(input.value);
        }
    }else{
        UI.alertMessage('Please enter a task!', 'danger');
    }

    // Clear input field
    UI.clearField();
    }

// Display tasks from localStorage
document.addEventListener('DOMContentLoaded', UI.displayFromStorage);

// Remove a Task
todoList.addEventListener('click', UI.removeTask);

// Complete a Task
todoList.addEventListener('click',UI.CompleteTask);

// Filter Tasks
filterOption.addEventListener('change', UI.filteredTodo);
