from werkzeug.security import generate_password_hash, check_password_hash
from database import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(160), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(40), default='')
    bio = db.Column(db.Text, default='')
    avatar = db.Column(db.String(500), default='')
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    def set_password(self, p): self.password_hash = generate_password_hash(p)
    def check_password(self, p): return check_password_hash(self.password_hash, p)
    def to_dict(self): return {'id':self.id,'full_name':self.full_name,'email':self.email,'phone':self.phone,'bio':self.bio,'avatar':self.avatar,'is_admin':self.is_admin}
