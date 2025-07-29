# 🌐 restbnb – Frontend

This is the **frontend** of the [restbnb](https://github.com/your-username/restbnb) full-stack vacation rental platform.  
Built with **React**, **Vite**, and **Sass**, this app connects to the backend API to provide a full Airbnb-like experience.

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file at the root of `frontend/` and add your configuration:

```env
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
VITE_LOCAL=true
```

- `VITE_GOOGLE_MAPS_API_KEY` is required for map features.
- `VITE_LOCAL=true` will use local mock data instead of the backend API (for development/testing).

> **Note:** The backend should be running at the URL expected by the frontend (see proxy config below).

### 3. Run the development server

```bash
npm run dev
```

Frontend will be served at [http://localhost:5173](http://localhost:5173) by default.

---

## 🧠 Scripts

```bash
npm run dev        # Start Vite dev server
npm run build      # Production build
npm run preview    # Preview built app
npm run lint       # Lint code with ESLint
```

---

## 📁 Folder Structure

```
frontend/
├── public/                # Static files (images, favicon, etc.)
├── src/
│   ├── assets/            # Images, fonts, and static assets
│   ├── cmps/              # Reusable components
│   ├── pages/             # Route pages (StayIndex, StayDetails, etc.)
│   ├── services/          # API services (Axios calls)
│   ├── store/             # Global state (Redux / custom)
│   ├── customHooks/       # Custom React hooks
│   ├── App.jsx            # Main App component
│   ├── main.jsx           # Entry point
│   └── RootCmp.jsx        # Root component (routing setup)
├── index.html
├── vite.config.js
└── .env
```

---

## 🧭 Routing Overview

Routing is managed using `react-router-dom` in [`src/RootCmp.jsx`](src/RootCmp.jsx).

| Path                      | Component             |
|---------------------------|----------------------|
| `/`                       | StayIndex            |
| `/about`                  | AboutUs              |
| `/about/team`             | AboutTeam            |
| `/about/vision`           | AboutVision          |
| `/stay`                   | StayIndex            |
| `/stay/results`           | StayResults          |
| `/stay/:stayId`           | StayDetails          |
| `/rooms/:stayId`          | StayDetail           |
| `/stay/:stayId/booking`   | BookingOrderPage     |
| `/user/:id`               | UserDetails          |
| `/user/orders`            | UserOrders           |
| `/host/orders`            | HostOrdersPage       |
| `/review`                 | ReviewIndex          |
| `/chat`                   | ChatApp              |
| `/admin`                  | AdminIndex *(protected)* |

Routes like `/admin` are protected with the `AuthGuard` component to ensure only authenticated users (with admin role) can access.

---

## 🧰 Tech Stack

- **React**
- **Vite**
- **Sass**
- **React Router**
- **Axios**
- **dotenv (via Vite)**
- **@react-google-maps/api**

---

## ✅ .gitignore

Make sure your `.gitignore` file includes:

```
node_modules/
dist/
.vscode/
.idea/
.env
```

---

## 📦 Vite Configuration

The project uses [`vite.config.js`](vite.config.js) for bundling.  
To enable a backend proxy during development, add the following to your config:

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  },
  build: {
    outDir: '../restBNB-back/public',
    emptyOutDir: true
  }
})
```

---

## 🔮 Future Enhancements

- Authentication modals (login/signup)
- Responsive design improvements
- PWA support
- Global loading and error states
- E2E testing with Cypress or Playwright

---

## 🤝 Contributions

Pull requests and feedback are welcome. Please open an issue before major changes.

---

## 📄 License

MIT License

---