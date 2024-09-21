import os
import tensorflow as tf
from tensorflow.keras.applications.resnet50 import preprocess_input
from tensorflow.keras.preprocessing import image as keras_image
import numpy as np
from sqlalchemy import text

from backend.config import Config


class PredictionService:
    def __init__(self, model_path, db):
        self.model_path = model_path
        self.model = self.load_model()
        self.db = db

    def load_model(self):
        try:
            print(f"Loading model from {self.model_path}...")
            model = tf.keras.models.load_model(self.model_path)
            print("Model loaded successfully.")
            return model
        except Exception as e:
            print(f"Error loading model: {e}")
            raise e

    def preprocess_image(self, image_path):
        if not os.path.exists(image_path):
            print(f"Image path {image_path} does not exist.")
            return None

        print(f"Loading and preprocessing image from {image_path}...")
        img = keras_image.load_img(image_path, target_size=(224, 224))
        img_array = keras_image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = preprocess_input(img_array)
        return img_array

    def predict(self, image_path):
        image_path = os.path.join(Config.UPLOAD_FOLDER, image_path)
        img_array = self.preprocess_image(image_path)
        predictions = self.model.predict(img_array)

        prediction_value = predictions[0][0]

        predicted_class = "Healthy" if prediction_value < 0.5 else "Infected"
        confidence = 1 - prediction_value if prediction_value < 0.5 else prediction_value

        return predicted_class, confidence

    def save_prediction(self, user_id, filepath, title, confidence):
        db_session = self.db.session
        try:
            query = text(
                'INSERT INTO predictions (user_id, image_src, title, confidence) VALUES (:user_id, :image_src, :title, :confidence) RETURNING id'
            )
            result = db_session.execute(query, {
                'user_id': user_id,
                'image_src': filepath,
                'title': title,
                'confidence': confidence
            })
            db_session.commit()
            return result.fetchone()[0]
        except Exception as e:
            db_session.rollback()
            print(f"Error saving prediction: {e}")
            raise e
        finally:
            db_session.close()

    def get_user_predictions_paginated(self, user_id, limit, offset):
        db_session = self.db.session
        try:
            # Get the total number of predictions for the user
            total_query = text('SELECT COUNT(*) FROM predictions WHERE user_id = :user_id')
            total_result = db_session.execute(total_query, {'user_id': user_id})
            total_count = total_result.scalar()

            # Fetch the paginated predictions in reverse order by id (latest first)
            query = text(
                'SELECT * FROM predictions WHERE user_id = :user_id ORDER BY id DESC LIMIT :limit OFFSET :offset')
            result = db_session.execute(query, {'user_id': user_id, 'limit': limit, 'offset': offset})

            predictions = []
            for row in result.fetchall():
                predictions.append({
                    'id': row[0],
                    'user_id': row[1],
                    'image_src': row[2],
                    'title': row[3],
                    'confidence': str(row[4]),
                    'created_at': row[5].isoformat() if row[5] else None
                })

            return predictions, total_count  # Return both predictions and total count
        finally:
            db_session.close()




