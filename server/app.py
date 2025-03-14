
from flask import Flask
from flask_cors import CORS
from config import Config
from api import api_bp
from extensions import db, jwt

def create_app(config_class=Config):
    """
    Factory pattern to create a Flask application with all configurations
    and extensions registered.
    """
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    CORS(app, resources={r"/api/*": {"origins": app.config['ALLOWED_ORIGINS']}})
    db.init_app(app)
    jwt.init_app(app)
    
    # Register blueprints
    app.register_blueprint(api_bp, url_prefix='/api')
    
    @app.route('/')
    def health_check():
        return {"status": "healthy", "message": "Flask backend is running"}, 200
    
    return app

# For Vercel deployment
app = create_app()

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)