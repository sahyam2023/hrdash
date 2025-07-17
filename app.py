# hrdash/app.py

from flask import Flask, jsonify
import logging
from logging.handlers import RotatingFileHandler

# Import the extension instances that were created in extensions.py
from extensions import socketio, cors

from database import create_database_table
from config import config_by_name

def create_app(config_name='development'):
    """
    Application Factory Function.

    This function is designed to be fully compatible with the 'flask run' command
    by only creating and returning the Flask app instance.

    The 'run.py' script will use this factory and then use the imported
    'socketio' instance to run the application with a different server.
    """
    app = Flask(__name__)
    
    # --- 1. Load Configuration ---
    # Load settings from the config.py file based on the environment
    # (e.g., 'development' or 'production').
    app.config.from_object(config_by_name[config_name])

    # --- 2. Initialize Extensions with the App ---
    # This step binds the extensions (like CORS and SocketIO) to our
    # specific Flask app instance.
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})
    socketio.init_app(app, cors_allowed_origins="*")

    # --- 3. Database Initialization ---
    # By running this within the app context, we ensure the app is fully
    # configured before any database operations are performed.
    with app.app_context():
        create_database_table()

    # --- 4. Register Blueprints ---
    # Blueprints are imported here, inside the factory, to prevent
    # circular dependencies that can occur when routes need access to
    # parts of the application.
    from routes import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    # --- 5. Setup Logging and Error Handlers ---
    # Configure file-based logging for production environments.
    if not app.debug and not app.testing:
        handler = RotatingFileHandler('app.log', maxBytes=10240, backupCount=10)
        handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
        ))
        handler.setLevel(logging.INFO)
        app.logger.addHandler(handler)
        app.logger.setLevel(logging.INFO)
        app.logger.info('HR Dashboard application startup')

    # Define consistent JSON responses for common HTTP errors.
    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(500)
    def internal_error(error):
        app.logger.error(f"Internal Server Error: {error}")
        return jsonify({"error": "An internal server error occurred"}), 500
    
    # --- 6. Return ONLY the App Instance ---
    # This is the crucial step that makes the factory compatible with the
    # 'flask run' command, which expects the factory to return just the app.
    return app