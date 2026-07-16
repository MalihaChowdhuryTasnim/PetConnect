
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