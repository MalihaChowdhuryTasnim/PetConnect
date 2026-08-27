console.log("Welcome to PetConnect!");


// ======================================================
// API BASE URL
// ======================================================
// Change this ONE line when deploying the backend
// (e.g. to your Render URL: "https://petconnect-backend.onrender.com")
// Everything else in this file uses API_BASE_URL, never
// a hardcoded localhost address.
// ======================================================

const API_BASE_URL = "http://localhost:3000";


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


        // If the logged-in user is an admin,
        // send them to the admin dashboard
        // instead of the regular user dashboard.
        try {

            const savedUser =
                localStorage.getItem("user");

            if (savedUser) {

                const currentUser =
                    JSON.parse(savedUser);

                if (currentUser.role === "admin") {

                    dashboardLink.href =
                        "admin-dashboard.html";

                    dashboardLink.textContent =
                        "Admin Dashboard";

                }

            }

        } catch (error) {

            console.error(
                "Dashboard link role check error:",
                error
            );

        }

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


// =========================================
// ASK PAWS CHAT
// =========================================

const sendAiButton =
    document.getElementById("sendAiButton");

const aiInput =
    document.getElementById("aiInput");

const chatMessages =
    document.getElementById("chatMessages");


if (
    sendAiButton &&
    aiInput &&
    chatMessages
) {


    // =====================================
    // ADD USER MESSAGE
    // =====================================

    function addUserMessage(message) {

        const messageDiv =
            document.createElement("div");

        messageDiv.className =
            "user-message";


        messageDiv.innerHTML = `

            <div class="message-content">

                <p>${message}</p>

            </div>

        `;


        chatMessages.appendChild(
            messageDiv
        );


        chatMessages.scrollTop =
            chatMessages.scrollHeight;

    }



    // =====================================
    // ADD PAWS MESSAGE
    // =====================================

    function addPawsMessage(message) {

        const messageDiv =
            document.createElement("div");

        messageDiv.className =
            "ai-message";


        const avatar =
            document.createElement("div");

        avatar.className =
            "message-avatar";

        avatar.textContent =
            "🐾";


        const content =
            document.createElement("div");

        content.className =
            "message-content";


        const name =
            document.createElement("strong");

        name.textContent =
            "Paws";


        const text =
            document.createElement("p");

        text.textContent =
            message;


        content.appendChild(name);

        content.appendChild(text);


        messageDiv.appendChild(avatar);

        messageDiv.appendChild(content);


        chatMessages.appendChild(
            messageDiv
        );


        chatMessages.scrollTop =
            chatMessages.scrollHeight;

    }



    // =====================================
    // THINKING MESSAGE
    // =====================================

    function showThinking() {

        const thinking =
            document.createElement("div");

        thinking.className =
            "typing-message";

        thinking.id =
            "pawsThinking";


        thinking.innerHTML = `

            <div class="message-avatar">
                🐾
            </div>

            <div class="typing-dots">

                <span></span>
                <span></span>
                <span></span>

            </div>

        `;


        chatMessages.appendChild(
            thinking
        );


        chatMessages.scrollTop =
            chatMessages.scrollHeight;

    }



    // =====================================
    // REMOVE THINKING MESSAGE
    // =====================================

    function removeThinking() {

        const thinking =
            document.getElementById(
                "pawsThinking"
            );


        if (thinking) {

            thinking.remove();

        }

    }



    // =====================================
    // SEND MESSAGE
    // =====================================

    async function sendMessage() {

        const question =
            aiInput.value.trim();


        if (!question) {

            return;

        }


        // Show user's message
        addUserMessage(
            question
        );


        // Clear input
        aiInput.value = "";


        // Disable button while waiting
        sendAiButton.disabled =
            true;


        // Show Paws thinking
        showThinking();


        try {

            const response =
                await fetch(
                    API_BASE_URL + "/ask-ai",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                question:
                                    question

                            })

                    }
                );


            const data =
                await response.json();


            removeThinking();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to get AI response."
                );

            }


            addPawsMessage(
                data.answer ||
                "Sorry, Paws could not answer that."
            );


        } catch (error) {

            console.error(
                "Ask Paws error:",
                error
            );


            removeThinking();


            addPawsMessage(
                "Sorry, Paws is currently unavailable. Please try again."
            );

        }


        sendAiButton.disabled =
            false;


        aiInput.focus();

    }



    // =====================================
    // SEND BUTTON CLICK
    // =====================================

    sendAiButton.addEventListener(
        "click",
        sendMessage
    );



    // =====================================
    // ENTER TO SEND
    // SHIFT + ENTER = NEW LINE
    // =====================================

    aiInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendMessage();

            }

        }
    );

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

            const phone =
                document.getElementById("phone").value;


            // Check password
            if (password !== confirmPassword) {

                alert("Passwords do not match!");

                return;

            }


            // Check phone number (Bangladesh format)
            if (!isValidBDPhone(phone)) {

                alert(
                    "Please enter a valid Bangladeshi mobile number (e.g. 01XXXXXXXXX)."
                );

                return;

            }


            try {

                const response =
                    await fetch(
                        API_BASE_URL + "/register",
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body: JSON.stringify({

                                name: name,

                                email: email,

                                password: password,

                                phone: phone

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
// PHONE NUMBER VALIDATION (Bangladesh)
// ======================================================

// Bangladesh mobile numbers: 11 digits starting with "01",
// where the 3rd digit (operator code) is 3-9.
// Also accepts the +880 / 880 country-code form.
const BD_PHONE_REGEX =
    /^(?:\+?880|0)1[3-9]\d{8}$/;

function isValidBDPhone(value) {

    return BD_PHONE_REGEX.test(
        (value || "").trim()
    );

}

// Strip anything that isn't a digit (a single leading "+"
// is allowed) as the user types, so letters/symbols can
// never end up in a phone field in the first place.
function restrictToPhoneDigits(input) {

    if (!input) return;

    input.addEventListener(
        "input",
        function () {

            const hasPlus =
                input.value.startsWith("+");

            let digitsOnly =
                input.value.replace(/[^\d]/g, "");

            input.value =
                (hasPlus ? "+" : "") + digitsOnly;

        }
    );

}

[
    "phone",
    "contact"
].forEach(function (fieldId) {

    restrictToPhoneDigits(
        document.getElementById(fieldId)
    );

});


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
                        API_BASE_URL + "/login",
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


                if (response.ok) {

                    // Admins must use the dedicated Admin Login page
                    if (
                        data.user &&
                        data.user.role === "admin"
                    ) {

                        alert(
                            "Admin accounts must log in from the Admin Login page."
                        );

                        window.location.href =
                            "admin-login.html";

                        return;

                    }


                    alert(data.message);


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


                    // Go back to where the user came from
                    // (e.g. adoption-request.html?id=123),
                    // or dashboard.html by default
                    const redirectTarget =
                        new URLSearchParams(
                            window.location.search
                        ).get("redirect");

                    window.location.href =
                        redirectTarget
                            ? decodeURIComponent(redirectTarget)
                            : "dashboard.html";

                } else {

                    alert(data.message);

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


            // Check phone number (Bangladesh format)
            const contactValue =
                document.getElementById("contact").value;

            if (!isValidBDPhone(contactValue)) {

                alert(
                    "Please enter a valid Bangladeshi mobile number (e.g. 01XXXXXXXXX)."
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
                        API_BASE_URL + "/post-pet",
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
                    API_BASE_URL + "/pets"
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


            // Uploaded image from Cloudinary
            if (pet.image) {

                imagePath =
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
                    API_BASE_URL + "/my-pets",
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
                        pet.image;

                }


                // Only a Reserved pet (i.e. one
                // with an accepted request) can be
                // marked as Adopted.
                const markAdoptedButtonHtml =
                    pet.adoptionStatus === "Reserved"
                        ? `
                    <button
                        class="mark-btn"
                        type="button"
                    >
                        Mark Adopted
                    </button>
                        `
                        : "";


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

                            <p>
                                Status: ${pet.adoptionStatus || "Available"}
                            </p>

                        </div>

                    </div>


                    <div class="post-actions">

                        ${markAdoptedButtonHtml}

                        <button
                            class="delete-btn"
                            type="button"
                        >
                            Delete Post
                        </button>

                    </div>

                `;


                // Mark adopted (only present when Reserved)
                const adoptedButton =
                    card.querySelector(
                        ".mark-btn"
                    );


                if (adoptedButton) {

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

                                const adoptResponse =
                                    await fetch(
                                        API_BASE_URL + "/pets/" +
                                        pet._id +
                                        "/adopt",
                                        {

                                            method: "PATCH",

                                            headers: {

                                                "Authorization":
                                                    "Bearer " +
                                                    dashboardToken

                                            }

                                        }
                                    );


                                const data =
                                    await adoptResponse.json();


                                alert(
                                    data.message
                                );


                                if (
                                    adoptResponse.ok
                                ) {

                                    // Reload posts
                                    loadMyPosts();

                                }

                            }

                            catch (error) {

                                console.error(
                                    "Mark adopted error:",
                                    error
                                );


                                alert(
                                    "Unable to mark pet as adopted."
                                );

                            }

                        }
                    );

                }


                // Delete post
                const deleteButton =
                    card.querySelector(
                        ".delete-btn"
                    );


                deleteButton.addEventListener(
                    "click",
                    async function () {

                        const confirmDelete =
                            confirm(
                                "Delete this pet post? This cannot be undone, and any adoption requests for it will also be removed."
                            );


                        if (!confirmDelete) {

                            return;

                        }


                        try {

                            const deleteResponse =
                                await fetch(
                                    API_BASE_URL + "/pets/" +
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
                                "Unable to delete pet post."
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
                API_BASE_URL + "/pets"
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
                    API_BASE_URL + "/pets/" + petId
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
            
            // =====================================
// HIDE ADOPT BUTTON FOR PET OWNER
// =====================================

const adoptButton =
    document.getElementById("adoptButton");

const token =
    localStorage.getItem("token");

let isPetOwner = false;

if (
    adoptButton &&
    token &&
    pet.owner
) {

    try {

        // Get logged-in user information
        const payload =
            JSON.parse(
                atob(
                    token.split(".")[1]
                )
            );


        const loggedInUserId =
            payload.id ||
            payload._id ||
            payload.userId;


        const petOwnerId =
            pet.owner._id ||
            pet.owner;


        // If logged-in user owns this pet
        if (
            loggedInUserId &&
            petOwnerId &&
            loggedInUserId.toString() ===
            petOwnerId.toString()
        ) {

            isPetOwner = true;

            // Hide Adopt Now button
            adoptButton.style.display =
                "none";

        }

    } catch (error) {

        console.error(
            "Owner check error:",
            error
        );

    }

}


// =====================================
// HIDE ADOPT BUTTON FOR ADMIN ACCOUNTS
// =====================================
// Admins manage the platform, they don't
// adopt pets, so the button is hidden
// whenever an admin is logged in.
// =====================================

let isAdminUser = false;

if (
    adoptButton &&
    token
) {

    try {

        const savedUser =
            localStorage.getItem("user");

        if (savedUser) {

            const currentUser =
                JSON.parse(savedUser);

            if (currentUser.role === "admin") {

                isAdminUser = true;

                adoptButton.style.display =
                    "none";

            }

        }

    } catch (error) {

        console.error(
            "Admin check error:",
            error
        );

    }

}

    // =====================================
// PET ADOPTION STATUS
// =====================================
// Runs for EVERY visitor (logged in or not),
// so guests never see a live "Adopt Now" on a
// Reserved/Adopted pet.
// =====================================

if (adoptButton && !isPetOwner && !isAdminUser) {

    let myRequestStatus = null;

    // =====================================
    // GET MY REQUESTS
    // =====================================

    if (token) {

        try {

            const response = await fetch(
                API_BASE_URL + "/my-adoption-requests",
                {
                    method: "GET",
                    headers: {
                        "Authorization":
                            "Bearer " + token,
                        "Content-Type":
                            "application/json"
                    }
                }
            );


            if (response.ok) {

                const requests =
                    await response.json();


                // Find request for THIS pet
                const myRequest =
                    requests.find(
                        request => {

                            if (!request.pet) {
                                return false;
                            }


                            const requestPetId =
                                request.pet._id ||
                                request.pet;


                            const currentPetId =
                                pet._id;


                            return String(
                                requestPetId
                            ) === String(
                                currentPetId
                            );

                        }
                    );


                if (myRequest) {

                    myRequestStatus =
                        myRequest.status;

                }

            }

        } catch (error) {

            console.error(
                "Unable to check adoption request:",
                error
            );

        }

    }


    // =====================================
    // ACCEPTED REQUEST
    // =====================================

    if (
        myRequestStatus ===
        "Accepted"
    ) {

        adoptButton.textContent =
            "Request Accepted";

        adoptButton.style.pointerEvents =
            "none";

        adoptButton.style.opacity =
            "0.7";

    }


    // =====================================
    // PENDING REQUEST
    // =====================================

    else if (
        myRequestStatus ===
        "Pending"
    ) {

        adoptButton.textContent =
            "Request Pending";

        adoptButton.style.pointerEvents =
            "none";

        adoptButton.style.opacity =
            "0.7";

    }


    // =====================================
    // RESERVED BY SOMEONE ELSE
    // =====================================

    else if (
        pet.adoptionStatus ===
        "Reserved"
    ) {

        adoptButton.textContent =
            "Reserved / Adoption in Progress";

        adoptButton.style.pointerEvents =
            "none";

        adoptButton.style.opacity =
            "0.7";

    }


    // =====================================
    // ADOPTED
    // =====================================

    else if (
        pet.adoptionStatus ===
        "Adopted"
    ) {

        adoptButton.style.display =
            "none";

    }


    // =====================================
    // AVAILABLE
    // =====================================

    else {

        adoptButton.textContent =
            "Adopt Now";

    }

}

            // ===============================
            // PET IMAGE
            // ===============================

            const petImage =
                document.getElementById("petImage");


            if (pet.image) {

                petImage.src =
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
                "login.html?redirect=" +
                encodeURIComponent(
                    "adoption-request.html?id=" + petId
                );

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


            // Check phone number (Bangladesh format)
            if (!isValidBDPhone(phone)) {

                alert(
                    "Please enter a valid Bangladeshi mobile number (e.g. 01XXXXXXXXX)."
                );

                return;

            }


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
                        API_BASE_URL + "/adoption-request",
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
            API_BASE_URL + "/owner-adoption-requests",
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
                            src="${request.pet.image}"
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


            // Pending requests get Accept/Reject.
            // Accepted requests get Cancel Reservation,
            // so the owner isn't stuck if the accepted
            // requester never deletes their request.

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

            else if (status === "Accepted") {

                const buttons =
                    document.createElement("div");

                buttons.style.marginTop = "15px";


                buttons.innerHTML = `

                    <button
                        type="button"
                        class="mark-btn cancel-reservation-btn"
                    >
                        Cancel Reservation
                    </button>

                `;


                card.appendChild(buttons);


                const cancelBtn =
                    buttons.querySelector(
                        ".cancel-reservation-btn"
                    );


                cancelBtn.addEventListener(
                    "click",
                    () => {

                        cancelReservation(
                            request._id
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
// OWNER CANCELS AN ACCEPTED RESERVATION
// =====================================================

async function cancelReservation(requestId) {

    const token =
        localStorage.getItem("token");


    if (!token) {

        window.location.href =
            "login.html";

        return;

    }


    const confirmed =
        confirm(
            "Cancel this reservation? The pet will become available for adoption again."
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                API_BASE_URL + "/adoption-request/" +
                requestId +
                "/cancel-reservation",
                {

                    method: "PATCH",

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

            loadOwnerRequests();

            loadMyAdoptionRequests();

        }


    } catch (error) {

        console.error(
            "Cancel reservation error:",
            error
        );

        alert(
            "Unable to cancel reservation."
        );

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
                API_BASE_URL + "/adoption-request/" +
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
                API_BASE_URL + "/my-adoption-requests",
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


                let ownerContact = "";

if (
    status === "Accepted" &&
    request.pet &&
    request.pet.contact
) {

    ownerContact = `
        <p>
            <strong>Owner Contact:</strong>
            ${request.pet.contact}
        </p>
    `;

}


            card.innerHTML = `

                <div class="post-left">

                    ${
                        request.pet &&
                        request.pet.image
                        ?
                        `
                        <img
                            src="${request.pet.image}"
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
                    ${ownerContact}
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
                API_BASE_URL + "/adoption-request/" +
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

// ======================================================
// ADMIN DASHBOARD PROTECTION
// ======================================================

if (
    window.location.pathname.endsWith(
        "admin-dashboard.html"
    )
) {

    const adminToken =
        localStorage.getItem("token");

    const savedUser =
        localStorage.getItem("user");


    // No login
    if (
        !adminToken ||
        !savedUser
    ) {

        window.location.replace(
            "admin-login.html"
        );

    } else {

        try {

            const user =
                JSON.parse(savedUser);


            // Logged-in user is NOT admin
            if (
                user.role !== "admin"
            ) {

                alert(
                    "You are not authorized to access the admin panel."
                );


                window.location.replace(
                    "admin-login.html"
                );

            } else {

                // Passed the client-side check —
                // load the real dashboard data.
                // (The backend re-checks role on
                // every /admin/* call regardless.)

                loadAdminOverview();
                loadAdminPets();
                loadAdminUsers();

            }

        } catch (error) {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );


            window.location.replace(
                "admin-login.html"
            );

        }

    }

}


// ======================================================
// ADMIN: LOAD OVERVIEW STATS
// ======================================================

async function loadAdminOverview() {

    const adminToken =
        localStorage.getItem("token");

    try {

        const response =
            await fetch(
                API_BASE_URL + "/admin/overview",
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            "Bearer " + adminToken

                    }

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            console.error(
                "Admin overview error:",
                data.message
            );

            return;

        }


        document.getElementById(
            "statTotalPets"
        ).textContent =
            data.totalPets;

        document.getElementById(
            "statAvailablePets"
        ).textContent =
            data.availablePets;

        document.getElementById(
            "statAdoptedPets"
        ).textContent =
            data.adoptedPets;

        document.getElementById(
            "statTotalUsers"
        ).textContent =
            data.totalUsers;


    } catch (error) {

        console.error(
            "Admin overview error:",
            error
        );

    }

}


// ======================================================
// ADMIN: LOAD PET LISTINGS
// ======================================================

async function loadAdminPets() {

    const adminToken =
        localStorage.getItem("token");

    const table =
        document.getElementById("adminPetsTable");

    const emptyRow =
        document.getElementById("adminPetsEmptyRow");

    if (!table) {
        return;
    }

    try {

        const response =
            await fetch(
                API_BASE_URL + "/admin/pets",
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            "Bearer " + adminToken

                    }

                }
            );


        const pets =
            await response.json();


        if (!response.ok) {

            console.error(
                "Admin pets error:",
                pets.message
            );

            return;

        }


        // Remove old rows (keep header row + empty-state row)
        table.querySelectorAll(
            ".admin-pet-row"
        ).forEach(row => row.remove());


        if (pets.length === 0) {

            emptyRow.style.display = "";
            return;

        }

        emptyRow.style.display = "none";


        pets.forEach(pet => {

            const row =
                document.createElement("tr");

            row.className =
                "admin-pet-row";

            row.innerHTML = `
                <td>${pet.name}</td>
                <td>${pet.category}</td>
                <td>${pet.location}</td>
                <td>${pet.owner?.email || "Unknown"}</td>
                <td>${pet.adoptionStatus}</td>
                <td>
                    <button class="delete-btn" type="button">
                        Delete
                    </button>
                </td>
            `;

            table.appendChild(row);


            // DELETE PET (admin override)
            const deleteButton =
                row.querySelector(".delete-btn");

            deleteButton.addEventListener(
                "click",
                async function () {

                    const confirmDelete =
                        confirm(
                            "Delete this pet post? This cannot be undone."
                        );

                    if (!confirmDelete) {
                        return;
                    }

                    try {

                        const deleteResponse =
                            await fetch(
                                API_BASE_URL + "/admin/pets/" +
                                pet._id,
                                {

                                    method: "DELETE",

                                    headers: {

                                        "Authorization":
                                            "Bearer " + adminToken

                                    }

                                }
                            );

                        const data =
                            await deleteResponse.json();

                        alert(data.message);

                        if (deleteResponse.ok) {

                            row.remove();
                            loadAdminOverview();

                        }

                    } catch (error) {

                        console.error(
                            "Admin delete pet error:",
                            error
                        );

                        alert(
                            "Unable to delete pet post."
                        );

                    }

                }
            );

        });


    } catch (error) {

        console.error(
            "Admin pets error:",
            error
        );

    }

}


// ======================================================
// ADMIN: LOAD USERS + BAN / UNBAN
// ======================================================

async function loadAdminUsers() {

    const adminToken =
        localStorage.getItem("token");

    const table =
        document.getElementById("adminUsersTable");

    const emptyRow =
        document.getElementById("adminUsersEmptyRow");

    if (!table) {
        return;
    }

    try {

        const response =
            await fetch(
                API_BASE_URL + "/admin/users",
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            "Bearer " + adminToken

                    }

                }
            );


        const users =
            await response.json();


        if (!response.ok) {

            console.error(
                "Admin users error:",
                users.message
            );

            return;

        }


        table.querySelectorAll(
            ".admin-user-row"
        ).forEach(row => row.remove());


        if (users.length === 0) {

            emptyRow.style.display = "";
            return;

        }

        emptyRow.style.display = "none";


        users.forEach(user => {

            const row =
                document.createElement("tr");

            row.className =
                "admin-user-row";

            const statusLabel =
                user.banned ? "Banned" : "Active";

            const statusClass =
                user.banned ?
                    "status-banned" :
                    "status-active";

            const actionLabel =
                user.banned ? "Unban" : "Ban";

            const actionClass =
                user.banned ?
                    "unban-btn" :
                    "ban-btn";

            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                    <span class="status-badge ${statusClass}">
                        ${statusLabel}
                    </span>
                </td>
                <td>
                    <button class="${actionClass}" type="button">
                        ${actionLabel}
                    </button>
                </td>
            `;

            table.appendChild(row);


            // BAN / UNBAN USER
            const actionButton =
                row.querySelector(
                    "." + actionClass
                );

            actionButton.addEventListener(
                "click",
                async function () {

                    const confirmMessage =
                        user.banned ?
                            "Unban this user?" :
                            "Ban this user? They will not be able to log in.";

                    const confirmAction =
                        confirm(confirmMessage);

                    if (!confirmAction) {
                        return;
                    }

                    try {

                        const banResponse =
                            await fetch(
                                API_BASE_URL + "/admin/users/" +
                                user._id +
                                "/ban",
                                {

                                    method: "PATCH",

                                    headers: {

                                        "Authorization":
                                            "Bearer " + adminToken

                                    }

                                }
                            );

                        const data =
                            await banResponse.json();

                        alert(data.message);

                        if (banResponse.ok) {

                            loadAdminUsers();

                        }

                    } catch (error) {

                        console.error(
                            "Admin ban user error:",
                            error
                        );

                        alert(
                            "Unable to update user status."
                        );

                    }

                }
            );

        });


    } catch (error) {

        console.error(
            "Admin users error:",
            error
        );

    }

}
// ======================================================
// ADMIN LOGIN
// ======================================================

const adminLoginForm =
    document.getElementById("adminLoginForm");


if (adminLoginForm) {

    adminLoginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document.getElementById(
                    "adminEmail"
                ).value.trim();


            const password =
                document.getElementById(
                    "adminPassword"
                ).value;


            const message =
                document.getElementById(
                    "adminLoginMessage"
                );


            const button =
                document.getElementById(
                    "adminLoginButton"
                );


            button.disabled = true;

            button.textContent =
                "Checking...";


            message.textContent = "";


            try {

                const response =
                    await fetch(
                        API_BASE_URL + "/login",
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


                // Login failed
                if (!response.ok) {

                    message.textContent =
                        data.message ||
                        "Invalid email or password.";

                    return;

                }


                // =====================================
                // IMPORTANT:
                // USER MUST BE ADMIN
                // =====================================

                if (
                    !data.user ||
                    data.user.role !== "admin"
                ) {

                    message.textContent =
                        "You are not authorized to access the admin panel.";

                    return;

                }


                // =====================================
                // ADMIN LOGIN SUCCESS
                // =====================================

                localStorage.setItem(
                    "token",
                    data.token
                );


                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );


                window.location.href =
                    "admin-dashboard.html";


            } catch (error) {

                console.error(
                    "Admin login error:",
                    error
                );


                message.textContent =
                    "Unable to connect to the server.";

            } finally {

                button.disabled = false;

                button.textContent =
                    "Login as Admin";

            }

        }
    );

}
