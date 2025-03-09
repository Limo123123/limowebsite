const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const username = loginForm.username.value;
    const password = loginForm.password.value;

    if (username === "admin" && password === "limo123123") {
        alert("Loged in Sucsefully");
        document.location.href = "https://unprofaned-chameleon-3957.dataplicity.io/index2.html";
    } else {
    
    if (username === "gast" && password === "gast") {
        alert("Loged in Sucsefully");
        document.location.href = "https://unprofaned-chameleon-3957.dataplicity.io/index2.html";
    } else {
        loginErrorMsg.style.opacity = 1;
    }

    }
})