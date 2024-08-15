from flask import Blueprint, request, jsonify, session
from werkzeug.utils import secure_filename
import os
import time
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from werkzeug.exceptions import Unauthorized
import tensorflow as tf
from tensorflow.keras.applications import MobileNet
from tensorflow.keras.applications.mobilenet import preprocess_input, decode_predictions
from tensorflow.keras.preprocessing import image as keras_image
import numpy as np

# Create a Flask Blueprint
prediction_blueprint = Blueprint('prediction', __name__)

# Configure SQLAlchemy
DATABASE_URL = os.getenv('DATABASE_URL')
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
db_session = Session()

UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', 'uploads/')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Load the pre-trained MobileNet model
model = tf.keras.

# Helper function to check if a file extension is allowed
def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Helper function to preprocess the image
def preprocess_image(image_path):
    img = keras_image.load_img(image_path, target_size=(224, 224))  # MobileNet expects 224x224 images
    img_array = keras_image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)  # Use MobileNet's preprocessing function
    return img_array

@prediction_blueprint.route('/predict', methods=['POST'])
def predict():
    if 'user_id' not in session:
        raise Unauthorized('Unauthorized')

    # Check if the post request has the file part
    if 'image' not in request.files:
        return jsonify({'error': 'No image part in the request'}), 400

    file = request.files['image']

    # If the user does not select a file, the browser submits an empty part without a filename
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(f"{int(time.time())}-{file.filename}")
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)

        # Preprocess the image and make a prediction
        try:
            img_array = preprocess_image(filepath)
            predictions = model.predict(img_array)
            decoded_predictions = decode_predictions(predictions, top=1)[0][0]
            predicted_class = decoded_predictions[1]  # Class name
            confidence = decoded_predictions[2]       # Confidence score

            return jsonify({
                'title': predicted_class,
                'confidence': str(confidence),
                'image_src': filepath
            }), 200
        except Exception as e:
            print(f"Error during prediction: {e}")
            return jsonify({'error': 'Error during prediction'}), 500

    return jsonify({'error': 'File type not allowed'}), 400


@prediction_blueprint.route('/save', methods=['POST'])
def save_prediction():
    if 'user_id' not in session:
        raise Unauthorized('Unauthorized')

    # Check if the post request has the file part
    if 'image' not in request.files:
        return jsonify({'error': 'No image part in the request'}), 400

    file = request.files['image']

    # If the user does not select a file, the browser submits an empty part without a filename
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(f"{int(time.time())}-{file.filename}")
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)

        title = request.form.get('title')
        confidence = request.form.get('confidence')

        try:
            # Insert prediction into the database
            query = text(
                'INSERT INTO predictions (user_id, image_src, title, confidence) VALUES (:user_id, :image_src, :title, :confidence) RETURNING id')
            result = db_session.execute(query, {
                'user_id': session['user_id'],
                'image_src': filepath,
                'title': title,
                'confidence': confidence
            })
            db_session.commit()
            return jsonify({'message': 'Prediction saved', 'id': result.fetchone()[0]}), 200
        except Exception as e:
            db_session.rollback()
            print(f"Error saving prediction: {e}")
            return jsonify({'error': 'Error saving prediction'}), 500

    return jsonify({'error': 'File type not allowed'}), 400


@prediction_blueprint.route('/user-predictions', methods=['GET'])
def user_predictions():
    if 'user_id' not in session:
        raise Unauthorized('Unauthorized')

    try:
        query = text('SELECT * FROM predictions WHERE user_id = :user_id')
        result = db_session.execute(query, {'user_id': session['user_id']})
        predictions = result.fetchall()
        # Convert result to list of dictionaries
        predictions_list = [
            {
                'id': row['id'],
                'user_id': row['user_id'],
                'image_src': row['image_src'],
                'title': row['title'],
                'confidence': row['confidence']
            }
            for row in predictions
        ]
        return jsonify(predictions_list), 200
    except Exception as e:
        print(f"Error fetching predictions: {e}")
        return jsonify({'error': 'Error fetching predictions'}), 400
