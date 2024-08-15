from flask import Blueprint, request, session, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from werkzeug.exceptions import Unauthorized

# Create a Flask Blueprint
auth_blueprint = Blueprint('auth', __name__)

# Configure SQLAlchemy
DATABASE_URL = "postgresql://nailgpuser:password@localhost:5432/nailgp"
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
db_session = Session()


# User registration route
@auth_blueprint.route('/register', methods=['POST'])
def register():
    try:
        email = request.json.get('email')
        password = request.json.get('password')

        # Hash the password
        hashed_password = generate_password_hash(password)

        # Insert user into the database
        query = text('INSERT INTO users (email, password) VALUES (:email, :password) RETURNING id')
        db_session.execute(query, {
            'email': email,
            'password': hashed_password
        })
        db_session.commit()

        return jsonify({'message': 'User registered'}), 201
    except Exception as e:
        db_session.rollback()
        print(f"Error registering user: {e}")
        return jsonify({'error': 'Error registering user'}), 400


# User login route
@auth_blueprint.route('/login', methods=['POST'])
def login():
    try:
        email = request.json.get('email')
        password = request.json.get('password')

        # Fetch user from the database
        query = text('SELECT * FROM users WHERE email = :email')
        result = db_session.execute(query, {'email': email})
        user = result.fetchone()

        if not user:
            return jsonify({'error': 'User not found'}), 400

        # Check the password
        if not check_password_hash(user['password'], password):
            return jsonify({'error': 'Invalid password'}), 400

        # Store user ID in session
        session['user_id'] = user['id']

        return jsonify({'message': 'User logged in'}), 200
    except Exception as e:
        print(f"Error logging in: {e}")
        return jsonify({'error': 'Error logging in'}), 400


# User logout route
@auth_blueprint.route('/logout', methods=['GET'])
def logout():
    try:
        session.pop('user_id', None)
        return jsonify({'message': 'User logged out'}), 200
    except Exception as e:
        print(f"Error logging out: {e}")
        return jsonify({'error': 'Error logging out'}), 500
