from flask import Blueprint, request, jsonify, session
from database import db
from models.trip import Trip
from models.itinerary import Itinerary
bp=Blueprint('itinerary',__name__,url_prefix='/api/itinerary')
def get_item(iid):
    i=Itinerary.query.get(iid)
    if not i or not i.trip or i.trip.user_id!=session.get('user_id'): return None
    return i
@bp.post('')
def add():
    d=request.get_json() or {}; t=Trip.query.filter_by(id=d.get('trip_id'),user_id=session.get('user_id')).first()
    if not t:return jsonify(error='Trip not found'),404
    i=Itinerary(trip_id=t.id,day_number=int(d.get('day_number') or 1),date=d.get('date',''),title=d.get('title',''),activity_id=d.get('activity_id'),start_time=d.get('start_time',''),end_time=d.get('end_time',''),notes=d.get('notes',''))
    db.session.add(i);db.session.commit();return jsonify(item=i.to_dict()),201
@bp.put('/<int:iid>')
def update(iid):
    i=get_item(iid)
    if not i:return jsonify(error='Item not found'),404
    d=request.get_json() or {}
    for k in ['day_number','date','title','activity_id','start_time','end_time','notes']:
        if k in d:setattr(i,k,d[k])
    db.session.commit();return jsonify(item=i.to_dict())
@bp.delete('/<int:iid>')
def delete(iid):
    i=get_item(iid)
    if not i:return jsonify(error='Item not found'),404
    db.session.delete(i);db.session.commit();return jsonify(message='Removed')
