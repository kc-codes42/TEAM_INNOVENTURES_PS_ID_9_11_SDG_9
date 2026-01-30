# Hackathon Template

Production-ready full-stack hackathon boilerplate optimized for **speed**, **parallel team work**, and **zero deployment friction**.

<img src="https://user-images.githubusercontent.com/74038190/212747903-e9bdf048-2dc8-41f9-b973-0e72ff07bfba.gif" width="500">


---

## ✨ Stack

**Frontend**
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Axios

**Backend**
- Node.js
- Express.js
- TypeScript

**Infrastructure**
- Supabase (Postgres, Storage)
- Firebase (Auth / Firestore / Cloud Functions — optional)
- Vercel (Frontend)
- Railway (Backend)

**Tooling**
- Git + GitHub
- VS Code
- Windows 11

---

## 📁 Project Structure

```

.
├── backend/
│   ├── src/
│   │   ├── app.ts
│   │   ├── server.ts
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middlewares/
│   │   └── utils/
│   ├── .env.development
│   ├── .env.production
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── styles/
│   ├── public/
│   ├── .env.local
│   ├── package.json
│   └── tailwind.config.ts
│
├── services/        # Supabase / Firebase helpers or scripts
├── docs/            # Architecture, API contracts, notes
├── README.md
└── .gitignore

````

---

## 🧠 Architecture Principles

- Frontend and backend are **fully decoupled**
- No direct database access from frontend using privileged keys
- Backend owns business logic and secure operations
- Firebase is **optional**, not mandatory
- Structure supports **solo** and **team** hackathons equally

---

## 🚀 Local Setup

### Prerequisites
- Node.js ≥ 18
- npm
- Git

---

### Clone
```bash
git clone <repo-url>
cd Template
````

---

### Backend

```bash
cd backend
npm install
npm run dev
```

Runs on default port defined in `.env.development`.

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:3000`.

---

## 🔐 Environment Variables

### Backend (`backend/.env.development`)

```
PORT=4000
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

### Frontend (`frontend/.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_FIREBASE_API_KEY=
```

Never commit real credentials.

---

## 🌍 Deployment

### Frontend → Vercel

* Root directory: `frontend`
* Build command: `npm run build`
* Output: `.next`
* Add all `NEXT_PUBLIC_*` env vars

### Backend → Railway

* Root directory: `backend`
* Start command:

```bash
npm run start
```

* Add production env vars from `.env.production`

---

## 👥 Team Usage Guidelines

* **Frontend devs** work only in `frontend/`
* **Backend devs** work only in `backend/`
* Shared logic goes in `services/`
* No direct database mutations from UI
* No Firebase Admin SDK in frontend

---

## ✅ Hackathon Readiness Checklist

* [ ] Backend `/health` route returns 200
* [ ] Frontend can hit backend API
* [ ] Supabase tables + policies ready
* [ ] Auth flow tested
* [ ] README updated for judges
* [ ] Demo URL working

---

## 📜 License

MIT — use, fork, destroy, rebuild.

---

Built to survive:

* bad Wi-Fi
* missing teammates
* last-minute pivots
* 3 AM deployments
* demo-time anxiety

End.

```
```
