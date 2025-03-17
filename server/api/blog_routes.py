# api/blog_routes.py - Blog related routes
from flask import request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import desc, func, or_
from . import api_bp
from extensions import db
from models.blog import BlogPost, BlogTag, BlogPostTag, BlogComment, BlogSubscriber
from datetime import datetime
import re

# Helper function to generate slug from title
def generate_slug(title):
    # Convert to lowercase and replace spaces with hyphens
    slug = re.sub(r'[^\w\s-]', '', title.lower())
    slug = re.sub(r'[\s_-]+', '-', slug)
    slug = re.sub(r'^-+|-+$', '', slug)
    return slug

# Helper function to sanitize sort parameter
def parse_sort_param(sort_param):
    valid_fields = ['created_at', 'updated_at', 'published_at', 'view_count', 'title']
    valid_directions = ['asc', 'desc']
    
    if '_' in sort_param:
        field, direction = sort_param.split('_')
        if field in valid_fields and direction in valid_directions:
            return field, direction
    
    # Default to date descending if invalid
    return 'published_at', 'desc'

@api_bp.route('/blog/posts', methods=['GET'])
def get_blog_posts():
    """Fetch blog posts with filtering, sorting, and pagination"""
    try:
        # Get query parameters
        search = request.args.get('search', '')
        page = int(request.args.get('page', 1))
        limit = min(int(request.args.get('limit', 9)), 50)  # Cap at 50 to prevent abuse
        tags = request.args.get('tags', '')
        sort_param = request.args.get('sort', 'date_desc')
        
        # Parse tags (comma-separated string to list)
        tag_list = tags.split(',') if tags else []
        
        # Base query - only published posts
        query = BlogPost.query.filter(BlogPost.status == 'published')
        
        # Apply search filter if provided
        if search:
            search_term = f"%{search}%"
            query = query.filter(or_(
                BlogPost.title.ilike(search_term),
                BlogPost.content.ilike(search_term),
                BlogPost.excerpt.ilike(search_term)
            ))
        
        # Apply tag filter if provided
        if tag_list:
            query = query.join(BlogPostTag).join(BlogTag).filter(
                BlogTag.id.in_(tag_list) if tag_list[0].startswith('uuid') else BlogTag.slug.in_(tag_list)
            )
        
        # Apply sorting
        sort_field, sort_direction = parse_sort_param(sort_param)
        if sort_field == 'date':
            sort_field = 'published_at'
            
        if sort_direction == 'desc':
            query = query.order_by(desc(getattr(BlogPost, sort_field)))
        else:
            query = query.order_by(getattr(BlogPost, sort_field))
        
        # Apply pagination
        paginated_posts = query.paginate(page=page, per_page=limit, error_out=False)
        
        # Format results
        posts = [post.to_dict() for post in paginated_posts.items]
        
        # Return response with pagination metadata
        return jsonify({
            'posts': posts,
            'pagination': {
                'total': paginated_posts.total,
                'pages': paginated_posts.pages,
                'page': page,
                'limit': limit,
                'has_next': paginated_posts.has_next,
                'has_prev': paginated_posts.has_prev
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error fetching blog posts: {str(e)}")
        return jsonify({'error': 'An error occurred processing your request'}), 500

@api_bp.route('/blog/tags', methods=['GET'])
def get_blog_tags():
    """Fetch all available tags for blog posts"""
    try:
        tags = BlogTag.query.all()
        return jsonify({
            'tags': [tag.to_dict() for tag in tags]
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error fetching blog tags: {str(e)}")
        return jsonify({'error': 'An error occurred processing your request'}), 500

@api_bp.route('/blog/posts/<string:slug>', methods=['GET'])
def get_blog_post_by_slug(slug):
    """Fetch a single blog post by slug"""
    try:
        post = BlogPost.query.filter_by(slug=slug).first()
        
        if not post:
            return jsonify({'error': 'Blog post not found'}), 404
        
        # Include tags in the response
        post_data = post.to_dict(include_tags=True)
        
        return jsonify({
            'post': post_data
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error fetching blog post {slug}: {str(e)}")
        return jsonify({'error': 'An error occurred processing your request'}), 500

@api_bp.route('/blog/posts/<string:post_id>/related', methods=['GET'])
def get_related_posts(post_id):
    """Fetch related blog posts based on a post's tags"""
    try:
        limit = min(int(request.args.get('limit', 3)), 10)  # Cap at 10
        
        # Get the post
        post = BlogPost.query.get(post_id)
        if not post:
            return jsonify({'error': 'Blog post not found'}), 404
        
        # Get the post's tags
        post_tags = [tag.id for tag in post.tags]
        
        if not post_tags:
            # If no tags, return recent posts
            related_posts = BlogPost.query.filter(
                BlogPost.id != post_id,
                BlogPost.status == 'published'
            ).order_by(desc(BlogPost.published_at)).limit(limit).all()
        else:
            # Find posts with matching tags
            related_posts = BlogPost.query.join(BlogPostTag).filter(
                BlogPost.id != post_id,
                BlogPost.status == 'published',
                BlogPostTag.tag_id.in_(post_tags)
            ).group_by(BlogPost.id).order_by(
                desc(func.count(BlogPostTag.tag_id)),
                desc(BlogPost.published_at)
            ).limit(limit).all()
        
        return jsonify({
            'posts': [post.to_dict() for post in related_posts]
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error fetching related posts: {str(e)}")
        return jsonify({'error': 'An error occurred processing your request'}), 500

@api_bp.route('/blog/posts/<string:post_id>/view', methods=['POST'])
def increment_view_count(post_id):
    """Increment view count for a blog post"""
    try:
        post = BlogPost.query.get(post_id)
        if not post:
            return jsonify({'error': 'Blog post not found'}), 404
        
        # Increment view count
        post.view_count += 1
        db.session.commit()
        
        return jsonify({
            'success': True,
            'view_count': post.view_count
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error incrementing view count: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'An error occurred processing your request'}), 500

@api_bp.route('/blog/posts/<string:post_id>/comments', methods=['GET'])
def get_comments(post_id):
    """Fetch comments for a blog post"""
    try:
        post = BlogPost.query.get(post_id)
        if not post:
            return jsonify({'error': 'Blog post not found'}), 404
        
        # Get parent comments first (where parent_id is null)
        parent_comments = BlogComment.query.filter_by(
            post_id=post_id,
            parent_id=None,
            is_approved=True
        ).order_by(desc(BlogComment.created_at)).all()
        
        # Format comments with replies
        formatted_comments = []
        for comment in parent_comments:
            comment_dict = comment.to_dict()
            # Get replies for this comment
            replies = BlogComment.query.filter_by(
                parent_id=comment.id,
                is_approved=True
            ).order_by(BlogComment.created_at).all()
            comment_dict['replies'] = [reply.to_dict() for reply in replies]
            formatted_comments.append(comment_dict)
        
        return jsonify({
            'comments': formatted_comments,
            'total': len(formatted_comments)
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error fetching comments: {str(e)}")
        return jsonify({'error': 'An error occurred processing your request'}), 500

@api_bp.route('/blog/posts/<string:post_id>/comments', methods=['POST'])
def add_comment(post_id):
    """Submit a comment on a blog post"""
    try:
        data = request.get_json()
        post = BlogPost.query.get(post_id)
        
        if not post:
            return jsonify({'error': 'Blog post not found'}), 404
        
        # Check if user is authenticated
        user_id = None
        is_approved = False
        
        try:
            user_id = get_jwt_identity()
            # Auto-approve comments from authenticated users
            is_approved = True
        except:
            # Anonymous comment - requires approval
            pass
        
        # Create new comment
        comment = BlogComment(
            post_id=post_id,
            user_id=user_id,
            parent_id=data.get('parent_id'),
            content=data.get('content'),
            author_name=data.get('author_name'),
            author_email=data.get('author_email'),
            is_approved=is_approved
        )
        
        db.session.add(comment)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Comment submitted successfully',
            'comment': comment.to_dict(),
            'is_approved': is_approved
        }), 201
        
    except Exception as e:
        current_app.logger.error(f"Error submitting comment: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'An error occurred processing your request'}), 500

@api_bp.route('/blog/newsletter/subscribe', methods=['POST'])
def subscribe_newsletter():
    """Subscribe to blog newsletter"""
    try:
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        
        # Check if already subscribed
        existing = BlogSubscriber.query.filter_by(email=email).first()
        if existing:
            if existing.is_active:
                return jsonify({'message': 'Already subscribed to newsletter'}), 200
            else:
                # Reactivate subscription
                existing.is_active = True
                existing.updated_at = datetime.utcnow()
                db.session.commit()
                return jsonify({'success': True, 'message': 'Subscription reactivated'}), 200
        
        # Create new subscriber
        subscriber = BlogSubscriber(
            email=email,
            is_active=True
        )
        
        db.session.add(subscriber)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Successfully subscribed to newsletter'
        }), 201
        
    except Exception as e:
        current_app.logger.error(f"Error subscribing to newsletter: {str(e)}")
        db.session.rollback()
        return