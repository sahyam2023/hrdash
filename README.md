# HR Dashboard

A modern HR dashboard web application for managing employees, departments, job titles, and analytics. Built with Flask (backend) and React + Vite (frontend).

## Features

- Employee management (CRUD, deactivate)
- Department and job title management
- Real-time updates via Socket.IO
- Analytics: KPIs, department breakdown, turnover, salary distribution
- RESTful API endpoints
- Modern React frontend with charts and notifications

## Tech Stack

- **Backend:** Flask, Flask-SocketIO, Flask-CORS, SQLite
- **Frontend:** React, Vite, TailwindCSS, Framer Motion, Recharts, Lucide React, Axios, Socket.IO Client

## Project Structure

```
hrdash/
├── app.py                # Flask app factory
├── config.py             # Configuration settings
├── database.py           # SQLite DB setup and helpers
├── extensions.py         # Flask extensions (SocketIO, CORS)
├── routes.py             # API and Socket.IO routes
├── run.py                # App entrypoint
├── hr_dashboard.db       # SQLite database file
├── requirements.txt      # Python dependencies
└── frontend/             # React frontend (Vite)
    ├── package.json      # Frontend dependencies
    ├── src/              # React source code
    └── ...
```

## Getting Started

### Backend (Flask)

1. **Install Python dependencies:**
   ```powershell
   pip install -r requirements.txt
   ```
2. **Run the backend server:**
   ```powershell
   python run.py
   ```
   The API and Socket.IO server will start on `http://127.0.0.1:5000`.

### Frontend (React)

1. **Install Node dependencies:**
   ```powershell
   cd frontend
   npm install
   ```
2. **Start the frontend dev server:**
   ```powershell
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173` (default Vite port).

## API Endpoints

- `GET /api/employees` — List employees (with search, filter, pagination)
- `POST /api/employees` — Add employee
- `PUT /api/employees/<id>` — Update employee
- `PUT /api/employees/<id>/deactivate` — Deactivate employee
- `GET /api/departments` — List departments
- `POST /api/departments` — Add department
- `DELETE /api/departments/<id>` — Delete department
- `GET /api/job-titles` — List job titles
- `POST /api/job-titles` — Add job title
- `DELETE /api/job-titles/<id>` — Delete job title
- `GET /api/dashboard/kpis` — Get KPIs
- `GET /api/dashboard/department-breakdown` — Department breakdown
- `GET /api/analytics/turnover` — Turnover analytics
- `GET /api/analytics/salary-distribution` — Salary distribution

## Real-Time Events (Socket.IO)

- `employee_added`, `employee_updated`, `employee_deactivated`
- `department_added`, `department_deleted`
- `job_title_added`, `job_title_deleted`

## Configuration

- See `config.py` for environment settings.
- Database file: `hr_dashboard.db` (SQLite)

## License

MIT
