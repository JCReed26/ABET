from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

MySQLdb_URL = 'mysql://root:shawty@localhost:3306/abet_users'

engine = create_engine(MySQLdb_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

