from database import db
class Booking(db.Model):
    __tablename__='bookings'
    id=db.Column(db.Integer,primary_key=True)
    user_id=db.Column(db.Integer,db.ForeignKey('users.id'),nullable=False)
    trip_id=db.Column(db.Integer,db.ForeignKey('trips.id'),nullable=False)
    item_type=db.Column(db.String(40),default='activity')
    item_name=db.Column(db.String(180),nullable=False)
    status=db.Column(db.String(30),default='confirmed')
    def to_dict(self): return {c.name:getattr(self,c.name) for c in self.__table__.columns}
