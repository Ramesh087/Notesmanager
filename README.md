# 📓 Notes Manager App  

[![Next.js](https://img.shields.io/badge/Next.js-13-black?logo=next.js)](https://nextjs.org/)  
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)  
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)  
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)  
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)  
[![JWT](https://img.shields.io/badge/Auth-JWT-green?logo=jsonwebtokens)](https://jwt.io/)  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)  

---

## 📖 Overview
**Notes Manager App** is a full-stack application that allows users to register, log in, and manage personal notes.  
Users can create, view, edit, and delete notes. **Admin users** have additional privileges like editing or managing all notes.  

Built with **Next.js (App Router)**, **React**, **TypeScript**, **Tailwind CSS**, and **MongoDB**. Authentication is handled via **JWT tokens stored in HttpOnly cookies**.

---

## ✨ Features

### 👤 User
- Register and login with email & password  
- Create new notes with a title and description  
- View a list of personal notes  
- Edit and delete notes  
- Update profile (username, email, avatar)  

### 👨‍💼 Admin
- Edit or delete any user’s note  
- (Optional) Admin dashboard for managing users  

---

## 🚀 Live Demo
🔗 [View Demo](https://your-demo-link.com) *(replace with deployed link)*  

---

## 🖼 Screenshots

### 🏠 Dashboard
![Notes Dashboard](./screenshots/dashboard.png)

### ✍️ Create Note
![Create Note](./screenshots/create-note.png)

### 🔑 Auth Pages
![Login Page](./screenshots/login.png)

*(Put your screenshots inside `/screenshots` folder in your repo.)*

---

## 🛠 Tech Stack
- **Frontend:** Next.js 13+ (App Router), React, TypeScript, Tailwind CSS  
- **Backend:** Next.js API Routes, JWT Authentication  
- **Database:** MongoDB (Atlas or Local)  
- **Authentication:** JWT stored in HttpOnly cookies  

---

## 📂 Project Structure
### notes-manager/
├─ app/ # Next.js App Router pages
│ ├─ notes/
│ │ ├─[id]
│ ├─auth/
    ├─login
    ├─ 
│ ├─ layout.tsx
│ └─ page.tsx # Root page (notes list)
├─ components/ # Reusable components (Sidebar, Navbar, NoteCard)
├─ lib/ # Utilities (MongoDB connection, JWT helpers)
├─ middleware.ts # JWT authentication middleware
├─ models/ # Mongoose models (User, Note)
├─ app/api/ # API routes for notes and auth
├─ styles/ # Global CSS / Tailwind config
├─ screenshots/ # Project screenshots
├─ package.json
└─ tsconfig.json


## 🔑 Environment Variables

Create a `.env` file in the root:

```env
MONGODB_URI="your_mongodb_connection_string"

ACCESS_TOKEN_SECRET="supersecretaccesstoken"
ACCESS_TOKEN_EXPIRY="15m"

REFRESH_TOKEN_SECRET="supersecretrefreshtoken"
REFRESH_TOKEN_EXPIRY="7d"

## 📡 API Routes
#🔐 Auth

POST /api/auth/register → Register user

POST /api/auth/login → Login & set cookie

POST /api/auth/logout → Logout & clear cookie

GET /api/auth/me → Current logged-in user

📝 Notes

GET /api/notes → All notes of logged-in user

POST /api/notes → Create new note

GET /api/notes/:id → Get a single note

PUT /api/notes/:id → Update note

DELETE /api/notes/:id → Delete note

📜 Scripts
npm run dev     # Start development server
npm run build   # Build production
npm start       # Run production

🗄 MongoDB Models
User
{
  "username": "string",
  "email": "string",
  "password": "string",
  "isAdmin": "boolean"
}

Note
{
  "title": "string",
  "description": "string",
  "userId": "string",
  "createdAt": "Date",
  "updatedAt": "Date"
}

## 🚀 Future Improvements

✅ Search & filter functionality

✅ File/image attachments

✅ UI/UX improvements with animations

📸 Screenshots

Add screenshots in the /screenshots folder and embed them here:

![Notes List](./screenshots/notes-list.png)
![Create Note](./screenshots/create-note.png)

📄 License

Licensed under the MIT License.
See LICENSE
 for details.

⭐ If you like this project, don’t forget to star the repo!