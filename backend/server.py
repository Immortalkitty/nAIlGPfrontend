import os

from flask import Flask
from flask_cors import CORS
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
from config import DevelopmentConfig
from auth_routes import auth_blueprint
from prediction_routes import prediction_blueprint

def create_app(config_class=DevelopmentConfig):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db = SQLAlchemy(app)
    Session(app)
    CORS(app, supports_credentials=True, origins=[app.config['FRONTEND_URL']])
    app.config['SESSION_TYPE'] = 'filesystem'
    app.config['SESSION_FILE_DIR'] = os.path.join(os.getcwd(), '../flask_session_files')

    app.register_blueprint(auth_blueprint, url_prefix='/auth')
    app.register_blueprint(prediction_blueprint, url_prefix='/predictions')

    @app.route('/')
    def index():
        return "Welcome to the API", 200

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(port=5000)
