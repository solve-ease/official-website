# api/auth_routes.py - Authentication routes for JWT tokens
from flask import request, jsonify, current_app
from flask_jwt_extended import (
    create_access_token, create_refresh_token, 
    jwt_required, get_jwt_identity
)
from werkzeug.security import generate_password_hash, check_password_hash
from models.user import User
from extensions import db
from . import api_bp

@api_bp.route('/auth/register', methods=['POST'])
def register():
    """Register a new user."""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['username', 'email', 'password']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Check if user already exists
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already exists'}), 409
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already exists'}), 409
        
        # Create new user
        user = User(
            username=data['username'],
            email=data['email'],
            password_hash=generate_password_hash(data['password'])
        )
        
        db.session.add(user)
        db.session.commit()
        
       # Generate tokens
        access_token = create_access_token(identity=str(user.id))  # Convert user.id to string
        refresh_token = create_refresh_token(identity=str(user.id))  # Convert user.id to string

        return jsonify({
            'success': True,
            'message': 'User registered successfully',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        current_app.logger.error(f"Error registering user: {str(e)}")
        return jsonify({'error': 'An error occurred processing your request'}), 500


# def login():
#     """Login a user and return JWT tokens."""
#     try:
#         data = request.get_json()
        
#         # Get user by email
#         user = User.query.filter_by(email=data.get('email')).first()
        
#         # Check if user exists and password is correct
#         if not user or not check_password_hash(user.password_hash, data.get('password', '')):
#             return jsonify({'error': 'Invalid email or password'}), 401
        
#         # Generate tokens
#         access_token = create_access_token(identity=user.id)
#         refresh_token = create_refresh_token(identity=user.id)
        
#         return jsonify({
#             'access_token': access_token,
#             'refresh_token': refresh_token,
#             'user': user.to_dict()
#         }), 200
        
#     except Exception as e:
#         current_app.logger.error(f"Error logging in user: {str(e)}")
#         return jsonify({'error': 'An error occurred processing your request'}), 500

@api_bp.route('/auth/login', methods=['POST'])
def login():
    """Login a user and return JWT tokens."""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400

        # Get user by email
        user = User.query.filter_by(email=data.get('email')).first()
        
        # Check if user exists and password is correct
        if not user or not check_password_hash(user.password_hash, data.get('password', '')):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Generate tokens (ensure identity is a string)
        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))

        # debug step
        print(access_token)
        
        return jsonify({
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error logging in user: {str(e)}")
        return jsonify({'error': 'An error occurred processing your request'}), 500

@api_bp.route('/auth/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh an access token using a refresh token."""
    try:
        # Get user ID from refresh token
        user_id = get_jwt_identity()
        
        # Create new access token
        access_token = create_access_token(identity=user_id)
        
        return jsonify({'access_token': access_token}), 200
        
    except Exception as e:
        current_app.logger.error(f"Error refreshing token: {str(e)}")
        return jsonify({'error': 'An error occurred processing your request'}), 500
    

