import os

import tensorflow as tf
from sqlalchemy.orm import sessionmaker
from tensorflow.keras.applications.resnet50 import preprocess_input, decode_predictions
from tensorflow.keras.preprocessing import image as keras_image
import numpy as np
from sqlalchemy import text, create_engine


class PredictionService:
    def __init__(self, model_path, database_url):
        self.model = tf.keras.models.load_model(model_path)
        self.engine = create_engine(database_url)
        self.Session = sessionmaker(bind=self.engine)

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
        img_array = self.preprocess_image(image_path)
        predictions = self.model.predict(img_array)

        prediction_value = predictions[0][0]

        predicted_class = "Healthy" if prediction_value < 0.5 else "Infected"
        confidence = 1 - prediction_value if prediction_value < 0.5 else prediction_value

        return predicted_class, confidence

    def save_prediction(self, user_id, filepath, title, confidence):
        db_session = self.Session()
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
        finally:
            db_session.close()

    def get_user_predictions(self, user_id):
        db_session = self.Session()
        try:
            query = text('SELECT * FROM predictions WHERE user_id = :user_id')
            result = db_session.execute(query, {'user_id': user_id})
            return result.fetchall()
        finally:
            db_session.close()
