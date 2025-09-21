# services/supabase_service.py - Service for Supabase operations
from flask import current_app

class SupabaseService:
    """
    Service class for interacting with Supabase.
    Provides methods for common operations on tables.
    """
    
    @staticmethod
    def get_client():
        """
        Get the Supabase client if initialized.
        
        Returns:
            The Supabase client or None if not initialized
        """
        from extensions import supabase_client
        if not supabase_client:
            current_app.logger.warning("Supabase client not initialized")
        return supabase_client
    
    @classmethod
    def insert_contact(cls, contact_data):
        """
        Insert a new contact into Supabase.
        
        Args:
            contact_data (dict): Contact form data
            
        Returns:
            dict: Response from Supabase
        """
        client = cls.get_client()
        if not client:
            return None
            
        try:
            response = client.table('contacts').insert(contact_data).execute()
            return response.data
        except Exception as e:
            current_app.logger.error(f"Error inserting contact into Supabase: {str(e)}")
            return None
    
    @classmethod
    def get_contacts(cls, page=1, page_size=20):
        """
        Get contacts with pagination.
        
        Args:
            page (int): Page number (1-indexed)
            page_size (int): Number of items per page
            
        Returns:
            dict: Paginated contacts data
        """
        client = cls.get_client()
        if not client:
            return None
            
        try:
            # Calculate range for pagination
            start = (page - 1) * page_size
            end = start + page_size - 1
            
            response = (client.table('contacts')
                        .select('*')
                        .order('created_at', desc=True)
                        .range(start, end)
                        .execute())
            
            # Get total count for pagination info
            count_response = client.table('contacts').select('count', count='exact').execute()
            total = count_response.count or 0
            
            return {
                'items': response.data,
                'page': page,
                'page_size': page_size,
                'total': total,
                'pages': (total + page_size - 1) // page_size
            }
        except Exception as e:
            current_app.logger.error(f"Error getting contacts from Supabase: {str(e)}")
            return None
    
    @classmethod
    def get_contact_by_id(cls, contact_id):
        """
        Get a specific contact by ID.
        
        Args:
            contact_id (str): The contact ID
            
        Returns:
            dict: Contact data or None if not found
        """
        client = cls.get_client()
        if not client:
            return None
            
        try:
            response = (client.table('contacts')
                        .select('*')
                        .eq('id', contact_id)
                        .limit(1)
                        .execute())
            
            if response.data and len(response.data) > 0:
                return response.data[0]
            return None
        except Exception as e:
            current_app.logger.error(f"Error getting contact from Supabase: {str(e)}")
            return None
    
    @classmethod
    def update_contact(cls, contact_id, update_data):
        """
        Update an existing contact.
        
        Args:
            contact_id (str): The contact ID
            update_data (dict): Data to update
            
        Returns:
            dict: Updated contact data or None if failed
        """
        client = cls.get_client()
        if not client:
            return None
            
        try:
            response = (client.table('contacts')
                        .update(update_data)
                        .eq('id', contact_id)
                        .execute())
            
            if response.data and len(response.data) > 0:
                return response.data[0]
            return None
        except Exception as e:
            current_app.logger.error(f"Error updating contact in Supabase: {str(e)}")
            return None
    
    @classmethod
    def delete_contact(cls, contact_id):
        """
        Delete a contact by ID.
        
        Args:
            contact_id (str): The contact ID
            
        Returns:
            bool: True if successful, False otherwise
        """
        client = cls.get_client()
        if not client:
            return False
            
        try:
            response = (client.table('contacts')
                        .delete()
                        .eq('id', contact_id)
                        .execute())
            
            return bool(response.data)
        except Exception as e:
            current_app.logger.error(f"Error deleting contact from Supabase: {str(e)}")
            return False
    
    # Career Application methods
    @classmethod
    def insert_career_application(cls, application_data):
        """
        Insert a new career application into Supabase.
        
        Args:
            application_data (dict): Career application data
            
        Returns:
            dict: Response from Supabase
        """
        client = cls.get_client()
        if not client:
            return None
            
        try:
            response = client.table('career_applications').insert(application_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            current_app.logger.error(f"Error inserting career application into Supabase: {str(e)}")
            return None
    
    @classmethod
    def get_career_application_by_email(cls, email):
        """
        Get a career application by email.
        
        Args:
            email (str): The applicant's email
            
        Returns:
            dict: Application data or None if not found
        """
        client = cls.get_client()
        if not client:
            return None
            
        try:
            response = (client.table('career_applications')
                        .select('*')
                        .eq('email', email)
                        .limit(1)
                        .execute())
            
            if response.data and len(response.data) > 0:
                return response.data[0]
            return None
        except Exception as e:
            current_app.logger.error(f"Error getting career application from Supabase: {str(e)}")
            return None
    
    @classmethod
    def get_career_application_by_id(cls, application_id):
        """
        Get a career application by application ID.
        
        Args:
            application_id (str): The application ID
            
        Returns:
            dict: Application data or None if not found
        """
        client = cls.get_client()
        if not client:
            return None
            
        try:
            response = (client.table('career_applications')
                        .select('*')
                        .eq('application_id', application_id)
                        .limit(1)
                        .execute())
            
            if response.data and len(response.data) > 0:
                return response.data[0]
            return None
        except Exception as e:
            current_app.logger.error(f"Error getting career application from Supabase: {str(e)}")
            return None
    
    @classmethod
    def get_career_applications(cls, page=1, page_size=20, status_filter=None):
        """
        Get career applications with pagination and optional status filter.
        
        Args:
            page (int): Page number (1-indexed)
            page_size (int): Number of items per page
            status_filter (str): Optional status to filter by
            
        Returns:
            dict: Paginated applications data
        """
        client = cls.get_client()
        if not client:
            return None
            
        try:
            # Calculate range for pagination
            start = (page - 1) * page_size
            end = start + page_size - 1
            
            query = client.table('career_applications').select('*')
            
            if status_filter:
                query = query.eq('status', status_filter)
            
            response = (query
                        .order('created_at', desc=True)
                        .range(start, end)
                        .execute())
            
            # Get total count for pagination info
            count_query = client.table('career_applications').select('count', count='exact')
            if status_filter:
                count_query = count_query.eq('status', status_filter)
            
            count_response = count_query.execute()
            total = count_response.count or 0
            
            return {
                'items': response.data,
                'page': page,
                'page_size': page_size,
                'total': total,
                'pages': (total + page_size - 1) // page_size
            }
        except Exception as e:
            current_app.logger.error(f"Error getting career applications from Supabase: {str(e)}")
            return None
    
    @classmethod
    def update_career_application_status(cls, application_id, status):
        """
        Update the status of a career application.
        
        Args:
            application_id (str): The application ID
            status (str): New status
            
        Returns:
            dict: Updated application data or None if failed
        """
        client = cls.get_client()
        if not client:
            return None
            
        try:
            response = (client.table('career_applications')
                        .update({'status': status, 'updated_at': 'now()'})
                        .eq('application_id', application_id)
                        .execute())
            
            if response.data and len(response.data) > 0:
                return response.data[0]
            return None
        except Exception as e:
            current_app.logger.error(f"Error updating career application status in Supabase: {str(e)}")
            return None
    
    # User authentication methods that work with Supabase Auth
    @classmethod
    def create_user(cls, email, password, user_metadata=None):
        """
        Create a new user using Supabase Auth.
        
        Args:
            email (str): User's email
            password (str): User's password
            user_metadata (dict, optional): Additional user metadata
            
        Returns:
            dict: User data or None if failed
        """
        client = cls.get_client()
        if not client:
            return None
            
        try:
            auth_response = client.auth.sign_up({
                "email": email,
                "password": password,
                "options": {
                    "data": user_metadata or {}
                }
            })
            return auth_response.user
        except Exception as e:
            current_app.logger.error(f"Error creating user in Supabase: {str(e)}")
            return None
    
    @classmethod
    def sign_in_user(cls, email, password):
        """
        Sign in a user using Supabase Auth.
        
        Args:
            email (str): User's email
            password (str): User's password
            
        Returns:
            dict: Session data including tokens or None if failed
        """
        client = cls.get_client()
        if not client:
            return None
            
        try:
            auth_response = client.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            return {
                "user": auth_response.user,
                "session": auth_response.session
            }
        except Exception as e:
            current_app.logger.error(f"Error signing in user in Supabase: {str(e)}")
            return None