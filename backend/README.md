# 🛠️ restbnb – Backend

This is the **backend API** for the [restbnb](https://github.com/your-username/restbnb) full-stack vacation rental application.  
It is built with **Node.js**, **Express**, and **MongoDB** to handle user authentication, listing management, booking orders, reviews, and more.

---

## ⚙️ Setup & Run Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Create `.env` file

Create a `.env` file at the root of `backend/` with the following values:

```env
PORT=3030
ATLAS_URL=your_mongodb_connection_string
ATLAS_DB_NAME=your_db_name
SECRET=your_secret_key
```

> Replace `your_mongodb_connection_string` and `your_db_name` with your MongoDB Atlas connection details.

### 3. Start development server

```bash
npm run server:dev
```

Server will be available at:  
➡️ [http://localhost:3030](http://localhost:3030)

---

## 🧾 API Structure

- **Base URL:** `/api`
- Authentication is handled via **encrypted cookies**
- Data is sent/received in JSON format

---

## 📁 Folder Structure

```
backend/
├── api/            # Route controllers (auth, users, stays, orders, reviews)
│   ├── auth/
│   ├── orders/
│   ├── review/
│   ├── stay/
│   └── user/
├── config/         # DB config and environment settings
├── middlewares/    # Custom Express middleware (auth, logging, ALS)
├── services/       # Business logic and utilities
├── logs/           # Log files
├── public/         # Static files (index.html, assets)
├── server.js       # Main entry point
├── package.json
├── .env
```

---

## 🧰 Tech Stack

- **Node.js** – JavaScript runtime
- **Express** – Web framework
- **MongoDB** – NoSQL database
- **dotenv** – Environment variable management
- **cookie-parser, cors** – Middleware
- **socket.io** – Real-time communication
- **nodemon** – Dev auto-restart

---

## 🔐 .gitignore (Important for security)

Your `.gitignore` should include:

```
node_modules/
.env
logs/
.vscode/
.idea/
```

Never commit `.env` or sensitive config files.

---

## 🧪 Planned Enhancements

- Dockerization support
- Integration & unit tests (Jest, Supertest)
- Email service (SendGrid / Nodemailer)
- Rate limiting, security headers (Helmet)
- CI/CD with GitHub Actions or Railway

---

## 🔌 API Documentation

A Postman collection is available at [api/api.postman.json](api/api.postman.json).

> Consider adding Swagger documentation in future versions.

---

## 🤝 Contributions

PRs are welcome. Please open an issue before submitting large changes.

---

## 📄 License

MIT
