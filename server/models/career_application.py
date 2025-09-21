# Models for career applications
from datetime import datetime
from extensions import db
import uuid

class CareerApplication(db.Model):
    """Career application model for job applications."""
    __tablename__ = 'career_applications'
    
    id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.String(36), unique=True, nullable=False, default=lambda: str(uuid.uuid4()))
    
    # Mandatory fields (first step)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    contact_number = db.Column(db.String(20), nullable=False)  # E.164 format preferred
    
    # Optional fields (second step)
    total_experience = db.Column(db.Integer, nullable=True)  # Years of total experience
    ts_experience = db.Column(db.Integer, nullable=True)     # Years of TypeScript experience
    react_experience = db.Column(db.Integer, nullable=True)  # Years of React/Next experience
    portfolio_url = db.Column(db.String(500), nullable=True)
    github_url = db.Column(db.String(500), nullable=True)
    linkedin_url = db.Column(db.String(500), nullable=True)
    cover_note = db.Column(db.Text, nullable=True)           # 200-300 chars cover message
    
    # Status and metadata
    status = db.Column(db.String(20), default='pending')    # pending, reviewing, shortlisted, rejected, hired
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convert model to dictionary."""
        return {
            'id': self.id,
            'application_id': self.application_id,
            'full_name': self.full_name,
            'email': self.email,
            'contact_number': self.contact_number,
            'total_experience': self.total_experience,
            'ts_experience': self.ts_experience,
            'react_experience': self.react_experience,
            'portfolio_url': self.portfolio_url,
            'github_url': self.github_url,
            'linkedin_url': self.linkedin_url,
            'cover_note': self.cover_note,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def to_public_dict(self):
        """Convert model to public dictionary (excluding sensitive info)."""
        return {
            'application_id': self.application_id,
            'full_name': self.full_name,
            'email': self.email,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    @classmethod
    def create_from_dict(cls, data):
        """Create a new career application from dictionary data."""
        application = cls(
            full_name=data.get('full_name'),
            email=data.get('email'),
            contact_number=data.get('contact_number'),
            total_experience=data.get('total_experience'),
            ts_experience=data.get('ts_experience'),
            react_experience=data.get('react_experience'),
            portfolio_url=data.get('portfolio_url'),
            github_url=data.get('github_url'),
            linkedin_url=data.get('linkedin_url'),
            cover_note=data.get('cover_note')
        )
        return application
