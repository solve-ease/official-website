

from flask import request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
import uuid
from werkzeug.utils import secure_filename
from supabase import create_client, Client

from . import api_bp

def get_supabase_client():
    """Initialize and return a Supabase client"""
    url = current_app.config['SUPABASE_URL']
    key = current_app.config['S3_SECRET']
    return create_client(url, key)

def allowed_file(filename):
    """Check if the file extension is allowed"""
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@api_bp.route('/uploads/image', methods=['POST'])
@jwt_required()
def upload_image():
    """
    Upload an image to Supabase storage and return the public URL
    """
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image part in the request'}), 400
        
        file = request.files['image']

        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            unique_filename = f"{uuid.uuid4()}_{filename}"
            current_user = get_jwt_identity()
            object_path = f"blog-uploads/{unique_filename}"

            # Save temporarily
            temp_path = os.path.join('/tmp', unique_filename)
            file.save(temp_path)

            try:
                supabase: Client = get_supabase_client()
                bucket_name = current_app.config['S3_BUCKET_NAME']

                with open(temp_path, "rb") as f:
                    response = supabase.storage.from_(bucket_name).upload(object_path, f, {
                        "content-type": file.content_type,
                        "x-upsert": "true"
                    })

                # Clean up temp file
                os.remove(temp_path)

                # Get public URL
                public_url = supabase.storage.from_(bucket_name).get_public_url(object_path)

                return jsonify({
                    'success': True,
                    'imageUrl': public_url,
                    'message': 'Image uploaded successfully'
                }), 200

            except Exception as e:
                current_app.logger.error(f"Supabase upload error: {e}")
                if os.path.exists(temp_path):
                    os.remove(temp_path)
                return jsonify({'error': 'Failed to upload to Supabase'}), 500

        else:
            return jsonify({'error': 'File type not allowed'}), 400

    except Exception as e:
        current_app.logger.error(f"Upload error: {e}")
        return jsonify({'error': 'An error occurred during upload'}), 500
