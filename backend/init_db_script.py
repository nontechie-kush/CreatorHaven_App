# backend/init_db_script.py
import os
from app import app, db # Import app and db from your Flask app

# This script will run db.create_all() for your deployed app
# It will use the DATABASE_URL environment variable set in production.

def run_db_initialization():
    """
    Runs database initialization (db.create_all()) within the application context.
    """
    with app.app_context():
        # db.drop_all() # CAUTION: Only uncomment for controlled dev resets!
        db.create_all()
        print("Database tables created/checked by init_db_script.py.")

if __name__ == '__main__':
    print("Running database initialization script...")
    run_db_initialization()
    print("Database initialization script finished.")