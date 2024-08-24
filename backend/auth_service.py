from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv("../.env")

DATABASE_URL = os.getenv('DATABASE_URL')
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

class AuthService:
    def __init__(self):
        self.db_session = Session()

    def register_user(self, email, password):
        try:
            hashed_password = generate_password_hash(password)
            query = text('INSERT INTO users (email, password) VALUES (:email, :password) RETURNING id')
            result = self.db_session.execute(query, {
                'email': email,
                'password': hashed_password
            })
            user_id = result.fetchone()[0]
            self.db_session.commit()
            return {'user_id': user_id}
        except Exception as e:
            self.db_session.rollback()
            print(f"Error registering user: {e}")
            raise e

    def login_user(self, email, password):
        try:
            query = text('SELECT * FROM users WHERE email = :email')
            result = self.db_session.execute(query, {'email': email})
            user = result.fetchone()

            if not user:
                return None, 'User not found'

            if not check_password_hash(user['password'], password):
                return None, 'Invalid password'

            return {'user_id': user['id']}, None
        except Exception as e:
            print(f"Error logging in: {e}")
            raise e

    def logout_user(self):
        pass

    def close(self):
        self.db_session.close()
