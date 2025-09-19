# 📝 Notes Manager App

A full-stack **Next.js (App Router)** application that allows users to **register, log in, and manage notes**.  
Built with **Next.js, TypeScript, Tailwind CSS, and MongoDB**. Authentication is handled via **JWT (Access + Refresh tokens)** stored in HTTP-only cookies.  

---

## 🚀 Features
- User authentication (register, login, logout)
- JWT-based auth with access & refresh tokens
- Create, view, edit, and delete personal notes
- Admin support (admins can manage all notes)
- Middleware-based route protection
- Responsive UI with TailwindCSS

---

## 📂 Project Structure
```
src/
├── app/ # Next.js App Router pages & API routes
│ ├── api/ # API endpoints (auth, notes)
│ ├── auth/ # Login & register pages
│ ├── notes/ # Notes CRUD pages
│ └── layout.tsx # Root layout
├── lib/ # Database & model definitions
├── utils/ # API response & error helpers
├── middleware.ts # Authentication middleware
└── ...
```
---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository


```bash
git clone https://github.com/Ramesh087/Notesmanager
cd notes-manager-app
```


### 2️⃣ Install Dependencies
```
npm install
```
##### or
``` 
yarn install
```
### 3️⃣ Setup Environment Variables
Create a .env.local file in the project root:


```
MONGODB_URI="your-mongodb-connection-string"

ACCESS_TOKEN_SECRET="supersecretaccesstoken"
ACCESS_TOKEN_EXPIRY="15m"

REFRESH_TOKEN_SECRET="supersecretrefreshtoken"
REFRESH_TOKEN_EXPIRY="7d"
```
⚠️ Make sure to set these in Netlify dashboard under Site Settings → Build & Deploy → Environment Variables for production.

### 4️⃣ Run the App in Development
``` 
npm run dev 
```

Visit: http://localhost:3000

### 5️⃣ Build for Production
```
npm run build
npm start
```
### 🌐 Deployment on Netlify
``` 
Push your code to GitHub/GitLab.

Connect repository to Netlify.

Add environment variables in Netlify → Site Settings → Environment Variables.

Ensure you have @netlify/plugin-nextjs enabled (Netlify auto-detects Next.js projects).

Deploy!
```
### 🔒 Protected Routes
The middleware ensures:

✅ Public: /auth/*, /api/auth/login, /api/auth/register, /api/auth/refresh, /api/auth/me

🔒 Protected: /, /notes/*, /api/notes/*, /api/auth/logout

### 🛠️ Tech Stack
Frontend: Next.js (App Router), React, TypeScript, TailwindCSS

Backend: Next.js API routes, MongoDB, Mongoose

Auth: JWT (Access + Refresh Tokens in cookies)

Deployment: Netlify

### 👨‍💻 Author
Developed Ramesh

