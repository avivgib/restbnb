# 🏡 restbnb — Full Stack Vacation Rental Platform

This repository contains both the backend and frontend for **restbnb**,  
an Airbnb-like vacation rental application.

---

## 📁 Project Structure

```
restbnb/
├── backend/        # Node.js + Express backend API
├── frontend/       # React + Vite frontend app
└── README.md       # This file
```

---

## ⚙️ Setup & Run Instructions

### 📦 Backend

```bash
cd backend
npm install
npm run server:dev
```

➡️ The backend server will run at:  
http://localhost:3030

---

### 💻 Frontend

```bash
cd frontend
npm install
npm run dev
```

➡️ The frontend dev server will run at:  
http://localhost:5173

---

## 🌐 Environment Variables

Create `.env` files in both backend and frontend directories:

### backend/.env

```env
PORT=3030
ATLAS_URL=your_mongodb_connection_string
ATLAS_DB_NAME=your_db_name
SECRET=your_secret_key
```

### frontend/.env

```env
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
VITE_LOCAL=true
```

---

## 🧰 Tech Stack

- **Backend:** Node.js, Express, MongoDB, Mongoose, dotenv, socket.io
- **Frontend:** React, Vite, Sass, React Router, Axios, @react-google-maps/api

---

## 📌 .gitignore Recommendations

Make sure the following entries exist in both `backend/.gitignore` and `frontend/.gitignore`:

```
node_modules/
.env
dist/
.vscode/
.idea/
logs/
```

---

## 🚀 Future Plans

- [ ] Add Docker support for backend and frontend  
- [ ] Write unit & integration tests (Jest, Supertest, React Testing Library)  
- [ ] CI/CD pipeline integration (GitHub Actions or similar)  
- [ ] Production build optimization  
- [ ] PWA support and E2E testing

---

## 🤝 Contributions

Pull requests and feedback are welcome. Please open an issue before major changes.

---

## 📄
