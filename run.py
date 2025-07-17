# hrdash/run.py

# Import the factory function to create the app
from app import create_app

# Import the socketio instance directly from extensions
from extensions import socketio

# Create the Flask app instance using the factory
app = create_app()

if __name__ == '__main__':
    try:
        # Use the imported socketio instance to run the app with Eventlet
        print("Starting server with Eventlet and Socket.IO...")
        socketio.run(app, host='0.0.0.0', port=5000, allow_unsafe_werkzeug=True)
    finally:
        # This ensures that the database connection is closed when the app shuts down
        with app.app_context():
            from database import close_db
            close_db()