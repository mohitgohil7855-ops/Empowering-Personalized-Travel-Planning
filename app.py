import os, sys, secrets
sys.path.insert(0, os.path.dirname(__file__))
from flask import Flask, send_from_directory, jsonify, request, session
from flask_cors import CORS
from config import SECRET_KEY, DATABASE_URL, FRONTEND_DIR, UPLOAD_FOLDER, RECEIPT_FOLDER
from database import db
from models import *
from routes.auth import bp as auth_bp
from routes.trips import bp as trips_bp
from routes.itinerary import bp as itinerary_bp
from routes.search import bp as search_bp
from routes.community import bp as community_bp
from routes.payment import bp as payment_bp
from routes.admin import bp as admin_bp

app=Flask(__name__, static_folder=None)
app.config.update(SECRET_KEY=SECRET_KEY,SQLALCHEMY_DATABASE_URI=DATABASE_URL,SQLALCHEMY_TRACK_MODIFICATIONS=False,UPLOAD_FOLDER=UPLOAD_FOLDER,RECEIPT_FOLDER=RECEIPT_FOLDER)
db.init_app(app); CORS(app, supports_credentials=True)
os.makedirs(UPLOAD_FOLDER,exist_ok=True); os.makedirs(RECEIPT_FOLDER,exist_ok=True)
for bp in [auth_bp,trips_bp,itinerary_bp,search_bp,community_bp,payment_bp,admin_bp]: app.register_blueprint(bp)

@app.get('/api/health')
def health(): return jsonify(status='ok',app='GlobeTrotter',database='sqlite')

@app.get('/')
def root(): return send_from_directory(FRONTEND_DIR,'globetrotter_travel_app.html')
@app.get('/<path:filename>')
def frontend(filename):
    # API routes are registered before this fallback.
    if filename.startswith('api/'): return jsonify(error='Not found'),404
    path=os.path.join(FRONTEND_DIR,filename)
    if os.path.isfile(path): return send_from_directory(FRONTEND_DIR,filename)
    return send_from_directory(FRONTEND_DIR,'globetrotter_travel_app.html')

def seed():
    if Destination.query.count()==0:
        data=[
        ('Paris','France','Europe','$$','Art, food and iconic landmarks.'),('Rome','Italy','Europe','$$','History, food and ancient architecture.'),('Tokyo','Japan','Asia','$$$','Modern city life, temples and incredible food.'),('Bali','Indonesia','Asia','$$','Beaches, culture and wellness.'),('Dubai','UAE','Asia','$$$','Skylines, desert adventures and shopping.'),('Swiss Alps','Switzerland','Europe','$$$','Mountain scenery, lakes and alpine villages.'),('New York','USA','Americas','$$$','Museums, neighborhoods and city energy.'),('Ahmedabad','India','Asia','$','Heritage, food and vibrant local culture.')]
        for a,b,c,d,e in data: db.session.add(Destination(name=a,country=b,region=c,price_level=d,description=e))
    if Activity.query.count()==0:
        data=[('Eiffel Tower Visit','Paris','Sightseeing',35,'2 hours','Iconic Paris landmark visit.'),('Colosseum Tour','Rome','Sightseeing',45,'2.5 hours','Ancient Rome guided tour.'),('Sushi Making Class','Tokyo','Food',60,'3 hours','Hands-on Japanese cooking experience.'),('Sunrise Mount Batur','Bali','Adventure',40,'6 hours','Sunrise trek with local guide.'),('Desert Safari','Dubai','Adventure',75,'6 hours','Dunes, sunset and cultural entertainment.'),('Alpine Cable Car','Swiss Alps','Nature',55,'3 hours','Panoramic mountain experience.')]
        for a,b,c,d,e,f in data: db.session.add(Activity(name=a,city=b,category=c,price=d,duration=e,description=f))
    if not User.query.filter_by(email='admin@globetrotter.local').first():
        u=User(full_name='GlobeTrotter Admin',email='admin@globetrotter.local',is_admin=True);u.set_password('admin123');db.session.add(u)
    db.session.commit()

with app.app_context():
    db.create_all(); seed()

if __name__=='__main__': app.run(host='127.0.0.1',port=int(os.getenv('PORT',5000)),debug=True)
