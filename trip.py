from database import db
from datetime import datetime
class Trip(db.Model):
    __tablename__='trips'
    id=db.Column(db.Integer,primary_key=True)
    user_id=db.Column(db.Integer,db.ForeignKey('users.id'),nullable=False)
    title=db.Column(db.String(180),nullable=False)
    destination=db.Column(db.String(180),nullable=False)
    start_date=db.Column(db.String(20),default='')
    end_date=db.Column(db.String(20),default='')
    travelers=db.Column(db.Integer,default=1)
    budget=db.Column(db.Float,default=0)
    status=db.Column(db.String(30),default='draft')
    notes=db.Column(db.Text,default='')
    created_at=db.Column(db.DateTime,default=datetime.utcnow)
    user=db.relationship('User',backref='trips')
    def to_dict(self): return {'id':self.id,'user_id':self.user_id,'title':self.title,'destination':self.destination,'start_date':self.start_date,'end_date':self.end_date,'travelers':self.travelers,'budget':self.budget,'status':self.status,'notes':self.notes}
