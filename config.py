import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_URL = os.getenv('DATABASE_URL', f"sqlite:///{os.path.join(BASE_DIR, 'globetrotter.db')}")
SECRET_KEY = os.getenv('SECRET_KEY', 'globetrotter-dev-secret-change-me')
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
RECEIPT_FOLDER = os.path.join(BASE_DIR, 'receipts')
FRONTEND_DIR = os.path.abspath(os.path.join(BASE_DIR, '..', 'frontend'))
