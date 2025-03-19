# config.py - Configuration settings for different environments
import os
from datetime import timedelta

from dotenv import load_dotenv
load_dotenv()


class Config:
    """Base configuration class with common settings."""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key')
    ALLOWED_ORIGINS = os.environ.get('ALLOWED_ORIGINS', 'http://localhost:5173,https://solve-ease.vercel.app').split(',')
    
    # Supabase configuration
    SUPABASE_URL = os.environ.get('SUPABASE_URL')
    SUPABASE_KEY = os.environ.get('SUPABASE_KEY')
    
    # JWT configuration
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', SECRET_KEY)
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=2)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    JWT_TOKEN_LOCATION = ['headers']
    
    # Database configuration (using SQLAlchemy with Supabase PostgreSQL)
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
class DevelopmentConfig(Config):
    """Development configuration with debug enabled."""
    DEBUG = True

class ProductionConfig(Config):
    """Production configuration with appropriate security settings."""
    DEBUG = False
    TESTING = False
    
    # Use stronger settings in production
    JWT_COOKIE_SECURE = True
    
class TestingConfig(Config):
    """Testing configuration for automated tests."""
    TESTING = True
    DEBUG = True
    
# Configuration mapping for different environments
config_by_name = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig
}