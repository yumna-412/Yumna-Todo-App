
// Get HTML elements
let tasks = [];
let currentFilter = "all";

const form = document.getElementById("form");
const input = document.getElementById("text");
const list = document.getElementById("list");

const total = document.getElementById("total");
const count = document.getElementById("count");
const progress = document.getElementById("progress");
const empty = document.getElementById("empty");

const filterButtons = document.querySelectorAll(".filter");
const clearButton = document.getElementById("clear-completed");

// Load tasks from LocalStorage
function load() {
    try {
        const savedTasks = JSON.parse(localStorage.getItem("tasks"));

        if (!Array.isArray(savedTasks)) {
            return [];
        }

        return savedTasks.filter(task =>
            task &&
            typeof task.id === "number" &&
            typeof task.text === "string" &&
            typeof task.done === "boolean"
        );

    } catch (error) {
        return [];
    }
}

// Save tasks to LocalStorage
function save() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display tasks
function render() {
    list.innerHTML = "";

    let filteredTasks = tasks.filter(task => {
        if (currentFilter === "active") {
            return !task.done;
        }

        if (currentFilter === "done") {
            return task.done;
        }

        return true;
    });

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.dataset.id = task.id;

        if (task.done) {
            li.classList.add("done");
        }

        const label = document.createElement("span");
        label.textContent = task.text;

        const toggleButton = document.createElement("button");
        toggleButton.textContent = task.done ? "Undo" : "Done";
        toggleButton.dataset.action = "toggle";

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.dataset.action = "delete";

        li.append(label, toggleButton, deleteButton);

        list.append(li);
    });

    // Update counters
    const remaining = tasks.filter(task => !task.done).length;

    total.textContent = tasks.length;
    count.textContent = remaining;

    progress.textContent =
        remaining + (remaining === 1 ? " task remaining" : " tasks remaining");

    // Show or hide empty message
    empty.style.display = filteredTasks.length === 0 ? "block" : "none";
}

// Add a new task
form.addEventListener("submit", function(event) {

    event.preventDefault();

    const text = input.value.trim();

    if (text === "") {
        input.focus();
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        done: false
    };

    tasks.push(newTask);

    input.value = "";

    save();
    render();

    input.focus();
});

// Complete or delete tasks
list.addEventListener("click", function(event) {

    const button = event.target.closest("button[data-action]");

    if (!button) {
        return;
    }

    const li = button.closest("li");

    if (!li) {
        return;
    }

    const id = Number(li.dataset.id);

    const action = button.dataset.action;

    if (action === "toggle") {

        tasks.forEach(task => {
            if (task.id === id) {
                task.done = !task.done;
            }
        });

    }

    if (action === "delete") {

        tasks = tasks.filter(task => task.id !== id);

    }

    save();
    render();
});

// Filter tasks
filterButtons.forEach(button => {

    button.addEventListener("click", function() {

        currentFilter = button.dataset.filter;

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        render();
    });

});

// Clear completed tasks
clearButton.addEventListener("click", function() {

    tasks = tasks.filter(task => !task.done);

    save();
    render();

});

// Start the application
tasks = load();

render();
