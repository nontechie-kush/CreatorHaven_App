import sqlite3
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

application = Flask(__name__)
CORS(application)

print("Writing to DB file:", os.path.abspath("instance/creatorhaven_forms.db"))

def init_db():
    conn = sqlite3.connect('instance/creatorhaven_forms.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS form_submissions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    handle TEXT,
                    email TEXT,
                    phone TEXT,
                    card_name TEXT,
                    location TEXT,
                    utm_source TEXT,
                    utm_medium TEXT,
                    utm_campaign TEXT,
                    referrer TEXT,
                    user_agent TEXT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                )''')
    conn.commit()
    conn.close()
    print("Database initialized.")

@application.route('/api/submit-form', methods=['POST'])
def submit_form():
    data = request.get_json()
    handle = data.get('handle')
    email = data.get('email')
    phone = data.get('phone')
    card_name = data.get('card_name')
    location = data.get('location')
    utm_source = data.get('utm_source')
    utm_medium = data.get('utm_medium')
    utm_campaign = data.get('utm_campaign')
    referrer = data.get('referrer')
    user_agent = data.get('user_agent')

    conn = sqlite3.connect('instance/creatorhaven_forms.db')
    c = conn.cursor()
    c.execute('''INSERT INTO form_submissions (
                    handle, email, phone, card_name, location,
                    utm_source, utm_medium, utm_campaign, referrer, user_agent
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
              (handle, email, phone, card_name, location,
               utm_source, utm_medium, utm_campaign, referrer, user_agent))
    conn.commit()
    conn.close()

    print(f"Form data saved: Handle={handle}, Email={email}, Phone={phone}, Card={card_name}, Loc={location}")
    return jsonify({'message': 'Form submitted successfully'}), 200

if __name__ == "__main__":
    #init_db()
    application.run(debug=True)