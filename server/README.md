## Backend Server

### Architecture
<pre>
flask-backend/
├── app.py
├── config.py
├── extensions.py
├── api/
│   ├── __init__.py
│   ├── auth_routes.py
│   └── contact_routes.py
├── models/
│   ├── __init__.py
│   ├── contact.py
│   └── user.py
├── services/
│   ├── __init__.py
│   ├── email_service.py
│   └── supabase_service.py
├── requirements.txt
└── vercel.json
</pre>


