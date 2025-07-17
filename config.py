# hrdash/config.py

import os

class Config:
    """Base configuration."""
    SECRET_KEY = os.environ.get('SECRET_KEY', '24431dd886a304835cca4711fde4da8a9d021608d84d3feae3611fe5d7ea9ae3')
    DATABASE_NAME = "hr_dashboard.db"

class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True

class ProductionConfig(Config):
    """Production configuration."""
    DEBUG = False

# Dictionary to access config classes by name
config_by_name = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
}