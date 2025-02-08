from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

# Fix imports to be relative
from .database import SessionLocal, engine
from . import models

#create database
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

#dependency
def get_db():
    db = SessionLocal()
    try: 
        yield db
    finally:
        db.close()

@app.post("/users/")
def create_user(name: str, email: str, db: Session = Depends(get_db)):
    user = models.User(name=name, email=email)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@app.get("/users/")
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()