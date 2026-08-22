from database import db
class Activity(db.Model):
    __tablename__='activities'
    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String(180),nullable=False)
    city=db.Column(db.String(120),default='')
    category=db.Column(db.String(80),default='')
    price=db.Column(db.Float,default=0)
    duration=db.Column(db.String(60),default='')
    description=db.Column(db.Text,default='')
    def to_dict(self): return {c.name:getattr(self,c.name) for c in self.__table__.columns}
