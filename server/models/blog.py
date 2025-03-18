from datetime import datetime
from extensions import db
import uuid

# class BlogPost(db.Model):
#     __tablename__ = 'blog_posts'
#     id = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     title = db.Column(db.String(255), nullable=False)
#     slug = db.Column(db.String(255), nullable=False, unique=True)
#     content = db.Column(db.Text, nullable=False)
#     excerpt = db.Column(db.Text)
#     featured_image = db.Column(db.String(255))
#     author_id = db.Column(db.String, db.ForeignKey('auth.users.id'))
#     published_at = db.Column(db.DateTime)
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)
#     updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
#     view_count = db.Column(db.Integer, default=0)
#     status = db.Column(db.String(20), default='draft')
#     meta_title = db.Column(db.String(255))
#     meta_description = db.Column(db.Text)
#     reading_time = db.Column(db.Integer)
#     tags = db.relationship('BlogTag', secondary='blog_post_tags', back_populates='posts')

#     def to_dict(self):
#         return {
#             'id': self.id,
#             'title': self.title,
#             'slug': self.slug,
#             'content': self.content,
#             'excerpt': self.excerpt,
#             'featured_image': self.featured_image,
#             'author_id': self.author_id,
#             'published_at': self.published_at.isoformat() if self.published_at else None,
#             'created_at': self.created_at.isoformat(),
#             'updated_at': self.updated_at.isoformat(),
#             'view_count': self.view_count,
#             'status': self.status,
#             'meta_title': self.meta_title,
#             'meta_description': self.meta_description,
#             'reading_time': self.reading_time,
#             'tags': [tag.to_dict() for tag in self.tags]
#         }
    
class BlogPost(db.Model):
    __tablename__ = 'blog_posts'
    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(255), nullable=False, unique=True)
    content = db.Column(db.Text, nullable=False)
    excerpt = db.Column(db.Text)
    featured_image = db.Column(db.String(255))
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'))  # Changed type to Integer
    published_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    view_count = db.Column(db.Integer, default=0)
    status = db.Column(db.String(20), default='draft')
    meta_title = db.Column(db.String(255))
    meta_description = db.Column(db.Text)
    reading_time = db.Column(db.Integer)
    tags = db.relationship('BlogTag', secondary='blog_post_tags', back_populates='posts')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'slug': self.slug,
            'content': self.content,
            'excerpt': self.excerpt,
            'featured_image': self.featured_image,
            'author_id': self.author_id,
            'published_at': self.published_at.isoformat() if self.published_at else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'view_count': self.view_count,
            'status': self.status,
            'meta_title': self.meta_title,
            'meta_description': self.meta_description,
            'reading_time': self.reading_time,
            'tags': [tag.to_dict() for tag in self.tags]
        }

class BlogTag(db.Model):
    __tablename__ = 'blog_tags'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    slug = db.Column(db.String(50), nullable=False, unique=True)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    posts = db.relationship('BlogPost', secondary='blog_post_tags', back_populates='tags')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'description': self.description,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class BlogPostTag(db.Model):
    __tablename__ = 'blog_post_tags'
    post_id = db.Column(db.String, db.ForeignKey('blog_posts.id'), primary_key=True)
    tag_id = db.Column(db.String, db.ForeignKey('blog_tags.id'), primary_key=True)

class BlogComment(db.Model):
    __tablename__ = 'blog_comments'
    # id = db.Column(db.String, primary_key=True)
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    post_id = db.Column(db.String, db.ForeignKey('blog_posts.id'))
    # user_id = db.Column(db.String, db.ForeignKey('auth.users.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    parent_id = db.Column(db.String, db.ForeignKey('blog_comments.id'))
    content = db.Column(db.Text, nullable=False)
    author_name = db.Column(db.String(100))
    author_email = db.Column(db.String(255))
    is_approved = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'post_id': self.post_id,
            'user_id': self.user_id,
            'parent_id': self.parent_id,
            'content': self.content,
            'author_name': self.author_name,
            'author_email': self.author_email,
            'is_approved': self.is_approved,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class BlogSubscriber(db.Model):
    __tablename__ = 'blog_subscribers'
    # id = db.Column(db.String, primary_key=True)
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }