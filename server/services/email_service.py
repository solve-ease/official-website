# services/email_service.py - Email sending service
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import current_app
import time
import os
import smtplib
from datetime import datetime

from dotenv import load_dotenv
load_dotenv()


def send_confirmation_email(recipient_email, recipient_name):
    """
    Send a confirmation email to the contact form submitter.
    
    Args:
        recipient_email (str): The email address of the recipient
        recipient_name (str): The name of the recipient
    """
    # Get email configuration from environment
    smtp_server = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
    smtp_port = int(os.environ.get('SMTP_PORT', 587))
    smtp_username = os.environ.get('SMTP_USERNAME', 'solveeaseofficial@gmail.com')
    smtp_password = os.environ.get('GOOGLE_APP_PASSWORD')
    sender_email = os.environ.get('GOOGLE_EMAIL', 'solveeaseofficial@gmail.com')
    sender_name = os.environ.get('SENDER_NAME', 'Solve Ease Team')
    
    # Check if SMTP password is configured
    if not smtp_password:
        current_app.logger.warning("SMTP password not set. Email service is disabled.")
        return
    
    # Create message
    msg = MIMEMultipart()
    msg['From'] = f"{sender_name} <{sender_email}>"
    msg['To'] = recipient_email
    msg['Subject'] = "Thank you for contacting Solve Ease!"
    
    # Email body
    body = f"""
    <html>
    <body>
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #4f46e5; color: white; padding: 20px; text-align: center;">
                <h1>Thank You for Contacting Us!</h1>
            </div>
            <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
                <p>Hello {recipient_name},</p>
                <p>Thank you for reaching out to Solve Ease. We've received your message and our team will review it shortly.</p>
                <p>We typically respond within 24-48 business hours.</p>
                <p>If you have any urgent matters, please call us at +91 72751-56652.</p>
                <p>Best regards,<br>The Solve Ease Team</p>
            </div>
            <div style="background-color: #f3f4f6; padding: 10px; text-align: center; font-size: 12px; color: #6b7280;">
                <p>© 2025 Solve Ease. All rights reserved.</p>
                <p>Keshav Mahavidyalaya, Pitampura, New Delhi, India</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Attach HTML content
    msg.attach(MIMEText(body, 'html'))
    
    try:
        # Connect to SMTP server
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()  # Secure the connection
        server.login(smtp_username, smtp_password)
        
        # Send email
        server.send_message(msg)
        server.quit()
        
        current_app.logger.info(f"Confirmation email sent to {recipient_email}")
        return True
    except Exception as e:
        current_app.logger.error(f"Failed to send confirmation email: {str(e)}")
        return False

def send_admin_notification(contact_data):
    """
    Send notification to admin when new contact form is submitted.
    
    Args:
        contact_data (dict): Contact form data
    """
    # Get email configuration from environment
    smtp_server = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
    smtp_port = int(os.environ.get('SMTP_PORT', 587))
    smtp_username = os.environ.get('SMTP_USERNAME', 'solveeaseofficial@gmail.com')
    smtp_password = os.environ.get('GOOGLE_APP_PASSWORD')
    sender_email = os.environ.get('GOOGLE_EMAIL', 'solveeaseofficial@gmail.com')
    admin_email = os.environ.get('ADMIN_EMAIL', 'vkadarsh.maurya@gmail.com')
    
    # Check if SMTP password is configured
    if not smtp_password:
        current_app.logger.warning("SMTP password not set. Email service is disabled.")
        return
    
    # Create message
    msg = MIMEMultipart()
    msg['From'] = f"Solve Ease Contact Form <{sender_email}>"
    msg['To'] = admin_email
    msg['Subject'] = f"New Contact Form Submission: {contact_data.get('subject', 'No Subject')}"
    
    # Email body
    body = f"""
    <html>
    <body>
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #4f46e5; color: white; padding: 20px; text-align: center;">
                <h1>New Contact Form Submission</h1>
            </div>
            <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
                <p><strong>Name:</strong> {contact_data.get('name', 'Not provided')}</p>
                <p><strong>Email:</strong> {contact_data.get('email', 'Not provided')}</p>
                <p><strong>Subject:</strong> {contact_data.get('subject', 'Not provided')}</p>
                <p><strong>Message:</strong></p>
                <div style="background-color: #f9fafb; padding: 15px; border-left: 4px solid #4f46e5;">
                    {contact_data.get('message', 'No message content').replace('\n', '<br>')}
                </div>
                <p style="margin-top: 20px;">You can respond directly to the sender by replying to their email address.</p>
            </div>
            <div style="background-color: #f3f4f6; padding: 10px; text-align: center; font-size: 12px; color: #6b7280;">
                <p>This is an automated notification from your website's contact form.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Attach HTML content
    msg.attach(MIMEText(body, 'html'))
    
    try:
        # Connect to SMTP server
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()  # Secure the connection
        server.login(smtp_username, smtp_password)
        
        # Send email
        server.send_message(msg)
        server.quit()
        
        current_app.logger.info(f"Admin notification email sent to {admin_email}")
        return True
    except Exception as e:
        current_app.logger.error(f"Failed to send admin notification email: {str(e)}")
        return False




# email service for sending newsletter

# def send_newsletter_email(email_list, post_data):
#     """
#     Send a newsletter email to a list of subscribers.  
#     Args: email_list (list): List of email addresses to send the newsletter to
#           post_data (dict): Data for the newsletter post

#     """

#     # Email configuration 
#     smtp_server = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
#     smtp_port = int(os.environ.get('SMTP_PORT', 587))
#     smtp_username = os.environ.get('SMTP_USERNAME', 'solveeaseofficial@gmail.com')
#     smtp_password = os.environ.get('GOOGLE_APP_PASSWORD')

#     sender_email  = os.environ.get('GOOGLE_EMAIL')


#     # Check if SMTP password is configured
#     if not smtp_password:
#         current_app.logger.warning("SMTP password not set. Email service is disabled.")
#         return
    
#     # Create message
#     msg = MIMEMultipart()

#     print(email_list)
#     print(post_data)



#     pass


def send_newsletter_email(email_list, post_data):
    """
    Send a newsletter email to a list of subscribers.  
    Args: email_list (list): List of email addresses to send the newsletter to
          post_data (dict): Data for the newsletter post
    """
    import os
    import smtplib
    from email.mime.multipart import MIMEMultipart
    from email.mime.text import MIMEText
    from flask import current_app
    from datetime import datetime
    
    # Email configuration
    smtp_server = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
    smtp_port = int(os.environ.get('SMTP_PORT', 587))
    smtp_username = os.environ.get('SMTP_USERNAME', 'solveeaseofficial@gmail.com')
    smtp_password = os.environ.get('GOOGLE_APP_PASSWORD')
    sender_email = os.environ.get('GOOGLE_EMAIL', smtp_username)
    sender_name = os.environ.get('SENDER_NAME', 'Solve Ease Blog')
    
    # Check if SMTP password is configured
    if not smtp_password:
        current_app.logger.warning("SMTP password not set. Email service is disabled.")
        return
    
    if not email_list:
        current_app.logger.info("No active subscribers to send newsletter to.")
        return
    
    # Extract post data
    title = post_data.get('title', 'New Blog Post')
    slug = post_data.get('slug', '')
    content = post_data.get('content', '')
    featured_image = post_data.get('featured_image', '')
    
    # Create base URL for links
    base_url = os.environ.get('BASE_URL', 'https://solveease.tech')
    post_url = f"{base_url}/blog/{slug}" if slug else f"{base_url}/blog"

    print("post_url", post_url)

    
    # Create excerpt (first 150 characters of content)

    excerpt = content.replace('<', ' <').replace('>', '> ').replace('  ', ' ')
    excerpt = ' '.join(excerpt.split())  # Normalize whitespace
    excerpt = excerpt[:150] + "..." if len(excerpt) > 150 else excerpt
    
    # Current date for the email
    current_date = datetime.now().strftime("%B %d, %Y")
    current_year = datetime.now().year
    
    # Try to connect to SMTP server and send emails
    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_username, smtp_password)
        
        sent_count = 0
        for recipient_email in email_list:
            # Create message for each recipient
            msg = MIMEMultipart()
            msg['From'] = f"{sender_name} <{sender_email}>"
            msg['To'] = recipient_email
            msg['Subject'] = f"New Blog Post: {title}"
            
            # Build HTML body with inline CSS (matching your confirmation email style)
            body = f"""
            <html>
            <body>
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background-color: #4f46e5; color: white; padding: 20px; text-align: center;">
                        <h1>New Blog Post</h1>
                        <p style="font-size: 14px; margin-top: 5px;">{current_date}</p>
                    </div>
                    <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
                        <h2 style="font-size: 22px; color: #2c3e50; margin-bottom: 15px;">{title}</h2>
                        
                        {f'<img src="{featured_image}" alt="{title}" style="width: 100%; max-height: 300px; object-fit: cover; margin-bottom: 20px; border-radius: 5px;">' if featured_image else ''}
                        
                        <p style="margin-bottom: 20px; color: #555555;">{excerpt}</p>
                        
                        <a href="{post_url}" style="display: inline-block; background-color: #4f46e5; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold;">Read Full Post</a>
                    </div>
                    <div style="background-color: #f3f4f6; padding: 10px; text-align: center; font-size: 12px; color: #6b7280;">
                        <p>Thank you for subscribing to our blog updates!</p>
                        <p>© {current_year} Solve Ease. All rights reserved.</p>
                        <p>
                            <a href="{base_url}/unsubscribe?email={recipient_email}" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a>
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            # Attach HTML content
            msg.attach(MIMEText(body, 'html'))
            
            # Send email
            server.send_message(msg)
            sent_count += 1
            
            # Small delay to avoid overloading the server
            
            time.sleep(0.1)
        
        server.quit()
        current_app.logger.info(f"Successfully sent newsletter to {sent_count} subscribers")
        return True
        
    except Exception as e:
        current_app.logger.error(f"Failed to send newsletter emails: {str(e)}")
        return False