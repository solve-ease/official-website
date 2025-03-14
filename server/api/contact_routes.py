# api/contact_routes.py - Routes for handling contact form submissions
from flask import request, jsonify, current_app
from flask_jwt_extended import jwt_required
from models.contact import Contact
from extensions import db, supabase_client
from . import api_bp
from services.email_service import send_confirmation_email
from services.email_service import send_admin_notification

@api_bp.route('/contact', methods=['POST'])
def submit_contact_form():
    """Handle contact form submission."""
    try:
        # Get form data from request
        data = request.get_json()
        # print(data)  # debug step
        
        # Validate required fields
        required_fields = ['name', 'email', 'subject', 'message']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Create new contact entry using SQLAlchemy ORM
        contact = Contact.create_from_dict(data)
        db.session.add(contact)
        db.session.commit()
        
        # Also store in Supabase if available
        if supabase_client:
            try:
                supabase_client.table('contacts').insert(contact.to_dict()).execute()
            except Exception as e:
                current_app.logger.error(f"Error storing contact in Supabase: {str(e)}")
        
        # Send confirmation email (async task)
        try:
            send_confirmation_email(data['email'], data['name'])
        except Exception as e:
            current_app.logger.error(f"Error sending confirmation email: {str(e)}")

        # Send Admin email (async task)
        try:
            send_admin_notification(data)
        except Exception as e:
            current_app.logger.error(f"Error sending confirmation email: {str(e)}")
        
        return jsonify({'success': True, 'message': 'Contact form submitted successfully'}), 201
    
    except Exception as e:
        current_app.logger.error(f"Error processing contact form: {str(e)}")
        return jsonify({'error': 'An error occurred processing your request'}), 500

@api_bp.route('/contacts', methods=['GET'])
@jwt_required()
def get_contacts():
    """Get all contact submissions (protected route)."""
    try:
        # Paginate results
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        # Get paginated contacts from database
        contacts_query = Contact.query.order_by(Contact.created_at.desc())
        contacts = contacts_query.paginate(page=page, per_page=per_page)
        
        # Format response
        results = {
            'items': [contact.to_dict() for contact in contacts.items],
            'page': contacts.page,
            'pages': contacts.pages,
            'total': contacts.total
        }
        
        return jsonify(results), 200
    
    except Exception as e:
        current_app.logger.error(f"Error retrieving contacts: {str(e)}")
        return jsonify({'error': 'An error occurred processing your request'}), 500