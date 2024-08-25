import os
from werkzeug.utils import secure_filename


class FileService:
    def __init__(self, upload_folder, allowed_extensions):
        self.upload_folder = upload_folder
        self.allowed_extensions = allowed_extensions


        if not os.path.exists(self.upload_folder):
            os.makedirs(self.upload_folder)

    def allowed_file(self, filename):
        return '.' in filename and \
            filename.rsplit('.', 1)[1].lower() in self.allowed_extensions

    def save_file(self, file):
        filename = secure_filename(file.filename)
        filepath = os.path.join(self.upload_folder, filename)
        print(f"Saving file to: {filepath}")

        try:
            file.save(filepath)
            print(f"File saved successfully: {filepath}")
        except Exception as e:
            print(f"Error saving file: {e}")
            raise e

        return filepath
