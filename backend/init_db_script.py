from app import db, app

# Step-by-step explanation:
# 1. `app.app_context()` is needed to work with the database safely
# 2. `db.create_all()` will create the table in your SQLite DB
# 3. You’ll see a success message when it’s done

with app.app_context():
    db.create_all()
    print("✅ Database initialized successfully.")