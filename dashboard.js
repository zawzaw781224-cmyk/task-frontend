const API = "https://task-manager-api-zkq6.onrender.com";

// 🔐 check token
const token = localStorage.getItem("token");

// ❌ no token → go login
if (!token) {
    alert("Please login first");
    window.location.href = "/index.html";
}

// 🚪 logout function
function logout() {
    localStorage.removeItem("token");
    window.location.href = "/index.html";
}
async function loadProfile() {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/auth/profile`, {
        headers: {
            "token": token
        }
    });

    if (!res.ok) {
        alert("Failed to load profile");
        return;
    }

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

        if (!res.ok) {
            showToast("Failed to load tasks ❌", "error");
            return;
        }

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
        showToast("Network error ❌", "error");
    }
}


// ➕ CREATE TASK
async function createTask() {

    const title = document.getElementById("taskInput").value.trim();

    if (!title) {
        showToast("Empty task ❌", "error");
        return;
    }

    try {
        const res = await fetch(`${API}/tasks/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "token": token
            },
            body: JSON.stringify({ title })
        });

        if (!res.ok) {
            showToast("Create failed ❌", "error");
            return;
        }

        document.getElementById("taskInput").value = "";

        showToast("Created ✔️");

        // 🔥 IMPORTANT: wait then refresh
        await getTasks();

    } catch (error) {
        console.error(error);
        showToast("Network error ❌", "error");
    }
}
// ❌ DELETE TASK
async function deleteTask(id) {

    if (!id) {
        showToast("Invalid ID ❌", "error");
        return;
    }

    try {
        const res = await fetch(`${API}/tasks/${id}`, {
            method: "DELETE",
            headers: {
                "token": token
            }
        });

        if (!res.ok) {
            showToast("Delete failed ❌", "error");
            return;
        }

        showToast("Deleted ✔️");

        // 🔥 IMPORTANT: wait refresh properly
        await getTasks();

    } catch (error) {
        console.error(error);
        showToast("Network error ❌", "error");
    }
}function enableEdit(id) {

    const span = document.getElementById(`task-${id}`);

    if (!span) {
        showToast("Task not found ❌", "error");
        return;
    }

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

    if (!input) {
        showToast("Input not found ❌", "error");
        return;
    }

    const newTitle = input.value.trim();

    if (!newTitle) {
        showToast("Empty title ❌", "error");
        return;
    }

    try {
        const res = await fetch(`${API}/tasks/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "token": token
            },
            body: JSON.stringify({ title: newTitle })
        });

        if (!res.ok) {
            showToast("Update failed ❌", "error");
            return;
        }

        showToast("Updated ✔️");

        await getTasks(); // 🔥 refresh safely

    } catch (error) {
        console.error(error);
        showToast("Network error ❌", "error");
    }
}
// 🚀 AUTO LOAD
getTasks();