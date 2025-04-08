from flask import request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
import uuid
import boto3
from werkzeug.utils import secure_filename
from botocore.exceptions import ClientError

from . import api_bp

# Configure Supabase storage client
def get_supabase_storage_client():
    """Initialize and return a boto3 S3 client configured for Supabase"""
    s3_client = boto3.client(
        's3',
        endpoint_url=current_app.config['S3_PUBLIC_URL'],
        aws_access_key_id=current_app.config['S3_ACCESS_KEY_ID'],
        aws_secret_access_key=current_app.config['S3_SECRET'],
        region_name=current_app.config.get('S3_REGION', 'us-east-1'),  # Default region if not set
    )
    return s3_client

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
        # Check if the post request has the file part
        if 'image' not in request.files:
            return jsonify({'error': 'No image part in the request'}), 400
        
        file = request.files['image']
        
        # If user does not select file, browser also submits an empty part without filename
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if file and allowed_file(file.filename):
            # Generate a secure filename with UUID to avoid collisions
            filename = secure_filename(file.filename)
            unique_filename = f"{uuid.uuid4()}_{filename}"
            
            # Get the current user for organizing uploads
            current_user = get_jwt_identity()
            
            # Temporary save the file
            temp_path = os.path.join('/tmp', unique_filename)
            file.save(temp_path)
            
            try:
                # Get S3 client
                s3_client = get_supabase_storage_client()
                
                # Define the bucket and folder structure
                bucket_name = current_app.config['S3_BUCKET_NAME']
                object_name = f"blog-uploads/{current_user}/{unique_filename}"
                
                # Upload file to S3
                s3_client.upload_file(
                    temp_path, 
                    bucket_name, 
                    object_name, 
                    ExtraArgs={'ACL': 'public-read', 'ContentType': file.content_type}
                )
                
                # Clean up the temp file
                os.remove(temp_path)
                
                # Generate public URL
                # Format will depend on your Supabase setup
                public_url = f"{current_app.config['S3_PUBLIC_URL']}/{bucket_name}/{object_name}"
                
                return jsonify({
                    'success': True,
                    'imageUrl': public_url,
                    'message': 'Image uploaded successfully'
                }), 200
                
            except ClientError as e:
                current_app.logger.error(f"S3 upload error: {e}")
                return jsonify({'error': 'Failed to upload to storage service'}), 500
            finally:
                # Ensure temp file is removed even if there's an error
                if os.path.exists(temp_path):
                    os.remove(temp_path)
        else:
            return jsonify({'error': 'File type not allowed'}), 400
            
    except Exception as e:
        current_app.logger.error(f"Upload error: {e}")
        return jsonify({'error': 'An error occurred during upload'}), 500