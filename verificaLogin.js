function verificaLogin() {
    sessionStorage.email = document.getElementById("nome_login").value;
    sessionStorage.senha = document.getElementById("senha_login").value;

    if (email === "admin" && senha === "admin") {
        window.location.assign("activities.html");

    } else {
        alert("Hello! I am an alert box!");
    }
}