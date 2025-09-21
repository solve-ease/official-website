# config.py - Configuration settings for different environments
import os
from datetime import timedelta

from dotenv import load_dotenv
load_dotenv()


class Config:
    """Base configuration class with common settings."""
    SECRET_KEY = os.environ.get('SECRET_KEY')
    API_KEY = os.environ.get('API_KEY')
    
    ALLOWED_ORIGINS = os.environ.get('ALLOWED_ORIGINS', 'http://localhost:5173,https://solve-ease.vercel.app').split(',')
    
    # Supabase configuration
    SUPABASE_URL = os.environ.get('SUPABASE_URL')
    SUPABASE_KEY = os.environ.get('SUPABASE_KEY')
    S3_ACCESS_KEY_ID= os.getenv('ACCESS_KEY_ID')
    # SUPABASE_SECRET = os.getenv('ACCESS_KEY_ID')
    S3_SECRET = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
    S3_BUCKET_NAME = os.getenv('SUPABASE_BUCKET_NAME')
    S3_PUBLIC_URL = os.getenv('SUPABASE_PUBLIC_URL')
    S3_REGION = os.getenv('SUPABASE_REGION')
    
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
    
    # Development allows fallbacks for convenience
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-for-development-only')
    API_KEY = os.environ.get('API_KEY', 'dev-api-key-for-development-only')

class ProductionConfig(Config):
    """Production configuration with appropriate security settings."""
    DEBUG = False
    TESTING = False
    
    # Use stronger settings in production
    JWT_COOKIE_SECURE = True
    
    # Validate required environment variables exist
    @classmethod
    def validate(cls):
        """Validate that required environment variables are set for production."""
        if not os.environ.get('SECRET_KEY'):
            raise RuntimeError("SECRET_KEY environment variable is required in production")
        if not os.environ.get('API_KEY'):
            raise RuntimeError("API_KEY environment variable is required in production")
    
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