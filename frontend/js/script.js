console.log("Welcome to PetConnect!");


// ======================================================
// NAVBAR LOGIN / LOGOUT
// ======================================================

const token = localStorage.getItem("token");

const loginLink =
    document.getElementById("loginLink");

const registerLink =
    document.getElementById("registerLink");

const dashboardLink =
    document.getElementById("dashboardLink");

const logoutBtn =
    document.getElementById("logoutBtn");

const postPetLink =
    document.getElementById("postPetLink");
const heroPostPetLink =
    document.getElementById("heroPostPetLink")


// ======================================================
// USER IS LOGGED IN
// ======================================================

if (token) {

    // Hide Login
    if (loginLink) {
        loginLink.style.display = "none";
    }

    // Hide Register
    if (registerLink) {
        registerLink.style.display = "none";
    }

    // Show Dashboard
    if (dashboardLink) {
        dashboardLink.style.display = "inline-block";
    }

    // Show Logout
    if (logoutBtn) {
        logoutBtn.style.display = "inline-flex";
    }

    // Post Pet directly
    if (postPetLink) {
        postPetLink.href = "post_pet.html";
    }

    if (heroPostPetLink)
    heroPostPetLink.href = "post_pet.html";

}


// ======================================================
// USER IS NOT LOGGED IN
// ======================================================

else {

    // Show Login
    if (loginLink) {
        loginLink.style.display = "inline-block";
    }

    // Show Register
    if (registerLink) {
        registerLink.style.display = "inline-block";
    }

    // Hide Dashboard
    if (dashboardLink) {
        dashboardLink.style.display = "none";
    }

    // Hide Logout
    if (logoutBtn) {
        logoutBtn.style.display = "none";
    }

    // Post Pet goes to Login
   if (postPetLink)
    postPetLink.href = "login.html";

   if (heroPostPetLink)
    heroPostPetLink.href = "login.html";

}


// ======================================================
// LOGOUT
// ======================================================

if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        window.location.href = "index.html";

    });

}


// ======================================================
// BUTTON CLICK ANIMATION
// ======================================================

const buttons =
    document.querySelectorAll("button");

buttons.forEach(function (button) {

    button.addEventListener("click", function () {

        button.style.transform = "scale(0.95)";

        setTimeout(function () {

            button.style.transform = "scale(1)";

        }, 150);

    });

});


// ======================================================
// PAGE LOADED
// ======================================================

window.addEventListener("load", function () {

    console.log(
        "PetConnect Page Loaded Successfully!"
    );

});


// ======================================================
// AI ASSISTANT
// ======================================================

const aiButton =
    document.querySelector(".ai-box button");

if (aiButton) {

    aiButton.addEventListener("click", function () {

        const responseText =
            document.querySelector(".ai-response p");

        if (responseText) {

            responseText.innerText =
                "Cats, dogs, and rabbits require proper care. If your pet seems sick, consult a veterinarian.";

        }

    });

}


// ======================================================
// REGISTER
// ======================================================

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            const name =
                document.getElementById("name").value;

            const email =
                document.getElementById("email").value;

            const password =
                document.getElementById("password").value;

            const confirmPassword =
                document.getElementById("confirmPassword").value;


            // Check password
            if (password !== confirmPassword) {

                alert("Passwords do not match!");

                return;

            }


            try {

                const response =
                    await fetch(
                        "http://localhost:3000/register",
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body: JSON.stringify({

                                name: name,

                                email: email,

                                password: password

                            })

                        }
                    );


                const data =
                    await response.json();


                alert(data.message);


                if (response.ok) {

                    window.location.href =
                        "login.html";

                }

            }

            catch (error) {

                console.error(error);

                alert(
                    "Registration failed!"
                );

            }

        }
    );

}


// ======================================================
// LOGIN WITH JWT
// ======================================================

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            const email =
                document.getElementById("email").value;

            const password =
                document.getElementById("password").value;


            try {

                const response =
                    await fetch(
                        "http://localhost:3000/login",
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body: JSON.stringify({

                                email: email,

                                password: password

                            })

                        }
                    );


                const data =
                    await response.json();


                alert(data.message);


                if (response.ok) {

                    // Save JWT
                    localStorage.setItem(
                        "token",
                        data.token
                    );


                    // Save user
                    localStorage.setItem(
                        "user",
                        JSON.stringify(data.user)
                    );


                    // Go dashboard
                    window.location.href =
                        "dashboard.html";

                }

            }

            catch (error) {

                console.error(error);

                alert(
                    "Login failed!"
                );

            }

        }
    );

}


// ======================================================
// POST PET WITH IMAGE
// ======================================================

const postPetForm =
    document.getElementById("postPetForm");

if (postPetForm) {

    postPetForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            const currentToken =
                localStorage.getItem("token");


            // Check login
            if (!currentToken) {

                alert(
                    "Please login first."
                );

                window.location.href =
                    "login.html";

                return;

            }


            const imageInput =
                document.getElementById("image");


            if (
                !imageInput ||
                imageInput.files.length === 0
            ) {

                alert(
                    "Please select a pet image."
                );

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

                const response =
                    await fetch(
                        "http://localhost:3000/post-pet",
                        {

                            method: "POST",

                            headers: {

                                "Authorization":
                                    "Bearer " +
                                    currentToken

                            },

                            body: formData

                        }
                    );


                const data =
                    await response.json();


                alert(data.message);


                if (response.ok) {

                    postPetForm.reset();

                }


                if (response.status === 401) {

                    localStorage.removeItem(
                        "token"
                    );

                    localStorage.removeItem(
                        "user"
                    );

                    window.location.href =
                        "login.html";

                }

            }

            catch (error) {

                console.error(error);

                alert(
                    "Error posting pet!"
                );

            }

        }
    );

}


// ======================================================
// LOAD PETS FROM MONGODB
// ======================================================

   
             
 // ======================================================
// LOAD + SEARCH + FILTER PETS
// ======================================================

const petGrid =
    document.getElementById("petGrid");

if (petGrid) {

    let allPets = [];


    async function loadPets() {

        try {

            const response =
                await fetch(
                    "http://localhost:3000/pets"
                );


            if (!response.ok) {
                throw new Error("Failed to load pets");
            }


            allPets =
                await response.json();


            displayPets(allPets);


        } catch (error) {

            console.error(
                "Error loading pets:",
                error
            );


            petGrid.innerHTML =
                "<p>Unable to load pets.</p>";

        }

    }


    // ======================================================
    // DISPLAY PETS
    // ======================================================

    function displayPets(pets) {

        petGrid.innerHTML = "";


        if (
            !Array.isArray(pets) ||
            pets.length === 0
        ) {

            petGrid.innerHTML =
                "<p>No pets available for adoption.</p>";

            return;

        }


        pets.forEach(function (pet) {

            const petCard =
                document.createElement("div");


            petCard.className =
                "pet-card";


            let imagePath =
                "images/dog1.jpeg";


            if (
                pet.category &&
                pet.category.toLowerCase() === "cat"
            ) {

                imagePath =
                    "images/cat1.jpeg";

            }

            else if (
                pet.category &&
                pet.category.toLowerCase() === "rabbit"
            ) {

                imagePath =
                    "images/rabbit.jpeg";

            }

            else if (
                pet.category &&
                pet.category.toLowerCase() === "dog"
            ) {

                imagePath =
                    "images/dog1.jpeg";

            }


            // Uploaded image from MongoDB
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

                <h3>
                    ${pet.name}
                </h3>

                <p>
                    ${pet.breed || "Not specified"}
                    •
                    ${pet.age || "Not specified"}
                </p>

                <p>
                    ${pet.category || "Pet"}
                    •
                    ${pet.location || "Not specified"}
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

    }


    // ======================================================
    // SEARCH
    // ======================================================

    const searchBox =
        document.querySelector(".search-box");


    const searchInput =
        searchBox
            ? searchBox.querySelector("input")
            : null;


    const categorySelect =
        searchBox
            ? searchBox.querySelector("select")
            : null;


    const searchButton =
        searchBox
            ? searchBox.querySelector("button")
            : null;


    function searchAndFilterPets() {

        const searchText =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";


        const selectedCategory =
            categorySelect
                ? categorySelect.value
                    .trim()
                    .toLowerCase()
                : "all pets";


        const filteredPets =
            allPets.filter(function (pet) {


                // Search name, breed,
                // category or location
                const matchesSearch =
                    !searchText ||

                    (
                        pet.name &&
                        pet.name
                            .toLowerCase()
                            .includes(searchText)
                    ) ||

                    (
                        pet.breed &&
                        pet.breed
                            .toLowerCase()
                            .includes(searchText)
                    ) ||

                    (
                        pet.category &&
                        pet.category
                            .toLowerCase()
                            .includes(searchText)
                    ) ||

                    (
                        pet.location &&
                        pet.location
                            .toLowerCase()
                            .includes(searchText)
                    );


                // Category filter
                let matchesCategory =
                    true;


                if (
                    selectedCategory !==
                    "all pets"
                ) {

                    let category =
                        selectedCategory;


                    if (category === "dogs") {
                        category = "dog";
                    }


                    if (category === "cats") {
                        category = "cat";
                    }


                    if (category === "rabbits") {
                        category = "rabbit";
                    }


                    if (category === "birds") {
                        category = "bird";
                    }


                    matchesCategory =
                        pet.category &&
                        pet.category
                            .toLowerCase() ===
                        category;

                }


                return (
                    matchesSearch &&
                    matchesCategory
                );

            });


        displayPets(
            filteredPets
        );

    }


    // Search button
    if (searchButton) {

        searchButton.addEventListener(
            "click",
            searchAndFilterPets
        );

    }

    // Search automatically while typing
if (searchInput) {

    searchInput.addEventListener(
        "input",
        searchAndFilterPets
    );

}


    // Press Enter to search
    if (searchInput) {

        searchInput.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    searchAndFilterPets();

                }

            }
        );

    }


    // Category dropdown
    if (categorySelect) {

        categorySelect.addEventListener(
            "change",
            searchAndFilterPets
        );

    }


    // Load pets
    loadPets();

}



// ======================================================
// DASHBOARD PROTECTION
// ======================================================

const dashboardPage =
    document.querySelector(".dashboard");

if (dashboardPage) {

    const dashboardToken =
        localStorage.getItem("token");


    // Not logged in
    if (!dashboardToken) {

        window.location.href =
            "login.html";

    }

}


// ======================================================
// DASHBOARD USER NAME
// ======================================================

const welcomeName =
    document.getElementById("welcomeName");

if (welcomeName) {

    const savedUser =
        JSON.parse(
            localStorage.getItem("user")
        );


    if (savedUser) {

        welcomeName.textContent =
            "Hi, " +
            savedUser.name +
            "! 🌸";

    }

}


// ======================================================
// LOAD MY POSTS
// ======================================================

const myPostsContainer =
    document.getElementById(
        "myPostsContainer"
    );

if (myPostsContainer) {

    async function loadMyPosts() {

        const dashboardToken =
            localStorage.getItem("token");


        if (!dashboardToken) {

            window.location.href =
                "login.html";

            return;

        }


        try {

            const response =
                await fetch(
                    "http://localhost:3000/my-pets",
                    {

                        method: "GET",

                        headers: {

                            "Authorization":
                                "Bearer " +
                                dashboardToken

                        }

                    }
                );


            // Token expired
            if (response.status === 401) {

                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "user"
                );

                window.location.href =
                    "login.html";

                return;

            }


            const pets =
                await response.json();


            myPostsContainer.innerHTML =
                "";


            // No posts
            if (
                !Array.isArray(pets) ||
                pets.length === 0
            ) {

                myPostsContainer.innerHTML = `

                    <div class="no-posts">

                        <span>
                            You have not posted any pets yet.
                        </span>

                    </div>

                `;


                const activeCount =
                    document.getElementById(
                        "activePostsCount"
                    );


                if (activeCount) {

                    activeCount.textContent =
                        "0";

                }


                return;

            }


            // Active post count
            const activeCount =
                document.getElementById(
                    "activePostsCount"
                );


            if (activeCount) {

                activeCount.textContent =
                    pets.length;

            }


            // Create cards
            pets.forEach(function (pet) {

                const card =
                    document.createElement("div");


                card.className =
                    "post-card";


                // Image
                let imagePath =
                    "images/dog1.jpeg";


                if (pet.image) {

                    imagePath =
                        "http://localhost:3000/uploads/" +
                        pet.image;

                }


                card.innerHTML = `

                    <div class="post-left">

                        <img
                            src="${imagePath}"
                            alt="${pet.name}"
                        >

                        <div>

                            <h3>
                                ${pet.name}
                            </h3>

                            <p>
                                ${pet.category}
                                ·
                                ${pet.location}
                            </p>

                            <p>
                                ${pet.breed}
                                ·
                                ${pet.age}
                            </p>

                        </div>

                    </div>


                    <button
                        class="mark-btn"
                        type="button"
                    >
                        Mark Adopted
                    </button>

                `;


                // Mark adopted
                const adoptedButton =
                    card.querySelector(
                        ".mark-btn"
                    );


                adoptedButton.addEventListener(
                    "click",
                    async function () {

                        const confirmAdopt =
                            confirm(
                                "Are you sure this pet has been adopted?"
                            );


                        if (!confirmAdopt) {

                            return;

                        }


                        try {

                            const deleteResponse =
                                await fetch(
                                    "http://localhost:3000/pets/" +
                                    pet._id,
                                    {

                                        method: "DELETE",

                                        headers: {

                                            "Authorization":
                                                "Bearer " +
                                                dashboardToken

                                        }

                                    }
                                );


                            const data =
                                await deleteResponse.json();


                            alert(
                                data.message
                            );


                            if (
                                deleteResponse.ok
                            ) {

                                // Remove card
                                card.remove();


                                // Reload posts
                                loadMyPosts();

                            }

                        }

                        catch (error) {

                            console.error(
                                "Delete error:",
                                error
                            );


                            alert(
                                "Unable to mark pet as adopted."
                            );

                        }

                    }
                );


                myPostsContainer.appendChild(
                    card
                );

            });

        }

        catch (error) {

            console.error(
                "Error loading my pets:",
                error
            );


            myPostsContainer.innerHTML = `

                <div class="no-posts">

                    <span>
                        Unable to load your posts.
                    </span>

                </div>

            `;

        }

    }


    loadMyPosts();

}
// ===============================
// HOME FEATURED PETS
// ===============================

const featuredPetContainer =
    document.getElementById("featuredPetContainer");

if (featuredPetContainer) {

    async function loadFeaturedPets() {

        try {

            const response = await fetch(
                "http://localhost:3000/pets"
            );

            const pets = await response.json();

            featuredPetContainer.innerHTML = "";

            if (!pets.length) {

                featuredPetContainer.innerHTML =
                    "<p>No pets available for adoption.</p>";

                return;
            }


            // Show maximum 3 pets on Home page
            const featuredPets = pets.slice(0, 3);


            featuredPets.forEach((pet) => {

                const petCard =
                    document.createElement("div");

                petCard.className = "pet-card";


                // Default image
                let imagePath =
                    "images/dog1.jpeg";


                // Category image
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

                    <h3>
                        ${pet.name}
                    </h3>

                    <p>
                        ${pet.category} • ${pet.age}
                    </p>

                    <a
                        href="pet-details.html?id=${pet._id}"
                        class="pet-btn"
                    >
                        View Details
                    </a>

                `;


                featuredPetContainer.appendChild(
                    petCard
                );

            });


        } catch (error) {

            console.error(
                "Error loading featured pets:",
                error
            );

            featuredPetContainer.innerHTML =
                "<p>Unable to load featured pets.</p>";

        }

    }


    loadFeaturedPets();

}
// ===============================
// PET DETAILS
// ===============================

const petName = document.getElementById("petName");

if (petName) {

    const urlParams =
        new URLSearchParams(window.location.search);

    const petId =
        urlParams.get("id");


    if (!petId) {

        petName.textContent = "Pet not found.";

    } else {

        loadPetDetails();

    }


    async function loadPetDetails() {

        try {

            const response =
                await fetch(
                    "http://localhost:3000/pets/" + petId
                );


            if (!response.ok) {

                throw new Error("Pet not found");

            }


            const pet =
                await response.json();


            // ===============================
            // PET NAME
            // ===============================

            document.getElementById(
                "petName"
            ).textContent =
                pet.name;


            // ===============================
            // BREED
            // ===============================

            document.getElementById(
                "petBreed"
            ).textContent =
                pet.breed || "Not specified";


            // ===============================
            // AGE
            // ===============================

            document.getElementById(
                "petAge"
            ).textContent =
                pet.age || "Not specified";


            // ===============================
            // GENDER
            // ===============================

            document.getElementById(
                "petGender"
            ).textContent =
                pet.gender || "Not specified";


            // ===============================
            // VACCINATED
            // ===============================

            document.getElementById(
                "petVaccinated"
            ).textContent =
                pet.vaccinated || "Not specified";


            // ===============================
            // LOCATION
            // ===============================

            document.getElementById(
                "petLocation"
            ).textContent =
                pet.location || "Not specified";


            // ===============================
            // DESCRIPTION
            // ===============================

            document.getElementById(
                "petDescription"
            ).textContent =
                pet.description ||
                "No description available.";


            // ===============================
            // OWNER NAME
            // ===============================

            document.getElementById(
                "petOwner"
            ).textContent =
                pet.owner?.name ||
                "PetConnect User";


            // ===============================
            // PET IMAGE
            // ===============================

            const petImage =
                document.getElementById("petImage");


            if (pet.image) {

                petImage.src =
                    "http://localhost:3000/uploads/" +
                    pet.image;

            } else {

                if (pet.category === "Cat") {

                    petImage.src =
                        "images/cat1.jpeg";

                } else if (
                    pet.category === "Rabbit"
                ) {

                    petImage.src =
                        "images/rabbit.jpeg";

                } else {

                    petImage.src =
                        "images/dog1.jpeg";

                }

            }


            petImage.alt = pet.name;


        } catch (error) {

            console.error(
                "Error loading pet details:",
                error
            );


            document.getElementById(
                "petName"
            ).textContent =
                "Unable to load pet details.";


            document.getElementById(
                "petDescription"
            ).textContent =
                "Please go back and try again.";

        }

    }

}
// ===============================
// ADOPT NOW BUTTON
// ===============================

const adoptButton =
    document.getElementById("adoptButton");

if (adoptButton) {

    adoptButton.addEventListener("click", function (e) {

        e.preventDefault();

        // Check if user is logged in
        const token =
            localStorage.getItem("token");

        // Get current pet ID from URL
        const params =
            new URLSearchParams(window.location.search);

        const petId =
            params.get("id");

        // If pet ID is missing
        if (!petId) {

            alert("Pet information not found.");

            return;

        }

        // Not logged in → Login
        if (!token) {

            window.location.href =
                "login.html?redirect=adoption-request.html?id=" +
                petId;

            return;

        }

        // Logged in → Adoption Request
        window.location.href =
            "adoption-request.html?id=" +
            petId;

    });

}
// ===============================
// ADOPTION REQUEST
// ===============================

const adoptionRequestForm =
    document.getElementById("adoptionRequestForm");

if (adoptionRequestForm) {

    adoptionRequestForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();

            // ===============================
            // CHECK LOGIN
            // ===============================

            const token =
                localStorage.getItem("token");

            if (!token) {

                alert("Please login first.");

                window.location.href =
                    "login.html";

                return;
            }


            // ===============================
            // GET PET ID FROM URL
            // Example:
            // adoption-request.html?id=123
            // ===============================

            const urlParams =
                new URLSearchParams(
                    window.location.search
                );

            const petId =
                urlParams.get("id");


            if (!petId) {

                alert("Pet information is missing.");

                return;
            }


            // ===============================
            // GET FORM DATA
            // ===============================

            const fullName =
                document.getElementById("fullName").value.trim();

            const email =
                document.getElementById("email").value.trim();

            const phone =
                document.getElementById("phone").value.trim();

            const address =
                document.getElementById("address").value.trim();

            const message =
                document.getElementById("message").value.trim();


            // ===============================
            // CHECK MESSAGE
            // ===============================

            if (!message) {

                alert("Please write a message.");

                return;
            }


            // ===============================
            // SEND TO BACKEND
            // ===============================

            try {

                const response =
                    await fetch(
                        "http://localhost:3000/adoption-request",
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    "Bearer " + token

                            },

                            body: JSON.stringify({

                                petId: petId,

                                message:
                                    "Name: " +
                                    fullName +
                                    "\nEmail: " +
                                    email +
                                    "\nPhone: " +
                                    phone +
                                    "\nAddress: " +
                                    address +
                                    "\n\nReason:\n" +
                                    message

                            })

                        }
                    );


                const data =
                    await response.json();


                // ===============================
                // TOKEN INVALID / EXPIRED
                // ===============================

                if (response.status === 401) {

                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    alert("Your session has expired. Please login again.");

                    window.location.href =
                        "login.html";

                    return;
                }


                // ===============================
                // SHOW BACKEND MESSAGE
                // ===============================

                alert(data.message);


                // ===============================
                // SUCCESS
                // ===============================

                if (response.ok) {

                    adoptionRequestForm.reset();

                    // Go back to dashboard
                    window.location.href =
                        "dashboard.html";

                }


            } catch (error) {

                console.error(
                    "Adoption request error:",
                    error
                );

                alert(
                    "Unable to send adoption request."
                );

            }

        }
    );

} 
// =====================================================
// DASHBOARD - ADOPTION REQUESTS
// =====================================================

const ownerRequestsContainer =
    document.getElementById("ownerRequestsContainer");

const myAdoptionRequestsContainer =
    document.getElementById("myAdoptionRequestsContainer");


// =====================================================
// LOAD REQUESTS RECEIVED BY PET OWNER
// =====================================================

async function loadOwnerRequests() {

    if (!ownerRequestsContainer) {
        return;
    }

    const token =
        localStorage.getItem("token");

    if (!token) {
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:3000/owner-adoption-requests",
            {
                method: "GET",

                headers: {
                    "Authorization":
                        "Bearer " + token
                }
            }
        );


        if (response.status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href = "login.html";

            return;
        }


        const requests =
            await response.json();


        ownerRequestsContainer.innerHTML = "";


        if (!requests.length) {

            ownerRequestsContainer.innerHTML = `
                <div class="no-posts">
                    <span>
                        No adoption requests yet.
                    </span>
                </div>
            `;

            return;
        }


        requests.forEach((request) => {

            const card =
                document.createElement("div");

            card.className = "post-card";


            const petName =
                request.pet
                    ? request.pet.name
                    : "Unknown Pet";


            const requesterName =
                request.requester
                    ? request.requester.name
                    : "Unknown User";


            const message =
                request.message || "No message";


            const status =
                request.status || "Pending";


            card.innerHTML = `

                <div class="post-left">

                    ${
                        request.pet && request.pet.image
                        ?
                        `
                        <img
                            src="http://localhost:3000/uploads/${request.pet.image}"
                            alt="${petName}"
                        >
                        `
                        :
                        `
                        <div>
                            🐾
                        </div>
                        `
                    }

                    <div>

                        <h3>
                            ${petName}
                        </h3>

                        <p>
                            Requester:
                            ${requesterName}
                        </p>

                        <p>
                            ${message}
                        </p>

                        <p>
                            Status:
                            <strong>
                                ${status}
                            </strong>
                        </p>

                    </div>

                </div>

            `;


            // Only show buttons for Pending requests

            if (status === "Pending") {

                const buttons =
                    document.createElement("div");

                buttons.style.marginTop = "15px";


                buttons.innerHTML = `

                    <button
                        type="button"
                        class="mark-btn accept-request-btn"
                    >
                        Accept
                    </button>

                    <button
                        type="button"
                        class="mark-btn reject-request-btn"
                    >
                        Reject
                    </button>

                `;


                card.appendChild(buttons);


                // Accept

                const acceptBtn =
                    buttons.querySelector(
                        ".accept-request-btn"
                    );


                acceptBtn.addEventListener(
                    "click",
                    () => {

                        updateAdoptionRequest(
                            request._id,
                            "Accepted"
                        );

                    }
                );


                // Reject

                const rejectBtn =
                    buttons.querySelector(
                        ".reject-request-btn"
                    );


                rejectBtn.addEventListener(
                    "click",
                    () => {

                        updateAdoptionRequest(
                            request._id,
                            "Rejected"
                        );

                    }
                );

            }


            ownerRequestsContainer.appendChild(card);

        });


    } catch (error) {

        console.error(
            "Error loading owner requests:",
            error
        );


        ownerRequestsContainer.innerHTML = `
            <div class="no-posts">
                <span>
                    Unable to load adoption requests.
                </span>
            </div>
        `;

    }

}



// =====================================================
// ACCEPT / REJECT ADOPTION REQUEST
// =====================================================

async function updateAdoptionRequest(
    requestId,
    status
) {

    const token =
        localStorage.getItem("token");


    if (!token) {

        window.location.href =
            "login.html";

        return;

    }


    const confirmed =
        confirm(
            `Are you sure you want to ${status.toLowerCase()} this request?`
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                "http://localhost:3000/adoption-request/" +
                requestId +
                "/status",
                {

                    method: "PATCH",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            "Bearer " + token

                    },

                    body: JSON.stringify({

                        status: status

                    })

                }
            );


        const data =
            await response.json();


        alert(data.message);


        if (response.ok) {

            loadOwnerRequests();

            loadMyAdoptionRequests();

        }


    } catch (error) {

        console.error(
            "Update request error:",
            error
        );


        alert(
            "Unable to update adoption request."
        );

    }

}



// =====================================================
// LOAD MY ADOPTION REQUESTS
// =====================================================

async function loadMyAdoptionRequests() {

    if (!myAdoptionRequestsContainer) {
        return;
    }


    const token =
        localStorage.getItem("token");


    if (!token) {
        return;
    }


    try {

        const response =
            await fetch(
                "http://localhost:3000/my-adoption-requests",
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            "Bearer " + token

                    }

                }
            );


        if (response.status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href =
                "login.html";

            return;

        }


        const requests =
            await response.json();


        myAdoptionRequestsContainer.innerHTML =
            "";


        if (!requests.length) {

            myAdoptionRequestsContainer.innerHTML = `
                <div class="no-posts">
                    <span>
                        You have not sent any adoption requests yet.
                    </span>
                </div>
            `;

            return;

        }


        requests.forEach((request) => {

            const card =
                document.createElement("div");

            card.className =
                "post-card";


            const petName =
                request.pet
                    ? request.pet.name
                    : "Unknown Pet";


            const ownerName =
                request.owner
                    ? request.owner.name
                    : "Unknown Owner";


            const status =
                request.status || "Pending";


            const message =
                request.message || "No message";


            card.innerHTML = `

                <div class="post-left">

                    ${
                        request.pet &&
                        request.pet.image
                        ?
                        `
                        <img
                            src="http://localhost:3000/uploads/${request.pet.image}"
                            alt="${petName}"
                        >
                        `
                        :
                        `
                        <div>
                            🐾
                        </div>
                        `
                    }

                    <div>

                        <h3>
                            ${petName}
                        </h3>

                        <p>
                            Owner:
                            ${ownerName}
                        </p>

                        <p>
                            ${message}
                        </p>

                        <p>
                            Status:
                            <strong>
                                ${status}
                            </strong>
                        </p>

                    </div>

                </div>

                <button
                    type="button"
                    class="mark-btn delete-adoption-btn"
                >
                    Delete Request
                </button>

            `;


            const deleteBtn =
                card.querySelector(
                    ".delete-adoption-btn"
                );


            deleteBtn.addEventListener(
                "click",
                () => {

                    deleteMyAdoptionRequest(
                        request._id
                    );

                }
            );


            myAdoptionRequestsContainer
                .appendChild(card);

        });


    } catch (error) {

        console.error(
            "Error loading my adoption requests:",
            error
        );


        myAdoptionRequestsContainer.innerHTML = `
            <div class="no-posts">
                <span>
                    Unable to load your adoption requests.
                </span>
            </div>
        `;

    }

}



// =====================================================
// DELETE MY ADOPTION REQUEST
// =====================================================

async function deleteMyAdoptionRequest(
    requestId
) {

    const token =
        localStorage.getItem("token");


    if (!token) {

        window.location.href =
            "login.html";

        return;

    }


    const confirmed =
        confirm(
            "Are you sure you want to delete this adoption request?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                "http://localhost:3000/adoption-request/" +
                requestId,
                {

                    method: "DELETE",

                    headers: {

                        "Authorization":
                            "Bearer " + token

                    }

                }
            );


        const data =
            await response.json();


        alert(data.message);


        if (response.ok) {

            loadMyAdoptionRequests();

        }


    } catch (error) {

        console.error(
            "Delete request error:",
            error
        );


        alert(
            "Unable to delete adoption request."
        );

    }

}



// =====================================================
// START DASHBOARD REQUEST FUNCTIONS
// =====================================================

loadOwnerRequests();

loadMyAdoptionRequests();