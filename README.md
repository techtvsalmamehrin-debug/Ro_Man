# Ro-Man - Admission Enquiry Robot

This is a web-based interface for the Ro-Man Admission Enquiry Robot.

## Project Structure

- `backend/`: FastAPI backend (Python)
- `frontend/`: React frontend (Vite)

## Prerequisites

- Python 3.x
- Node.js & npm

## How to Run

### 1. Backend (FastAPI)

Open a terminal in the project root:

```powershell
# Navigate to backend
cd backend

# install requirements (first time only)
pip install -r requirements.txt

# Run server (Port 8001 is important!)
uvicorn main:app --reload --port 8001
```

The backend will start at `http://127.0.0.1:8001`.

### 2. Frontend (React + Vite)

Open a **second terminal** in the project root:

```powershell
# Navigate to frontend
cd frontend

# Install dependencies (if not already done)
npm install

# Run development server
npm run dev
```

The frontend will start at `http://localhost:5173`.

## How to Run in VS Code (Easiest Way)

1.  Open the project folder in VS Code.
2.  Press **Ctrl + `** (backtick) to open the terminal.
3.  Click the **+** (plus icon) or split icon in the terminal panel to open a second terminal.
4.  Run the backend commands in the first terminal and frontend commands in the second.

**Alternatively (One-Click):**
Right-click `run_project.bat` in the file explorer and select "Open in Integrated Terminal" or simply double click it from your desktop folder.

## Notes

- The backend uses SQLite (`roman.db`).
- Ensure both servers are running for the application to work correctly.
