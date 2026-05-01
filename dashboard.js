const API = "https://task-manager-api-zkq6.onrender.com";

// 🔐 check token
const token = localStorage.getItem("token");

// ❌ no token → go login
if (!token) {
    alert("Please login first");
    window.location.href = "index.html";
}

// 🚪 logout function
function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}
async function loadProfile() {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/auth/profile`, {
        headers: {
            "token": token
        }
    });

    const data = await res.json();

    document.getElementById("profile").innerText =
        `ID: ${data.id} | Username: ${data.username}`;
}

// 📥 READ TASKS
async function getTasks() {

    try {
        const res = await fetch(`${API}/tasks/`, {
            headers: {
                "token": token
            }
        });


        const tasks = await res.json();

        const list = document.getElementById("taskList");

        // safety check
        if (!list) {
            console.error("taskList element not found");
            return;
        }

        list.innerHTML = "";

        tasks.forEach(t => {

            const li = document.createElement("li");

            li.innerHTML = `
                <span id="task-${t.id}" onclick="enableEdit(${t.id})">
                    ${t.title}
                </span>

                <button type="button" onclick="deleteTask(${t.id})">
                    ❌
                </button>`
            ;

            list.appendChild(li);
        });

    } catch (error) {
        console.error("GET TASK ERROR:", error);
    }
}


// ➕ CREATE TASK
async function createTask() {

    const title = document.getElementById("taskInput").value.trim();


    try {
        const res = await fetch(`${API}/tasks/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "token": token
            },
            body: JSON.stringify({ title })
        });


        document.getElementById("taskInput").value = "";

        // 🔥 IMPORTANT: wait then refresh
        await getTasks();

    } catch (error) {
        console.error(error);
    }
}
// ❌ DELETE TASK
async function deleteTask(id) {


    try {
        const res = await fetch(`${API}/tasks/${id}`, {
            method: "DELETE",
            headers: {
                "token": token
            }
        });

        // 🔥 IMPORTANT: wait refresh properly
        await getTasks();

    } catch (error) {
        console.error(error);
    }
}function enableEdit(id) {

    const span = document.getElementById(`task-${id}`);


    const text = span.innerText;

    span.innerHTML = `
        <input id="input-${id}" value="${text}" />
        <button class="save-btn" type="button" onclick="saveEdit(${id})">Save</button>`
    ;

    const input = document.getElementById(`input-${id}`);

    if (input) {
        input.focus();
        input.select();
    }
}
async function saveEdit(id) {

    const input = document.getElementById(`input-${id}`);


    const newTitle = input.value.trim();

    try {
        const res = await fetch(`${API}/tasks/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "token": token
            },
            body: JSON.stringify({ title: newTitle })
        });

        await getTasks(); // 🔥 refresh safely

    } catch (error) {
        console.error(error);
        
    }
}
// 🚀 AUTO LOAD
getTasks();