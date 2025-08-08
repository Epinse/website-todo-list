let todos = [];

const todoInput = document.getElementById("todo-input");
const todoDate = document.getElementById("todo-date");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const deleteAllBtn = document.getElementById("delete-all-btn");
const filterBtn = document.getElementById("filter-btn");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

// Elemen dashboard stats
const totalTasksEl = document.getElementById("total-tasks");
const completedTasksEl = document.getElementById("completed-tasks");
const pendingTasksEl = document.getElementById("pending-tasks");
const progressEl = document.getElementById("progress");

let filterStatus = "all"; 
let searchQuery = "";

addBtn.addEventListener("click", addTodo);
deleteAllBtn.addEventListener("click", deleteAll);
filterBtn.addEventListener("click", toggleFilter);

searchBtn.addEventListener("click", function () {
    searchQuery = searchInput.value.toLowerCase();
    renderTodos();
});
searchInput.addEventListener("input", function () {
    searchQuery = this.value.toLowerCase();
    renderTodos();
});

function renderTodos() {
    todoList.innerHTML = "";
    let filteredTodos = todos;

    if (filterStatus !== "all") {
        filteredTodos = filteredTodos.filter(todo => todo.status.toLowerCase() === filterStatus);
    }

    if (searchQuery.trim() !== "") {
        filteredTodos = filteredTodos.filter(todo =>
            todo.text.toLowerCase().includes(searchQuery)
        );
    }

    if (filteredTodos.length === 0) {
        todoList.innerHTML = `<tr><td colspan="4" style="text-align:center;">No task found</td></tr>`;
        updateStats();
        return;
    }

    filteredTodos.forEach((todo, index) => {
        todoList.innerHTML += `
            <tr>
                <td>${todo.text}</td>
                <td>${todo.date}</td>
                <td>
                    <span style="color:${todo.status === 'Completed' ? 'lightgreen' : 'orange'}">
                        ${todo.status}
                    </span>
                </td>
                <td>
                    <button onclick="toggleStatus(${index})">Mark ${todo.status === "Pending" ? "Completed" : "Pending"}</button>
                    <button onclick="editTodo(${index})">Edit</button>
                    <button onclick="deleteTodo(${index})">Delete</button>
                </td>
            </tr>
        `;
    });

    updateStats();
}

function updateStats() {
    let total = todos.length;
    let completed = todos.filter(t => t.status === "Completed").length;
    let pending = todos.filter(t => t.status === "Pending").length;
    let progressPercent = total === 0 ? 0 : Math.round((completed / total) * 100);

    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    pendingTasksEl.textContent = pending;
    progressEl.textContent = progressPercent + "%";
}

function addTodo() {
    const text = todoInput.value.trim();
    const date = todoDate.value;
    if (text === "" || date === "") return alert("Please fill both fields");
    todos.push({ text, date, status: "Pending" });
    todoInput.value = "";
    todoDate.value = "";
    renderTodos();
}

function deleteTodo(index) {
    todos.splice(index, 1);
    renderTodos();
}

function deleteAll() {
    if (confirm("Are you sure you want to delete all tasks?")) {
        todos = [];
        renderTodos();
    }
}

function editTodo(index) {
    const newTask = prompt("Edit task:", todos[index].text);
    const newDate = prompt("Edit date:", todos[index].date);
    if (newTask && newDate) {
        todos[index].text = newTask;
        todos[index].date = newDate;
        renderTodos();
    }
}

function toggleStatus(index) {
    todos[index].status = todos[index].status === "Pending" ? "Completed" : "Pending";
    renderTodos();
}

function toggleFilter() {
    if (filterStatus === "all") {
        filterStatus = "pending";
        filterBtn.textContent = "SHOW PENDING";
    } else if (filterStatus === "pending") {
        filterStatus = "completed";
        filterBtn.textContent = "SHOW COMPLETED";
    } else {
        filterStatus = "all";
        filterBtn.textContent = "SHOW ALL";
    }
    renderTodos();
}

renderTodos();
