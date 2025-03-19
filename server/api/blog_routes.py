

from flask import request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func, and_, or_
from datetime import datetime
from models.blog import BlogPost, BlogTag, BlogPostTag, BlogComment, BlogSubscriber
from extensions import db
from . import api_bp
from uuid import UUID


# Add a new blog post
@api_bp.route('/blog/posts', methods=['POST'])
@jwt_required()
def create_blog_post():
    """Create a new blog post."""
    try:
        data = request.get_json()
        user_id = get_jwt_identity()  # Get the authenticated user's ID

        # Validate required fields
        required_fields = ['title', 'slug', 'content']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400

        # Check if the slug is unique
        if BlogPost.query.filter_by(slug=data['slug']).first():
            return jsonify({'error': 'Slug must be unique'}), 400

        # Create the blog post
        post = BlogPost(
            title=data['title'],
            slug=data['slug'],
            content=data['content'],
            excerpt=data.get('excerpt', ''),
            featured_image=data.get('featured_image', ''),
            author_id=user_id,
            
            # author_id = db.Column(db.String, db.ForeignKey('users.id')) , # Updated here
            published_at=datetime.utcnow() if data.get('status') == 'published' else None,
            status=data.get('status', 'draft'),
            meta_title=data.get('meta_title', ''),
            meta_description=data.get('meta_description', ''),
            reading_time=data.get('reading_time', 5)
        )

        # Add tags to the post (if provided)
        if 'tags' in data:
            for tag_id in data['tags']:
                tag = BlogTag.query.get(tag_id)
                if tag:
                    post.tags.append(tag)

        db.session.add(post)
        db.session.commit()

        return jsonify(post.to_dict()), 201

    except Exception as e:
        current_app.logger.error(f"Error creating blog post: {str(e)}")
        return jsonify({'error': 'An error occurred processing your request'}), 500

# Add a new tag
@api_bp.route('/blog/tags', methods=['POST'])
@jwt_required()
def create_tag():
    """Create a new blog tag."""
    try:
        user_id = get_jwt_identity()  # Extract user from token
        print(f"User ID from token: {user_id}")  # Debugging

        data = request.get_json()
        print(f"Received data: {data}")  # Debugging

        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401
        
  
        print(data)
        # Validate required fields
        required_fields = ['name', 'slug']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400

        # Check if the tag name or slug is unique
        if BlogTag.query.filter_by(name=data['name']).first():
            return jsonify({'error': 'Tag name must be unique'}), 400
        if BlogTag.query.filter_by(slug=data['slug']).first():
            return jsonify({'error': 'Tag slug must be unique'}), 400

        # Create the tag
        tag = BlogTag(
            name=data['name'],
            slug=data['slug'],
            description=data.get('description', '')
        )

        db.session.add(tag)
        db.session.commit()

        return jsonify(tag.to_dict()), 201

    except Exception as e:
        current_app.logger.error(f"Error creating tag: {str(e)}")
        return jsonify({'error': 'An error occurred processing your request'}), 500
    


@api_bp.route('/blog/posts', methods=['GET'])
def get_blog_posts():
    """Fetch blog posts with filtering, sorting, and pagination."""
    try:
        search = request.args.get('search', '')
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 9))
        tags = request.args.get('tags', '')
        sort = request.args.get('sort', 'date_desc')

        query = BlogPost.query

        # Apply search filter
        if search:
            query = query.filter(or_(
                BlogPost.title.ilike(f'%{search}%'),
                BlogPost.content.ilike(f'%{search}%')
            ))

        # Apply tags filter
        if tags:
            tag_ids = [tag.strip() for tag in tags.split(',')]
            query = query.join(BlogPostTag).filter(BlogPostTag.tag_id.in_(tag_ids))

        # Apply sorting
        if sort == 'date_desc':
            query = query.order_by(BlogPost.published_at.desc())
        elif sort == 'date_asc':
            query = query.order_by(BlogPost.published_at.asc())

        # Pagination
        paginated_posts = query.paginate(page=page, per_page=limit, error_out=False)
        posts = [post.to_dict() for post in paginated_posts.items]

        return jsonify({
            'posts': posts,
            'total': paginated_posts.total,
            'page': page,
            'limit': limit
        }), 200

    except Exception as e:
        current_app.logger.error(f"Error fetching blog posts: {str(e)}")
        return jsonify({'error': 'An error occurred processing your request'}), 500

@api_bp.route('/blog/tags', methods=['GET'])
def get_all_tags():
    """Fetch all available tags for blog posts."""
    try:
        tags = BlogTag.query.all()
        return jsonify([tag.to_dict() for tag in tags]), 200
    except Exception as e:
        current_app.logger.error(f"Error fetching blog tags: {str(e)}")
        return jsonify({'error': 'An error occurred processing your request'}), 500

@api_bp.route('/blog/posts/<string:slug>', methods=['GET'])
def get_blog_post_by_slug(slug):
    """Fetch a single blog post by slug."""
    try:
        post = BlogPost.query.filter_by(slug=slug).first_or_404()
        return jsonify(post.to_dict()), 200
    except Exception as e:
        current_app.logger.error(f"Error fetching blog post {slug}: {str(e)}")
        return jsonify({'error': 'An error occurred processing your request'}), 500

@api_bp.route('/blog/posts/<string:post_id>/related', methods=['GET'])
def get_related_posts(post_id):
    """Fetch related blog posts based on a post's tags or category."""
    try:
        limit = int(request.args.get('limit', 3))
        post = BlogPost.query.get_or_404(post_id)
        tag_ids = [tag.id for tag in post.tags]
        related_posts = BlogPost.query.join(BlogPostTag).filter(
            BlogPostTag.tag_id.in_(tag_ids),
            BlogPost.id != post_id
        ).limit(limit).all()
        return jsonify([post.to_dict() for post in related_posts]), 200
    except Exception as e:
        current_app.logger.error(f"Error fetching related posts: {str(e)}")
        return jsonify({'error': 'An error occurred processing your request'}), 500

@api_bp.route('/blog/posts/<string:post_id>/views', methods=['POST'])
def increment_post_view_count(post_id):
    """Increment view count for a blog post."""
    try:
        post = BlogPost.query.get_or_404(post_id)
        post.view_count += 1
        db.session.commit()
        return jsonify(post.to_dict()), 200
    except Exception as e:
        current_app.logger.error(f"Error incrementing post view count: {str(e)}")
        return jsonify({'error': 'An error occurred processing your request'}), 500



@api_bp.route('/blog/posts/<string:post_id>/comments', methods=['POST'])
@jwt_required()
def submit_comment(post_id):
    """Submit a comment on a blog post."""
    try:
        data = request.get_json()
        user_id = int(get_jwt_identity())  # Ensure user_id is an integer

        # Validate and convert post_id to UUID
        try:
            post_id = str(UUID(post_id))  # Ensure post_id is a valid UUID format
        except ValueError:
            return jsonify({'error': 'Invalid post_id format. Must be a valid UUID.'}), 400

        # Ensure parent_id (if provided) is a valid UUID
        parent_id = data.get('parent_id')
        if parent_id:
            try:
                parent_id = str(UUID(parent_id))
            except ValueError:
                return jsonify({'error': 'Invalid parent_id format. Must be a valid UUID.'}), 400

        comment = BlogComment(
            post_id=post_id,
            user_id=user_id,  # Ensure user_id is correctly formatted as an integer
            parent_id=parent_id,
            content=data['content'],
            author_name=data.get('author_name'),
            author_email=data.get('author_email')
        )

        db.session.add(comment)
        db.session.commit()
        return jsonify(comment.to_dict()), 201

    except Exception as e:
        current_app.logger.error(f"Error submitting comment: {str(e)}")
        return jsonify({'error': 'An error occurred processing your request'}), 500


@api_bp.route('/blog/posts/<string:post_id>/comments', methods=['GET'])
def get_comments(post_id):
    """Fetch comments for a blog post."""
    try:
        # print("calling for comments")
        # Validate and convert post_id to UUID
        try:
            post_id = str(UUID(post_id))
        except ValueError:
            return jsonify({'error': 'Invalid post_id format. Must be a valid UUID.'}), 400

        comments = BlogComment.query.filter_by(post_id=post_id).all()
        return jsonify([comment.to_dict() for comment in comments]), 200

    except Exception as e:
        current_app.logger.error(f"Error fetching comments: {str(e)}")
        return jsonify({'error': 'An error occurred processing your request'}), 500

@api_bp.route('/blog/newsletter/subscribe', methods=['POST'])
def subscribe_to_newsletter():
    """Subscribe to blog newsletter."""
    try:
        data = request.get_json()
        email = data['email']
        subscriber = BlogSubscriber(email=email)
        db.session.add(subscriber)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Subscribed successfully'}), 201
    except Exception as e:
        current_app.logger.error(f"Error subscribing to newsletter: {str(e)}")
        return jsonify({'error': 'An error occurred processing your request'}), 500
    

@api_bp.route('/blog/newsletter/subscribers', methods=['GET'])
@jwt_required()  
def get_subscribers():
    """Fetch the list of newsletter subscribers."""
    try:
        subscribers = BlogSubscriber.query.all()
        return jsonify([{'id': sub.id, 'email': sub.email, 'is_active': sub.is_active, 'subscribed_at': sub.created_at} for sub in subscribers]), 200
    except Exception as e:
        current_app.logger.error(f"Error fetching subscribers: {str(e)}")
        return jsonify({'error': 'An error occurred processing your request'}), 500
