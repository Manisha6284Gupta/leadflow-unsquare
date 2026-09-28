# LeadFlow MERN - Expat Mortgage Brokerage CRM

Complete Full-Stack MERN (MongoDB, Express, React, Node.js) platform built with Vite, Tailwind CSS, Mongoose ODM, and Server-Sent Events (SSE).

---

## 🚀 Quick Start in VS Code

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (Node v20+ recommended)
- **npm**: v9+ (included with Node.js)
- A **MongoDB** database:
  - Either **MongoDB Atlas** (cloud, which you already configured)
  - Or local MongoDB running on `mongodb://localhost:27017`

---

### 2. Setup Instructions

#### Step 1: Open the Project in VS Code
Open the project directory in VS Code or run in terminal:
```bash
code .
```

#### Step 2: Install Dependencies
Open the VS Code integrated terminal (`Ctrl + \`` or `Cmd + \``) and run:
```bash
npm install
```

#### Step 3: Configure Environment Variables
Copy `.env.example` to create a `.env` file:
```bash
cp .env.example .env
```
Open `.env` and set your `MONGODB_URI`:
```env
# Your MongoDB Atlas Connection String:
MONGODB_URI="mongodb+srv://manishagupta01000_db_user:<YOUR_PASSWORD>@cluster0.jpduuzq.mongodb.net/?appName=Cluster0"

# Optional: Port (default is 3000)
PORT=3000
```
*(If you leave `MONGODB_URI` blank or connect offline, the app automatically runs in resilient in-memory mode with full demo data).*

#### Step 4: Start the Full-Stack Application
Run a single command:
```bash
npm run dev
```

#### Step 5: Open in Your Browser
Open:
```
http://localhost:3000
```

---

## 🛠️ Architecture Overview

- **Backend**: Express.js server (`backend/server.js`) serving REST APIs, webhook ingestion endpoints, and live Server-Sent Events (SSE).
- **Database**: Mongoose ODM (`backend/db/connection.js`, `backend/db/models.js`) connected to your MongoDB Atlas cluster.
- **Frontend**: React 19 single-page app with Tailwind CSS, Lucide icons, and Vite middleware integration.
- **Dev Workflow**: Single unified process — `npm run dev` boots Express which hosts Vite middleware directly on port 3000 (hot reload + API proxying in one terminal).

---

## 🔑 Available Scripts

- `npm run dev` - Starts full-stack Express + Vite development server on port 3000.
- `npm run build` - Compiles the React production bundle into `dist/`.
- `npm run lint` - Runs TypeScript type-checks (`tsc --noEmit`).
- `npm start` - Starts production server.

---

## 📦 Download Complete Code

You can also download the entire `.tar.gz` bundle directly from the app interface by clicking the **"MERN Stack"** badge in the navbar and choosing **"Download Project Code"**.

---

## 🐙 Pushing to Your GitHub Repository

Follow these 4 simple steps to push this project to your GitHub:

### 1. Create a New Repository on GitHub
1. Go to [github.com/new](https://github.com/new).
2. Enter a repository name (e.g. `leadflow-expat-crm` or `leadflow-mern`).
3. Leave **"Initialize this repository with a README"** **UNCHECKED** (we already have one).
4. Click **Create repository**.
5. Copy the repository URL (e.g. `https://github.com/<your-username>/<repo-name>.git`).

### 2. Initialize Git Locally (in VS Code terminal)
Inside your project folder in VS Code, run:
```bash
git init
git add .
git commit -m "feat: complete LeadFlow MERN expat mortgage CRM"
```

### 3. Link Your GitHub Remote
Replace `<YOUR_GITHUB_REPO_URL>` with your actual URL:
```bash
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
```

### 4. Push to GitHub
```bash
git push -u origin main
```

*(Note: `.env` is already configured in `.gitignore` so your private database passwords and secret keys will never be accidentally committed to GitHub).*
