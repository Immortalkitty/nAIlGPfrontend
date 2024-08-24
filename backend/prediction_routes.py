from flask import Blueprint, request, jsonify, session
from werkzeug.exceptions import Unauthorized

from backend.config import DevelopmentConfig
from prediction_service import PredictionService
from file_service import FileService
from config import Config

prediction_blueprint = Blueprint('prediction', __name__)

prediction_service = PredictionService(model_path='/home/kasia/Downloads/my_model215', database_url=DevelopmentConfig.SQLALCHEMY_DATABASE_URI)
file_service = FileService(upload_folder=Config.UPLOAD_FOLDER, allowed_extensions=DevelopmentConfig.ALLOWED_EXTENSIONS)

@prediction_blueprint.route('/predict', methods=['POST'])
def predict():
    if 'user_id' not in session:
        raise Unauthorized('Unauthorized')

    if 'image' not in request.files:
        return jsonify({'error': 'No image part in the request'}), 400

    file = request.files['image']

    if file and file_service.allowed_file(file.filename):
        filepath = file_service.save_file(file)
        try:
            predicted_class, confidence = prediction_service.predict(filepath)
            return jsonify({'title': predicted_class, 'confidence': str(confidence), 'image_src': filepath}), 200
        except Exception as e:
            return jsonify({'error': 'Error during prediction'}), 500

    return jsonify({'error': 'File type not allowed'}), 400

@prediction_blueprint.route('/save', methods=['POST'])
def save_prediction():
    if 'user_id' not in session:
        raise Unauthorized('Unauthorized')

    if 'image' not in request.files:
        return jsonify({'error': 'No image part in the request'}), 400

    file = request.files['image']

    if file and file_service.allowed_file(file.filename):
        filepath = file_service.save_file(file)
        title = request.form.get('title')
        confidence = request.form.get('confidence')

        try:
            prediction_id = prediction_service.save_prediction(session['user_id'], filepath, title, confidence)
            return jsonify({'message': 'Prediction saved', 'id': prediction_id}), 200
        except Exception as e:
            return jsonify({'error': 'Error saving prediction'}), 500

    return jsonify({'error': 'File type not allowed'}), 400

@prediction_blueprint.route('/user-predictions', methods=['GET'])
def user_predictions():
    if 'user_id' not in session:
        raise Unauthorized('Unauthorized')

    try:
        predictions = prediction_service.get_user_predictions(session['user_id'])
        return jsonify(predictions), 200
    except Exception as e:
        return jsonify({'error': 'Error fetching predictions'}), 400
