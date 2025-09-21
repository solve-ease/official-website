# security/decorators.py - Security decorators and utilities
from functools import wraps
from flask import request, jsonify, current_app
import time
from collections import defaultdict, deque
import hashlib

# Simple in-memory rate limiting (for production, use Redis)
rate_limit_storage = defaultdict(deque)

def require_api_key(f):
    """
    Decorator to require API key authentication.
    API key should be sent in X-API-Key header.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        api_key = request.headers.get('X-API-Key')
        
        if not api_key:
            return jsonify({
                'error': 'API key required',
                'message': 'Please provide X-API-Key header'
            }), 401
        
        expected_key = current_app.config.get('API_KEY')
        if not expected_key or api_key != expected_key:
            current_app.logger.warning(f"Invalid API key attempt from {request.remote_addr}")
            return jsonify({
                'error': 'Invalid API key',
                'message': 'Unauthorized access'
            }), 401
            
        return f(*args, **kwargs)
    return decorated_function

def rate_limit(max_requests=15, window_minutes=15):
    """
    Rate limiting decorator.
    Limits requests per IP address.
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Get client IP
            client_ip = request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr)
            if client_ip and ',' in client_ip:
                client_ip = client_ip.split(',')[0].strip()
            
            # Create a key for this IP and endpoint
            key = f"{client_ip}:{request.endpoint}"
            current_time = time.time()
            window_start = current_time - (window_minutes * 60)
            
            # Clean old entries
            while rate_limit_storage[key] and rate_limit_storage[key][0] < window_start:
                rate_limit_storage[key].popleft()
            
            # Check if limit exceeded
            if len(rate_limit_storage[key]) >= max_requests:
                return jsonify({
                    'error': 'Rate limit exceeded',
                    'message': f'Maximum {max_requests} requests per {window_minutes} minutes',
                    'retry_after': int(rate_limit_storage[key][0] + (window_minutes * 60) - current_time)
                }), 429
            
            # Add current request
            rate_limit_storage[key].append(current_time)
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def validate_origin(f):
    """
    Decorator to validate request origin.
    Checks if the request comes from an allowed origin.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        origin = request.headers.get('Origin')
        referer = request.headers.get('Referer')
        
        allowed_origins = current_app.config.get('ALLOWED_ORIGINS', [])
        
        # Allow requests with no origin (direct API calls, mobile apps, etc.)
        if not origin and not referer:
            return f(*args, **kwargs)
        
        # Check origin
        if origin and origin not in allowed_origins:
            current_app.logger.warning(f"Blocked request from unauthorized origin: {origin}")
            return jsonify({
                'error': 'Unauthorized origin',
                'message': 'Request not allowed from this domain'
            }), 403
        
        # Check referer as backup
        if referer:
            referer_valid = any(referer.startswith(allowed_origin) for allowed_origin in allowed_origins)
            if not referer_valid:
                current_app.logger.warning(f"Blocked request with invalid referer: {referer}")
                return jsonify({
                    'error': 'Unauthorized referer',
                    'message': 'Request not allowed from this domain'
                }), 403
        
        return f(*args, **kwargs)
    return decorated_function

def check_honeypot(f):
    """
    Decorator to check for honeypot fields.
    Bots often fill hidden fields that humans shouldn't see.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        data = request.get_json() or {}
        
        # Check for common honeypot field names
        honeypot_fields = ['website', 'url', 'homepage', 'bot_field', 'honeypot']
        
        for field in honeypot_fields:
            if field in data and data[field]:
                current_app.logger.warning(f"Honeypot triggered from {request.remote_addr}: {field} = {data[field]}")
                return jsonify({
                    'error': 'Invalid submission',
                    'message': 'Please try again'
                }), 400
        
        return f(*args, **kwargs)
    return decorated_function

def security_headers(f):
    """
    Decorator to add security headers to responses.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        response = f(*args, **kwargs)
        
        # Convert to Response object if it's a tuple
        if isinstance(response, tuple):
            from flask import make_response
            response = make_response(response)
        
        # Add security headers
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'DENY'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
        
        return response
    return decorated_function
