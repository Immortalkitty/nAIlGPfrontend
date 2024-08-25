from flask import Blueprint, request, session, jsonify, current_app

auth_blueprint = Blueprint('auth', __name__)

@auth_blueprint.route('/check-session', methods=['GET'])
def check_session():
    logged_in = 'user_id' in session
    return jsonify({'loggedIn': logged_in}), 200
@auth_blueprint.route('/register', methods=['POST'])
def register():
    auth_service = current_app.auth_service

    try:
        email = request.json.get('email')
        password = request.json.get('password')

        result = auth_service.register_user(email, password)
        return jsonify({'message': 'User registered', 'user_id': result['user_id']}), 201
    except Exception as e:
        print(f"Error registering user: {e}")
        return jsonify({'error': 'Error registering user'}), 400

@auth_blueprint.route('/login', methods=['POST'])
def login():
    auth_service = current_app.auth_service

    try:
        email = request.json.get('email')
        password = request.json.get('password')

        user, error = auth_service.login_user(email, password)

        if error:
            return jsonify({'error': error}), 400

        session['user_id'] = user['user_id']
        return jsonify({'message': 'User logged in'}), 200
    except Exception as e:
        print(f"Error logging in: {e}")
        return jsonify({'error': 'Error logging in'}), 400

@auth_blueprint.route('/logout', methods=['GET'])
def logout():
    try:
        session.pop('user_id', None)
        return jsonify({'message': 'User logged out'}), 200
    except Exception as e:
        print(f"Error logging out: {e}")
        return jsonify({'error': 'Error logging out'}), 500
