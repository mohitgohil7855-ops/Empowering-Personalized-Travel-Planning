from flask import Blueprint,request,jsonify
from models.destination import Destination
from models.activity import Activity
bp=Blueprint('search',__name__,url_prefix='/api/search')
@bp.get('/destinations')
def destinations():
    q=(request.args.get('q') or '').lower(); region=request.args.get('region'); price=request.args.get('price')
    rows=Destination.query.all()
    rows=[x for x in rows if (not q or q in (x.name+' '+x.country+' '+x.description).lower()) and (not region or region.lower() in x.region.lower()) and (not price or x.price_level==price)]
    return jsonify(results=[x.to_dict() for x in rows])
@bp.get('/activities')
def activities():
    q=(request.args.get('q') or '').lower(); cat=request.args.get('category')
    rows=Activity.query.all(); rows=[x for x in rows if (not q or q in (x.name+' '+x.city+' '+x.category+' '+x.description).lower()) and (not cat or x.category.lower()==cat.lower())]
    return jsonify(results=[x.to_dict() for x in rows])
