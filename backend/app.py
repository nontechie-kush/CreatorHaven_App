# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy 
import sqlite3 # Keep sqlite3 import for local fallback
import os

app = Flask(__name__)

# --- DATABASE CONFIGURATION FOR AWS RDS (POSTGRESQL) / LOCAL SQLITE ---
# DATABASE_URL will be set by AWS Lambda environment variables in production
# For local development, it will use SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///creatorhaven_forms.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 

db = SQLAlchemy(app) 

# --- Define the Database Model ---
class FormSubmission(db.Model):
    __tablename__ = 'form_submissions' 
    id = db.Column(db.Integer, primary_key=True)
    platform_handle = db.Column(db.Text, nullable=False)  # Mandatory handle (e.g., @user on Instagram)
    email = db.Column(db.Text, unique=True, nullable=True) # Optional email, but unique if provided
    phone_number = db.Column(db.Text, nullable=True)      # Optional phone number
    card_name = db.Column(db.Text, nullable=True)         # Name of the clicked card (if from card click)
    form_location = db.Column(db.Text, nullable=False)    # 'modal' or 'bottom'
    submitted_at = db.Column(db.Text, default=db.func.current_timestamp()) 

    def __repr__(self):
        return f'<FormSubmission {self.platform_handle}>'

# Allow CORS from your frontend's specific domain (will be set by AWS Lambda env vars in production)
CORS(app, resources={r"/api/*": {"origins": os.environ.get('FRONTEND_URL', '*')}}) 

# API endpoint for form submission 
@app.route('/api/submit-form', methods=['POST'])
def submit_form():
    if not request.is_json:
        return jsonify({'success': False, 'message': 'Request must be JSON'}), 400

    data = request.get_json()
    platform_handle = data.get('handle') 
    email = data.get('email')
    phone_number = data.get('phone') 
    card_name = data.get('card_name')     
    form_location = data.get('form_location') 

    if not platform_handle or not form_location:
        return jsonify({'success': False, 'message': 'Platform Handle and Form Location are required.'}), 400

    try:
        new_submission = FormSubmission(
            platform_handle=platform_handle,
            email=email if email else None, 
            phone_number=phone_number if phone_number else None,
            card_name=card_name,
            form_location=form_location
        )
        db.session.add(new_submission) 
        db.session.commit() 

        print(f"Form data saved: Handle={platform_handle}, Email={email}, Phone={phone_number}, Card={card_name}, Loc={form_location}")
        return jsonify({'success': True, 'message': 'Form data submitted successfully!'}), 200
    except Exception as e:
        db.session.rollback() 
        print(f"Error saving form data: {e}")
        if 'UNIQUE constraint failed' in str(e) or 'duplicate key value violates unique constraint' in str(e):
             return jsonify({'success': False, 'message': 'This email or handle might already be submitted.'}), 409 
        return jsonify({'success': False, 'message': f'Internal server error: {e}'}), 500

@app.route('/api/status', methods=['GET'])
def status():
    return jsonify({'status': 'Backend is running!'}), 200

if __name__ == '__main__':
    # init_db_local() # This will be called via a separate script for deployment
    # For local testing, you'd run 'python app.py' once to create DB.
    print("Run 'python app.py' locally once to initialize the SQLite DB for dev.")
    print("In production, the DB tables will be created via init_db_script.py during deployment.")
    app.run(debug=True, port=5000)