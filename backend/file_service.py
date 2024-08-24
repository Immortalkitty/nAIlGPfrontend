import os
import time
from werkzeug.utils import secure_filename

class FileService:
    def __init__(self, upload_folder, allowed_extensions):
        self.upload_folder = upload_folder
        self.allowed_extensions = allowed_extensions

    def allowed_file(self, filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in self.allowed_extensions

    def save_file(self, file):
        filename = secure_filename(f"{int(time.time())}-{file.filename}")
        filepath = os.path.join(self.upload_folder, filename)
        file.save(filepath)
        return filepath
