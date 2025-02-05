from sqlalchemy.orm import Session
from . import models, schema

def get_users(db: Session, user_id: int):
    return db.query(models.User).filter_by(id=user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter_by(email=email).first()

def create_user(db: Session, user: schema.UserCreate):
    #make add commit refresh delete macrr 
    db_user = models.User(name=user.name, email=user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
