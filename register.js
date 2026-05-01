const API = "https://task-manager-api-zkq6.onrender.com";
function showError(message) {
    const el = document.getElementById("errorMsg");
    if (el) el.innerText = message;
}
async function register() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    // ❌ CHECK FAIL FIRST
    if (!res.ok) {
        alert(data.detail || "Register failed ❌");
        return;
    }
    else{

    
    window.location.href = "/index.html";
    }
}
function goLogin() {
    window.location.href = "/index.html";
}