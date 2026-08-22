from database import db
class Destination(db.Model):
    __tablename__='destinations'
    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String(160),nullable=False)
    country=db.Column(db.String(100),nullable=False)
    region=db.Column(db.String(80),default='')
    price_level=db.Column(db.String(20),default='$$')
    description=db.Column(db.Text,default='')
    image_url=db.Column(db.String(500),default='')
    def to_dict(self): return {c.name:getattr(self,c.name) for c in self.__table__.columns}
