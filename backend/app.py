from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os
from backend.prediction_routes import prediction_blueprint
from backend.auth_routes import auth_blueprint

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__, static_folder='frontend/build')

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_TYPE'] = os.getenv('SESSION_TYPE')
app.config['SESSION_SQLALCHEMY'] = SQLAlchemy(app)
app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER')

# Initialize extensions
db = app.config['SESSION_SQLALCHEMY']
Session(app)
CORS(app, supports_credentials=True, origins=[os.getenv('FRONTEND_URL')])

# Blueprints for routes
app.register_blueprint(auth_blueprint, url_prefix='/auth')
app.register_blueprint(prediction_blueprint, url_prefix='/predictions')

# Serve static files
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# Serve uploaded images
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(port=5000)
