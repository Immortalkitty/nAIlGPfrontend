from flask import Flask
from flask_cors import CORS
from flask_session import Session
from config import DevelopmentConfig
from auth_routes import auth_blueprint
from prediction_routes import prediction_blueprint
from db import db
from backend.prediction_service import PredictionService
from auth_service import AuthService

def create_app(config_class=DevelopmentConfig):
    app_1 = Flask(__name__)
    app_1.config.from_object(config_class)

    db.init_app(app_1)
    Session(app_1)
    CORS(app_1, supports_credentials=True, origins=[app_1.config['FRONTEND_URL']])

    app_1.prediction_service = PredictionService(model_path='/home/kasia/Downloads/my_model215', db=db)
    app_1.auth_service = AuthService(db=db)

    app_1.register_blueprint(auth_blueprint, url_prefix='/auth')
    app_1.register_blueprint(prediction_blueprint, url_prefix='/predictions')

    return app_1

if __name__ == "__main__":
    app = create_app()
    app.run(port=5000)


