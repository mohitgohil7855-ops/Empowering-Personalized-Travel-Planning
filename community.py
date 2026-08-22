from flask import Blueprint, jsonify
bp=Blueprint('community',__name__,url_prefix='/api/community')
POSTS=[{'id':1,'author':'Maya','title':'Italian Alps Escape','likes':42,'comments':8},{'id':2,'author':'Arjun','title':'7 Days in Japan','likes':31,'comments':5}]
@bp.get('/posts')
def posts(): return jsonify(posts=POSTS)
