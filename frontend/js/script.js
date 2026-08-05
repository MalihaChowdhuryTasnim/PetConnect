console.log("Welcome to PetConnect!");


// ===============================
// Button Click Animation
// ===============================

const buttons = document.querySelectorAll("button");

buttons.forEach((button) => {

    button.addEventListener("click", function () {

        button.style.transform = "scale(0.95)";

        setTimeout(function () {
            button.style.transform = "scale(1)";
        }, 150);

    });

});


// ===============================
// Page Loaded
// ===============================

window.addEventListener("load", function () {

    console.log("PetConnect Home Page Loaded Successfully!");

});


// ===============================
// AI Assistant
// ===============================

const button = document.querySelector(".ai-box button");

if (button) {

    button.addEventListener("click", () => {

        const responseText =
            document.querySelector(".ai-response p");

        if (responseText) {

            responseText.innerText =
                "Cats, dogs, and rabbits require proper care. If your pet seems sick, consult a veterinarian.";

        }

    });

}


// ===============================
// REGISTER
// ===============================

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const name =
            document.getElementById("name").value;

        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;


        if (password !== confirmPassword) {

            alert("Passwords do not match!");

            return;

        }


        try {

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

        } catch (error) {

            console.error(error);

            alert("Registration failed!");

        }

    });

}


// ===============================
// LOGIN WITH JWT
// ===============================

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();


        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;


        try {

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


            const data =
                await response.json();


            alert(data.message);


            // Login successful
            if (response.ok) {

                // Save JWT token
                localStorage.setItem(
                    "token",
                    data.token
                );


                // Save user information
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );


                // Go to dashboard
                window.location.href =
                    "dashboard.html";

            }

        } catch (error) {

            console.error(error);

            alert("Login failed!");

        }

    });

}


// ===============================
// POST PET WITH IMAGE
// ===============================

const postPetForm =
    document.getElementById("postPetForm");

if (postPetForm) {

    postPetForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            const imageInput =
                document.getElementById("image");


            if (
                !imageInput ||
                imageInput.files.length === 0
            ) {

                alert("Please select a pet image.");

                return;

            }


            const formData =
                new FormData();


            formData.append(
                "image",
                imageInput.files[0]
            );


            formData.append(
                "name",
                document.getElementById("name").value
            );

            formData.append(
                "category",
                document.getElementById("category").value
            );

            formData.append(
                "breed",
                document.getElementById("breed").value
            );

            formData.append(
                "age",
                document.getElementById("age").value
            );

            formData.append(
                "gender",
                document.getElementById("gender").value
            );

            formData.append(
                "vaccinated",
                document.getElementById("vaccinated").value
            );

            formData.append(
                "location",
                document.getElementById("location").value
            );

            formData.append(
                "contact",
                document.getElementById("contact").value
            );

            formData.append(
                "description",
                document.getElementById("description").value
            );


            try {

                const response = await fetch(
                    "http://localhost:3000/post-pet",
                    {

                        method: "POST",

                        body: formData

                    }
                );


                const data =
                    await response.json();


                alert(data.message);


                if (response.ok) {

                    postPetForm.reset();

                }

            } catch (error) {

                console.error(error);

                alert("Error posting pet!");

            }

        }
    );

}


// ===============================
// LOAD PETS FROM MONGODB
// ===============================

const petGrid =
    document.getElementById("petGrid");

if (petGrid) {

    async function loadPets() {

        try {

            const response = await fetch(
                "http://localhost:3000/pets"
            );


            const pets =
                await response.json();


            petGrid.innerHTML = "";


            if (pets.length === 0) {

                petGrid.innerHTML =
                    "<p>No pets available for adoption.</p>";

                return;

            }


            pets.forEach((pet) => {

                const petCard =
                    document.createElement("div");


                petCard.className =
                    "pet-card";


                // Default image
                let imagePath =
                    "images/dog1.jpeg";


                // Category fallback images
                if (pet.category === "Cat") {

                    imagePath =
                        "images/cat1.jpeg";

                } else if (pet.category === "Rabbit") {

                    imagePath =
                        "images/rabbit.jpeg";

                } else if (pet.category === "Dog") {

                    imagePath =
                        "images/dog1.jpeg";

                }


                // Uploaded image
                if (pet.image) {

                    imagePath =
                        "http://localhost:3000/uploads/" +
                        pet.image;

                }


                petCard.innerHTML = `

                    <img
                        src="${imagePath}"
                        alt="${pet.name}"
                    >

                    <h3>${pet.name}</h3>

                    <p>
                        ${pet.breed} • ${pet.age}
                    </p>

                    <p>
                        ${pet.category} • ${pet.location}
                    </p>

                    <a
                        href="pet-details.html?id=${pet._id}"
                        class="pet-btn"
                    >
                        View Details
                    </a>

                `;


                petGrid.appendChild(petCard);

            });


        } catch (error) {

            console.error(
                "Error loading pets:",
                error
            );


            petGrid.innerHTML =
                "<p>Unable to load pets.</p>";

        }

    }


    loadPets();

}