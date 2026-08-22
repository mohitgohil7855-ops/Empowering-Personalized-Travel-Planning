from flask import Blueprint, request, jsonify, session
from database import db
from models.user import User
bp=Blueprint('auth',__name__,url_prefix='/api/auth')
def me():
    u=User.query.get(session.get('user_id')) if session.get('user_id') else None
    return u
@bp.post('/register')
def register():
    d=request.get_json() or request.form
    name=(d.get('fullName') or d.get('full_name') or '').strip(); email=(d.get('email') or '').strip().lower(); password=d.get('password') or ''
    if not name or not email or len(password)<6: return jsonify(error='Name, email and a password of at least 6 characters are required'),400
    if User.query.filter_by(email=email).first(): return jsonify(error='Email already registered'),409
    u=User(full_name=name,email=email); u.set_password(password); db.session.add(u); db.session.commit(); session['user_id']=u.id
    return jsonify(user=u.to_dict()),201
@bp.post('/login')
def login():
    d=request.get_json() or request.form; email=(d.get('email') or '').strip().lower(); password=d.get('password') or ''
    u=User.query.filter_by(email=email).first()
    if not u or not u.check_password(password): return jsonify(error='Invalid email or password'),401
    session['user_id']=u.id; return jsonify(user=u.to_dict())
@bp.post('/logout')
def logout(): session.clear(); return jsonify(message='Logged out')
@bp.get('/me')
def current():
    u=me(); return jsonify(user=u.to_dict() if u else None)
