const API = "https://task-manager-api-zkq6.onrender.com";

async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    // ❌ CHECK FAIL FIRST
    if (!res.ok) {
        alert(data.detail || "Login failed ❌");
        return;
    }

    // ✔ ONLY SUCCESS HERE
    localStorage.setItem("token", data.token);

    alert("Login success ✔️");

    window.location.href = "dashboard.html";
}
function goRegister() {
    window.location.href = "register.html"
}