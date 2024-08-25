from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import text

class AuthService:
    def __init__(self, db):
        self.db = db

    def register_user(self, email, password):
        db_session = self.db.session
        try:
            hashed_password = generate_password_hash(password)
            query = text('INSERT INTO users (email, password) VALUES (:email, :password) RETURNING id')
            result = db_session.execute(query, {
                'email': email,
                'password': hashed_password
            })
            user_id = result.fetchone()[0]
            db_session.commit()
            return {'user_id': user_id}
        except Exception as e:
            db_session.rollback()
            print(f"Error registering user: {e}")
            raise e
        finally:
            db_session.close()

    def login_user(self, email, password):
        db_session = self.db.session
        try:
            query = text('SELECT * FROM users WHERE email = :email')
            result = db_session.execute(query, {'email': email})
            user = result.fetchone()

            if not user:
                return None, 'User not found'

            if not check_password_hash(user[2], password):
                return None, 'Invalid password'

            return {'user_id': user[0]}, None
        except Exception as e:
            print(f"Error logging in: {e}")
            raise e
        finally:
            db_session.close()

    def logout_user(self):
        pass

    def close(self):
        self.db.session.close()
