from flask import Blueprint,jsonify,session
from models.user import User
from models.trip import Trip
from models.payment import Payment
bp=Blueprint('admin',__name__,url_prefix='/api/admin')
def check():
    u=User.query.get(session.get('user_id')); return u if u and u.is_admin else None
@bp.get('/stats')
def stats():
    if not check():return jsonify(error='Admin access required'),403
    return jsonify(users=User.query.count(),trips=Trip.query.count(),payments=Payment.query.count(),revenue=sum(p.amount for p in Payment.query.all()))
@bp.get('/users')
def users():
    if not check():return jsonify(error='Admin access required'),403
    return jsonify(users=[u.to_dict() for u in User.query.order_by(User.id.desc()).all()])
