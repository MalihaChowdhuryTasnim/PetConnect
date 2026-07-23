
console.log("Welcome to PetConnect!");


const buttons = document.querySelectorAll("button");


buttons.forEach((button) => {

    button.addEventListener("click", function () {

        button.style.transform = "scale(0.95)";

      
        setTimeout(function () {
            button.style.transform = "scale(1)";
        }, 150);

    });

});


window.addEventListener("load", function () {

    console.log("PetConnect Home Page Loaded Successfully!");

});
const button = document.querySelector(".ai-box button");

if(button){

    button.addEventListener("click", () => {

        document.querySelector(
        ".ai-response p"
        ).innerText =

        "Cats, dogs, and rabbits require proper care. If your pet seems sick, consult a veterinarian.";

    });

}
const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const response = await fetch(
            "http://localhost:3000/register",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        alert(data.message);

        if (response.ok) {
            window.location.href = "login.html";
        }

    });

}
const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;

        const response = await fetch(
            "http://localhost:3000/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        alert(data.message);

        if (response.ok) {
            window.location.href = "dashboard.html";
        }

    });

}