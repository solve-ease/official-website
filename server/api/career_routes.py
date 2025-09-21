# api/career_routes.py - Routes for handling career application submissions
from flask import request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
import re
import uuid
from datetime import datetime
from services.supabase_service import SupabaseService
from security import require_api_key, rate_limit, validate_origin, check_honeypot, security_headers
from . import api_bp

def validate_email(email):
    """Validate email format."""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone_number(phone):
    """Validate phone number format (basic validation)."""
    # Remove all non-digit characters
    digits_only = re.sub(r'\D', '', phone)
    # Check if it's between 10-15 digits (international standards)
    return len(digits_only) >= 10 and len(digits_only) <= 15

def validate_url(url):
    """Validate URL format."""
    if not url:
        return True  # Optional field
    # Basic URL validation
    url_pattern = r'^https?:\/\/[^\s/$.?#].[^\s]*$'
    return re.match(url_pattern, url, re.IGNORECASE) is not None

def validate_github_url(url):
    """Validate GitHub URL format."""
    if not url:
        return True  # Optional field
    github_pattern = r'^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$'
    return re.match(github_pattern, url, re.IGNORECASE) is not None

def validate_linkedin_url(url):
    """Validate LinkedIn URL format."""
    if not url:
        return True  # Optional field
    linkedin_pattern = r'^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$'
    return re.match(linkedin_pattern, url, re.IGNORECASE) is not None

@api_bp.route('/apply', methods=['POST'])
@security_headers
@rate_limit(max_requests=3, window_minutes=60)  # Max 3 applications per hour per IP
@validate_origin
@check_honeypot
@require_api_key
def submit_career_application():
    """Handle career application submission."""
    try:
        # Get form data from request
        data = request.get_json()
        
        # Validate required fields (step 1)
        required_fields = ['full_name', 'email', 'contact_number']
        for field in required_fields:
            if not data.get(field) or not data.get(field).strip():
                return jsonify({'error': f'Missing or empty required field: {field}'}), 400
        
        # Validate email format
        if not validate_email(data.get('email')):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Validate phone number
        if not validate_phone_number(data.get('contact_number')):
            return jsonify({'error': 'Invalid phone number format. Please provide a valid phone number with 10-15 digits.'}), 400
        
        # Validate name length
        if len(data.get('full_name').strip()) < 2:
            return jsonify({'error': 'Full name must be at least 2 characters long'}), 400
        
        # Optional field validations (step 2)
        # Validate experience fields (should be non-negative integers)
        experience_fields = ['total_experience', 'ts_experience', 'react_experience']
        for field in experience_fields:
            value = data.get(field)
            if value is not None:
                try:
                    exp_value = int(value)
                    if exp_value < 0 or exp_value > 50:  # Reasonable limits
                        return jsonify({'error': f'{field.replace("_", " ").title()} must be between 0 and 50 years'}), 400
                    data[field] = exp_value
                except (ValueError, TypeError):
                    return jsonify({'error': f'{field.replace("_", " ").title()} must be a valid number'}), 400
        
        # Validate URLs
        if data.get('portfolio_url') and not validate_url(data.get('portfolio_url')):
            return jsonify({'error': 'Invalid portfolio URL format. Please provide a valid URL starting with http:// or https://'}), 400
        
        if data.get('github_url') and not validate_github_url(data.get('github_url')):
            return jsonify({'error': 'Invalid GitHub URL format. Please provide a valid GitHub profile URL'}), 400
        
        if data.get('linkedin_url') and not validate_linkedin_url(data.get('linkedin_url')):
            return jsonify({'error': 'Invalid LinkedIn URL format. Please provide a valid LinkedIn profile URL'}), 400
        
        # Validate cover note length
        if data.get('cover_note') and len(data.get('cover_note')) > 500:
            return jsonify({'error': 'Cover note must be less than 500 characters'}), 400
        
        # Check if email already exists (prevent duplicate applications)
        existing_application = SupabaseService.get_career_application_by_email(data.get('email'))
        if existing_application:
            return jsonify({
                'error': 'An application with this email already exists',
                'application_id': existing_application.get('application_id')
            }), 409
        
        # Clean and format phone number (store in a consistent format)
        clean_phone = re.sub(r'\D', '', data.get('contact_number'))
        if not clean_phone.startswith('+'):
            # Add a default country code if none provided (you might want to customize this)
            data['contact_number'] = '+' + clean_phone
        
        # Prepare application data for Supabase
        application_data = {
            'application_id': str(uuid.uuid4()),
            'full_name': data.get('full_name').strip(),
            'email': data.get('email').lower().strip(),
            'contact_number': data['contact_number'],
            'total_experience': data.get('total_experience'),
            'ts_experience': data.get('ts_experience'),
            'react_experience': data.get('react_experience'),
            'portfolio_url': data.get('portfolio_url'),
            'github_url': data.get('github_url'),
            'linkedin_url': data.get('linkedin_url'),
            'cover_note': data.get('cover_note'),
            'status': 'pending',
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat()
        }
        
        # Insert into Supabase
        application = SupabaseService.insert_career_application(application_data)
        
        if not application:
            return jsonify({
                'error': 'Failed to save application. Please try again.'
            }), 500
        
        # Return success response with application ID
        return jsonify({
            'success': True,
            'message': 'Application submitted successfully!',
            'application_id': application.get('application_id'),
            'instructions': 'Please email your resume to careers@solveease.tech with your application ID and cover message.'
        }), 201
        
    except Exception as e:
        # Log the error for debugging
        current_app.logger.error(f"Error submitting career application: {str(e)}")
        
        return jsonify({
            'error': 'An internal error occurred while processing your application. Please try again.',
            'details': str(e) if current_app.debug else None
        }), 500

@api_bp.route('/apply/<application_id>', methods=['GET'])
@security_headers
@rate_limit(max_requests=10, window_minutes=15)  # Max 10 lookups per 15 minutes per IP
def get_career_application(application_id):
    """Get career application details by application ID (public info only)."""
    try:
        application = SupabaseService.get_career_application_by_id(application_id)
        
        if not application:
            return jsonify({'error': 'Application not found'}), 404
        
        # Return only public information
        public_data = {
            'application_id': application.get('application_id'),
            'full_name': application.get('full_name'),
            'email': application.get('email'),
            'status': application.get('status'),
            'created_at': application.get('created_at')
        }
        
        return jsonify({
            'success': True,
            'application': public_data
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error fetching career application: {str(e)}")
        return jsonify({
            'error': 'An error occurred while fetching the application'
        }), 500

@api_bp.route('/apply', methods=['GET'])
@jwt_required()
def list_career_applications():
    """List all career applications (admin only)."""
    try:
        # You might want to add role-based access control here
        user_id = get_jwt_identity()
        
        # Get query parameters for pagination and filtering
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 10, type=int), 100)
        status_filter = request.args.get('status')
        
        # Get applications from Supabase
        result = SupabaseService.get_career_applications(
            page=page, 
            page_size=per_page, 
            status_filter=status_filter
        )
        
        if result is None:
            return jsonify({
                'error': 'Failed to fetch applications'
            }), 500
        
        return jsonify({
            'success': True,
            'applications': result['items'],
            'pagination': {
                'page': result['page'],
                'pages': result['pages'],
                'per_page': result['page_size'],
                'total': result['total']
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error listing career applications: {str(e)}")
        return jsonify({
            'error': 'An error occurred while fetching applications'
        }), 500

@api_bp.route('/apply/<application_id>/status', methods=['PUT'])
@jwt_required()
def update_application_status(application_id):
    """Update the status of a career application (admin only)."""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data.get('status'):
            return jsonify({'error': 'Status is required'}), 400
        
        valid_statuses = ['pending', 'reviewing', 'shortlisted', 'rejected', 'hired']
        if data.get('status') not in valid_statuses:
            return jsonify({'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'}), 400
        
        # Update status in Supabase
        updated_application = SupabaseService.update_career_application_status(
            application_id, 
            data.get('status')
        )
        
        if not updated_application:
            return jsonify({'error': 'Application not found or update failed'}), 404
        
        return jsonify({
            'success': True,
            'message': 'Application status updated successfully',
            'application': updated_application
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error updating application status: {str(e)}")
        return jsonify({
            'error': 'An error occurred while updating the application'
        }), 500
