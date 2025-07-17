# hrdash/routes.py

from flask import request, jsonify, Blueprint, current_app
from datetime import datetime, timedelta
import sqlite3
import re
from database import get_db_connection
from flask_socketio import emit

# Import the socketio instance from the new extensions.py file
# This is the key fix that resolves the circular import error.
from extensions import socketio

# Create a Blueprint for all our REST API routes
api_bp = Blueprint('api', __name__)

# --- Helper Functions for Validation ---
def is_valid_email(email):
    """Simple regex for validating an email address."""
    if email:
        return re.match(r"[^@]+@[^@]+\.[^@]+", email)
    return False

def is_valid_date(date_string):
    """Checks if a string is a valid date in YYYY-MM-DD format."""
    try:
        datetime.strptime(date_string, '%Y-%m-%d')
        return True
    except (ValueError, TypeError):
        return False

# ===================================================================
# 1. REST API ENDPOINTS (prefixed with /api)
# ===================================================================

@api_bp.route('/employees', methods=['GET'])
def get_employees():
    """
    Fetches employees with optional filters, search, and pagination.
    Query Params:
    - search (str): Search term for first name, last name, or email.
    - department (str): Filter by department.
    - job_title (str): Filter by job title.
    - page (int): The page number for pagination (default 1).
    - limit (int): The number of items per page (default 20).
    """
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int)
    offset = (page - 1) * limit
    search_term = request.args.get('search', '', type=str)
    department = request.args.get('department', '', type=str)
    job_title = request.args.get('job_title', '', type=str)

    base_query = "FROM employees WHERE is_active = 1"
    params = []
    
    if search_term:
        base_query += " AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)"
        term = f"%{search_term}%"
        params.extend([term, term, term])
    if department:
        base_query += " AND department = ?"
        params.append(department)
    if job_title:
        base_query += " AND job_title = ?"
        params.append(job_title)

    conn = get_db_connection()
    # Get total count for pagination metadata, using the same filters but without limit/offset
    total_records = conn.execute(f"SELECT COUNT(id) {base_query}", params).fetchone()[0]
    
    # Get the paginated results
    results_query = f"SELECT * {base_query} ORDER BY first_name, last_name LIMIT ? OFFSET ?"
    employees = conn.execute(results_query, params + [limit, offset]).fetchall()
    conn.close()

    return jsonify({
        'data': [dict(row) for row in employees],
        'pagination': {
            'totalRecords': total_records,
            'currentPage': page,
            'totalPages': (total_records + limit - 1) // limit, # Ceiling division
            'limit': limit
        }
    })

@api_bp.route('/employees', methods=['POST'])
def add_employee():
    """Adds a new employee with validation."""
    data = request.get_json()
    required_fields = ['first_name', 'last_name', 'email', 'job_title', 'department', 'start_date']
    
    if not data or not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    if not is_valid_email(data['email']):
        return jsonify({'error': 'Invalid email format'}), 400
    if not is_valid_date(data['start_date']):
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD.'}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO employees (first_name, last_name, email, job_title, department, start_date) VALUES (?, ?, ?, ?, ?, ?)",
                       (data['first_name'], data['last_name'], data['email'], data['job_title'], data['department'], data['start_date']))
        conn.commit()
        new_id = cursor.lastrowid
        conn.close()
        
        created_employee = {**data, "id": new_id, "is_active": 1}
        # Emit a socket event to notify all connected clients
        socketio.emit('employee_added', created_employee)
        return jsonify(created_employee), 201
        
    except sqlite3.IntegrityError:
        return jsonify({'error': 'An employee with this email already exists'}), 409
    except Exception as e:
        current_app.logger.error(f"Error adding employee: {e}")
        return jsonify({'error': 'An internal server error occurred'}), 500

@api_bp.route('/employees/<int:employee_id>', methods=['GET'])
def get_employee(employee_id):
    """Fetches a single employee by their ID."""
    conn = get_db_connection()
    employee = conn.execute('SELECT * FROM employees WHERE id = ?', (employee_id,)).fetchone()
    conn.close()
    if employee is None:
        return jsonify({'error': 'Employee not found'}), 404
    return jsonify(dict(employee))

@api_bp.route('/employees/<int:employee_id>', methods=['PUT'])
def update_employee(employee_id):
    """Updates an existing employee's details."""
    data = request.get_json()
    conn = get_db_connection()
    conn.execute("UPDATE employees SET first_name = ?, last_name = ?, email = ?, job_title = ?, department = ? WHERE id = ?",
                 (data['first_name'], data['last_name'], data['email'], data['job_title'], data['department'], employee_id))
    conn.commit()
    conn.close()
    socketio.emit('employee_updated', {'id': employee_id})
    return jsonify({'message': 'Employee updated successfully'})

@api_bp.route('/employees/<int:employee_id>/deactivate', methods=['PUT'])
def deactivate_employee(employee_id):
    """Deactivates an employee (soft delete)."""
    end_date = datetime.now().strftime('%Y-%m-%d')
    conn = get_db_connection()
    conn.execute("UPDATE employees SET is_active = 0, end_date = ? WHERE id = ?", (end_date, employee_id))
    conn.commit()
    conn.close()
    socketio.emit('employee_deactivated', {'id': employee_id})
    return jsonify({'message': f'Employee {employee_id} deactivated'})

@api_bp.route('/dashboard/kpis', methods=['GET'])
def get_kpis():
    """Calculates and returns key performance indicators."""
    conn = get_db_connection()
    total_employees = conn.execute('SELECT COUNT(*) FROM employees WHERE is_active = 1').fetchone()[0]
    thirty_days_ago = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
    new_hires = conn.execute('SELECT COUNT(*) FROM employees WHERE start_date >= ?', (thirty_days_ago,)).fetchone()[0]
    departures = conn.execute('SELECT COUNT(*) FROM employees WHERE is_active = 0 AND end_date >= ?', (thirty_days_ago,)).fetchone()[0]
    conn.close()
    return jsonify({"totalEmployees": total_employees, "newHires": new_hires, "departures": departures})

@api_bp.route('/dashboard/department-breakdown', methods=['GET'])
def get_department_breakdown():
    """Returns the count of employees per department."""
    conn = get_db_connection()
    breakdown = conn.execute("SELECT department, COUNT(*) as count FROM employees WHERE is_active = 1 GROUP BY department").fetchall()
    conn.close()
    return jsonify([dict(row) for row in breakdown])

# ===================================================================
# 2. SOCKET.IO REAL-TIME EVENT HANDLERS
# ===================================================================

@socketio.on('connect')
def handle_connect():
    """Triggered when a frontend client connects to the socket."""
    print(f"Client connected: {request.sid}")
    emit('response', {'data': 'Successfully connected to the backend!'})

@socketio.on('disconnect')
def handle_disconnect():
    """Triggered when a client disconnects."""
    print(f"Client disconnected: {request.sid}")