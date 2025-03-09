const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const username = loginForm.username.value;
    const password = loginForm.password.value;

    if (username === "admin" && password === "ChangeMeNot") {
        alert("Loged in Sucsefully");
        document.location.href = "/downloads/SECRET/Data/Ancjdbvjdbvhdbvndbvnfbvn6483ufhzFnsdsdbBbsVjuiZoe";
    } else {
    
    if (username === "nisfdducif" && password === "sfjsdnjsdusdbds") {
        alert("Loged in Sucsefully");
        document.location.href = "/downloads/SECRET/Data/Ancjdbvjdbvhdbvndbvnfbvn6483ufhzFnsdsdbBbsVjuiZoe";
    } else {
        loginErrorMsg.style.opacity = 1;
    }

    }
})