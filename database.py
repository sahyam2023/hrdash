# hrdash/database.py

import sqlite3
from flask import g
from config import DevelopmentConfig

# Get database name from the config file
DATABASE_NAME = DevelopmentConfig.DATABASE_NAME

def get_db_connection():
    """
    Establishes a connection to the SQLite database, reusing the connection if it already exists for the current request.
    The connection object is configured to return rows that can be accessed by column name.
    """
    if 'db_conn' not in g:
        # If no connection exists for the current request, create one
        g.db_conn = sqlite3.connect(DATABASE_NAME, timeout=10) # Added timeout
        g.db_conn.row_factory = sqlite3.Row
    return g.db_conn

def close_db(e=None):
    """
    Closes the database connection if it exists for the current request.
    This function is intended to be registered with Flask's app teardown context.
    """
    db = g.pop('db_conn', None)
    if db is not None:
        db.close()

def create_database_table():
    """
    Creates the 'employees', 'departments', and 'job_titles' tables if they don't already exist.
    This function should be called once at application startup.
    """
    print("Attempting to create database table if not exists...")
    # Use a 'with' statement to ensure the connection is closed even if errors occur
    with sqlite3.connect(DATABASE_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS employees (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                job_title TEXT NOT NULL,
                department TEXT NOT NULL,
                start_date TEXT NOT NULL,
                end_date TEXT,
                is_active BOOLEAN NOT NULL DEFAULT 1,
                salary REAL NOT NULL DEFAULT 0
            )
        """)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS departments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE
            )
        """)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS job_titles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE
            )
        """)
        conn.commit()
    print("Table check complete.")