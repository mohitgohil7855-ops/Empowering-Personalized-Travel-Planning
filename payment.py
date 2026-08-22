from flask import Blueprint,request,jsonify,session
from database import db
from models.payment import Payment
from models.trip import Trip
from models.booking import Booking
import uuid
bp=Blueprint('payment',__name__,url_prefix='/api/payment')
@bp.post('/checkout')
def checkout():
    if not session.get('user_id'):return jsonify(error='Login required'),401
    d=request.get_json() or {}; amount=float(d.get('amount') or 0)
    p=Payment(user_id=session['user_id'],trip_id=d.get('trip_id'),amount=amount,currency=d.get('currency','USD'),status='paid',transaction_id='GT-'+uuid.uuid4().hex[:12].upper())
    db.session.add(p);db.session.flush()
    if d.get('trip_id'):
        db.session.add(Booking(user_id=session['user_id'],trip_id=d['trip_id'],item_type='trip',item_name=d.get('item_name','Trip booking')))
    db.session.commit(); return jsonify(payment=p.to_dict(),success_url='/payment-success.html?transaction_id='+p.transaction_id)
@bp.get('/history')
def history():
    if not session.get('user_id'):return jsonify(error='Login required'),401
    return jsonify(payments=[p.to_dict() for p in Payment.query.filter_by(user_id=session['user_id']).order_by(Payment.id.desc()).all()])
