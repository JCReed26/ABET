from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True)
    name = Column(String(255), index=True)
    email = Column(String(255), index=True)
    expenses_id = Column(Integer, ForeignKey('expenses.expenses_id'), index=True)

class Expenses(Base):
    __tablename__ = 'expenses'

    expenses_id = Column(Integer, primary_key=True, index=True)
