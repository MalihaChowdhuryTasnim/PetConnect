# 🐾 PetConnect

> **Adopt • Rescue • Love**

PetConnect is a full-stack pet adoption web application designed to make pet adoption easier and safer. Users can create accounts, post pets for adoption, browse available pets, submit adoption requests, communicate through the request workflow, and get pet-related assistance from the **Paws AI Assistant**.

The project uses a **Node.js + Express + MongoDB** backend and a browser-based HTML/CSS/JavaScript frontend.

---

## ✨ Main Features

### 🐶 Pet Adoption
- Browse pet listings from MongoDB.
- View detailed pet information.
- Search pets.
- Filter pets by category and other available information.
- View pet images uploaded by owners.
- Pet owners cannot adopt/request their own pets.
- Adoption status is tracked:
  - `Available`
  - `Reserved`
  - `Adopted`

### 📝 Adoption Request System
- Logged-in users can send an adoption request for a pet.
- A request contains a message for the pet owner.
- Users can view their own submitted requests.
- Pet owners can view requests received for their pets.
- Owners can:
  - Accept a request.
  - Reject a request.
- When an owner accepts a request, the pet becomes **Reserved**.
- Other pending requests for the same pet are rejected when one request is accepted.
- The owner can later mark a reserved pet as **Adopted**.
- Owners can delete their pet posts.
- Adoption requests connected to a deleted pet are cleaned up.

### 🔐 Authentication & Authorization
- User registration.
- Secure password hashing with `bcryptjs`.
- JWT-based login authentication.
- Protected routes using authentication middleware.
- Logged-in user information can be retrieved through `/me`.
- Banned users cannot log in.
- Separate admin authentication/authorization.

### 👤 User Dashboard
The dashboard provides access to:
- User information.
- User's posted pets.
- Adoption requests sent by the user.
- Adoption requests received for owned pets.
- Request status information.
- Adoption request deletion/cancellation functionality implemented in the current project workflow.

### 🤖 Paws AI Assistant
PetConnect includes an AI assistant named **Paws**.

The current implementation:
- Uses Google's Gemini API through the `@google/genai` package.
- Sends questions from the frontend to the backend.
- Keeps the Gemini API key in the backend environment configuration.
- Provides pet-related guidance for:
  - Pet care
  - Feeding
  - Basic pet behavior
  - Vaccination information
  - Adoption questions
  - General pet questions
- Gives a veterinarian recommendation when a question describes a potentially serious medical problem.

### 🛡️ Admin Panel
The admin dashboard provides:
- Total pets overview.
- Available pet count.
- Adopted pet count.
- Registered user count.
- All pet listings with owner information.
- Admin ability to delete pet posts.
- Registered user management.
- User ban/unban functionality.
- Protection against banning admin accounts.
- Protection against an administrator banning their own account.

### 📱 Frontend
The project includes pages for:
- Home
- Pet adoption
- Pet details
- Post a pet
- Login
- Registration
- User dashboard
- Adoption requests
- Ask Paws AI
- Admin login
- Admin dashboard

The frontend also includes responsive styling and Font Awesome/Google Fonts integration.

---

## 🏗️ Project Structure

```text
PetConnect/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Pet.js
│   │   └── AdoptionRequest.js
│   │
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── petRoutes.js
│   │   ├── adoptionRoutes.js
│   │   ├── aiRoutes.js
│   │   └── adminRoutes.js
│   │
│   ├── uploads/
│   │   └── uploaded pet images
│   │
│   ├── .env
│   ├── authMiddleware.js
│   ├── adminMiddleware.js
│   ├── createAdmin.js
│   ├── gemini.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── css/
│   │   └── style.css
│   │
│   ├── images/
│   │   └── pet/product images
│   │
│   ├── js/
│   │   └── script.js
│   │
│   ├── index.html
│   ├── pets.html
│   ├── pet-details.html
│   ├── post_pet.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── adoption-request.html
│   ├── ai.html
│   ├── admin-login.html
│   └── admin-dashboard.html
│
└── README.md
```

---

## 🧰 Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript
- Font Awesome
- Google Fonts

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Multer

### Authentication & Security
- JSON Web Token (JWT)
- bcryptjs
- Authentication middleware
- Admin authorization middleware

### AI
- Google Gemini API
- `@google/genai`

---

## ⚙️ Installation & Setup

### 1. Clone or download the project

Open the project in **VS Code**.

### 2. Open the backend terminal

```bash
cd backend
```

### 3. Install backend dependencies

```bash
npm install
```

### 4. Configure environment variables

Create/use:

```text
backend/.env
```

Add your own configuration values:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

**Never publish your real `.env` file or API key.**

### 5. Start the backend

From the `backend` directory:

```bash
node server.js
```

The backend runs on:

```text
http://localhost:3000
```

You should see the MongoDB connection message and:

```text
Server is running on http://localhost:3000
```

### 6. Open the frontend

Open the `frontend` folder using a local development server such as the **VS Code Live Server extension**.

The frontend communicates with the backend at:

```text
http://localhost:3000
```

---

## 🔄 Adoption Workflow

The main adoption workflow is:

```text
User registers/logs in
        ↓
Browse available pets
        ↓
Open pet details
        ↓
Send adoption request
        ↓
Owner receives request
        ↓
Owner accepts OR rejects
        ↓
      ┌───────────────┐
      │               │
   Rejected        Accepted
      │               │
      ↓               ↓
Request ends      Pet = Reserved
                      ↓
              Owner confirms adoption
                      ↓
                Pet = Adopted
```

### Reservation Logic

When an owner accepts one request for a pet:

```text
Accepted request
       ↓
Pet becomes Reserved
       ↓
Other Pending requests
       ↓
Automatically Rejected
```

This prevents multiple users from being approved for the same pet at the same time.

---

## 🤖 Paws AI Workflow

```text
User asks a pet-related question
             ↓
        ai.html
             ↓
       script.js
             ↓
      POST /ask-ai
             ↓
      aiRoutes.js
             ↓
        gemini.js
             ↓
       Gemini API
             ↓
       AI response
             ↓
        Paws chat
```

The Gemini API key is read from:

```text
process.env.GEMINI_API_KEY
```

and should remain on the backend.

---

## 🔌 Important Backend Routes

### Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/register` | Register a user |
| POST | `/login` | Log in |
| GET | `/me` | Get current authenticated user |

### Pets

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/post-pet` | Create a pet post |
| GET | `/pets` | Get public pet listings |
| GET | `/my-pets` | Get logged-in user's pets |
| GET | `/pets/:id` | Get pet details |
| PATCH | `/pets/:id/adopt` | Mark reserved pet as adopted |
| DELETE | `/pets/:id` | Delete owner's pet post |

### Adoption

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/adoption-request` | Send adoption request |
| GET | `/my-adoption-requests` | Get requests sent by current user |
| GET | `/owner-adoption-requests` | Get requests received by current owner |
| PATCH | `/adoption-request/:id/status` | Accept/reject a request |

### AI

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/ask-ai` | Send a question to Paws/Gemini |

### Admin

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/admin/overview` | Admin statistics |
| GET | `/admin/pets` | Get all pet listings |
| DELETE | `/admin/pets/:id` | Delete any pet post |
| GET | `/admin/users` | Get registered users |
| PATCH | `/admin/users/:id/ban` | Ban/unban a user |

---

## 🗄️ Database Models

### User

The user model stores:
- Name
- Email
- Hashed password
- Role
- Banned status

### Pet

The pet model stores:
- Owner
- Name
- Category
- Breed
- Age
- Gender
- Vaccination information
- Location
- Contact number
- Description
- Image
- Adoption status

### AdoptionRequest

The adoption request model stores:
- Pet
- Requester
- Owner
- Message
- Status
- Created/updated timestamps

Request statuses are:

```text
Pending
Accepted
Rejected
```

---

## 🔒 Security Notes

The project uses several security mechanisms:

- Passwords are hashed before being stored.
- JWT tokens are used for authentication.
- Protected backend routes require authentication.
- Admin routes require administrator authorization.
- Public pet listing endpoints do not expose the owner's private contact number.
- Owner contact information is exposed to the requester only after the relevant adoption request is accepted.
- Banned users cannot log in.
- Admin accounts cannot be banned.
- The Gemini API key is stored in `.env` rather than frontend JavaScript.

### Before publishing the project

Make sure:

```text
.env
```

is included in `.gitignore`.

Also remove any real API keys or private credentials from the project before uploading it to GitHub or submitting it publicly.

---

## 🧪 Testing Checklist

Before the final demonstration, test:

### Authentication
- [ ] Register a new account.
- [ ] Login with correct credentials.
- [ ] Invalid password is rejected.
- [ ] Banned users cannot log in.
- [ ] Logout works.

### Pet Posting
- [ ] Post a pet.
- [ ] Upload a pet image.
- [ ] Pet appears in adoption listings.
- [ ] Owner can see the post in the dashboard.
- [ ] Owner can delete the post.

### Adoption
- [ ] Another user can request an available pet.
- [ ] Request appears in the owner's dashboard.
- [ ] Duplicate pending request is prevented.
- [ ] Owner can accept a request.
- [ ] Owner can reject a request.
- [ ] Accepted pet becomes `Reserved`.
- [ ] Other pending requests become `Rejected`.
- [ ] Owner can mark a reserved pet as `Adopted`.
- [ ] Adopted pet is no longer available for adoption.
- [ ] Accepted requester receives the appropriate accepted-request information.
- [ ] Owner contact information is protected until acceptance.

### AI
- [ ] Open Ask Paws.
- [ ] Enter a pet-related question.
- [ ] Click Send.
- [ ] Paws shows a thinking/loading state.
- [ ] Gemini returns a response.
- [ ] Empty messages are handled.
- [ ] AI/API errors show a friendly message.

### Admin
- [ ] Admin can log in.
- [ ] Admin statistics load.
- [ ] Admin can see pet listings.
- [ ] Admin can delete a pet post.
- [ ] Admin can see users.
- [ ] Admin can ban/unban users.
- [ ] Normal users cannot access protected admin actions.

---

## ⚠️ Current Development Notes

This repository is a local development project. The frontend currently uses the backend address:

```text
http://localhost:3000
```

For production deployment, the API URL should be changed to the deployed backend URL and environment-specific configuration should be used.

The project also contains uploaded image files under:

```text
backend/uploads/
```

These files are part of the current local project state.

---

## 🚀 Future Improvements

Possible future improvements include:

- Production deployment.
- Cloud image storage.
- Better request/notification system.
- Email or in-app notifications when an adoption request changes status.
- More advanced pet matching/recommendation.
- Improved AI conversation memory.
- Stronger server-side validation for all user inputs.
- Rate limiting for authentication and AI endpoints.
- HTTPS and production environment configuration.
- More detailed admin moderation tools.
- Automated tests.

---

## 🎓 Project Purpose

PetConnect demonstrates how a full-stack web application can combine:

**Authentication + Database + CRUD Operations + Adoption Workflow + Admin Management + AI Assistance**

into one practical pet adoption platform.

---

## ❤️ PetConnect

**Adopt • Rescue • Love 🐾**

Built as a full-stack web development project with a focus on practical pet adoption management and AI-assisted pet guidance.
