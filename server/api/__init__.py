# api/__init__.py - API blueprint initialization
from flask import Blueprint

api_bp = Blueprint('api', __name__)

# Import routes to register them with the blueprint
from api import contact_routes, auth_routes, blog_routes, upload_routes, career_routes