from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
import postgrest

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()

# Supabase client setup will be done at application runtime
supabase_client = None

def init_supabase(app):
    """Initialize Supabase client with credentials from app config."""
    global supabase_client
    from supabase import create_client
    
    url = app.config['SUPABASE_URL']
    key = app.config['SUPABASE_KEY']
    
    if url and key:
        supabase_client = create_client(url, key)
        return supabase_client
    else:
        app.logger.warning("Supabase URL or key not provided. Supabase functionality will not work.")
        return None