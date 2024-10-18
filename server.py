from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
import random
import jwt
import datetime
from functools import wraps
from flask_bcrypt import Bcrypt
from itsdangerous import URLSafeTimedSerializer
from flask_swagger_ui import get_swaggerui_blueprint

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

# Configuration
app.config['SECRET_KEY'] = 'your_secret_key_here'  # Change this to a secure random string
app.config['JWT_EXPIRATION_DELTA'] = datetime.timedelta(hours=24)
serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])

# Swagger configuration
SWAGGER_URL = '/api/docs'
API_URL = '/static/swagger.json'
swagger_ui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        'app_name': "Timeline History API"
    }
)
app.register_blueprint(swagger_ui_blueprint, url_prefix=SWAGGER_URL)

# ... (rest of the existing code)

@app.route('/api/backup', methods=['GET'])
@token_required
def backup_data():
    connection = create_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM events")
        events = cursor.fetchall()
        return jsonify(events), 200
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/restore', methods=['POST'])
@token_required
def restore_data():
    connection = create_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500

    events = request.json
    if not isinstance(events, list):
        return jsonify({"error": "Invalid data format"}), 400

    try:
        cursor = connection.cursor()
        cursor.execute("DELETE FROM events")  # Clear existing events
        for event in events:
            sql = "INSERT INTO events (title, date, category, description, image) VALUES (%s, %s, %s, %s, %s)"
            values = (event['title'], event['date'], event['category'], event['description'], event.get('image'))
            cursor.execute(sql, values)
        connection.commit()
        return jsonify({"message": "Data restored successfully"}), 200
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
