from flask import Blueprint, request, jsonify, session
from database import db
from models.trip import Trip
bp=Blueprint('trips',__name__,url_prefix='/api/trips')
def uid(): return session.get('user_id')
def auth(): return uid() is not None
@bp.get('')
def all_trips():
    if not auth(): return jsonify(error='Login required'),401
    return jsonify(trips=[t.to_dict() for t in Trip.query.filter_by(user_id=uid()).order_by(Trip.id.desc()).all()])
@bp.post('')
def create():
    if not auth(): return jsonify(error='Login required'),401
    d=request.get_json() or {}
    t=Trip(user_id=uid(),title=d.get('title') or 'My Trip',destination=d.get('destination') or '',start_date=d.get('start_date',''),end_date=d.get('end_date',''),travelers=int(d.get('travelers') or 1),budget=float(d.get('budget') or 0),status=d.get('status','draft'),notes=d.get('notes',''))
    db.session.add(t); db.session.commit(); return jsonify(trip=t.to_dict()),201
@bp.get('/<int:trip_id>')
def get_trip(trip_id):
    t=Trip.query.filter_by(id=trip_id,user_id=uid()).first()
    if not t: return jsonify(error='Trip not found'),404
    return jsonify(trip=t.to_dict(), itinerary=[i.to_dict() for i in t.itinerary_items])
@bp.put('/<int:trip_id>')
def update(trip_id):
    t=Trip.query.filter_by(id=trip_id,user_id=uid()).first()
    if not t:return jsonify(error='Trip not found'),404
    d=request.get_json() or {}
    for k in ['title','destination','start_date','end_date','status','notes']:
        if k in d:setattr(t,k,d[k])
    for k in ['travelers','budget']:
        if k in d:setattr(t,k,int(d[k]) if k=='travelers' else float(d[k]))
    db.session.commit(); return jsonify(trip=t.to_dict())
@bp.delete('/<int:trip_id>')
def delete(trip_id):
    t=Trip.query.filter_by(id=trip_id,user_id=uid()).first()
    if not t:return jsonify(error='Trip not found'),404
    db.session.delete(t); db.session.commit(); return jsonify(message='Trip deleted')
