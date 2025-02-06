from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

#need to make sure we can CRUD into the database on mySQL also how can we view the data in workbench
#loads the environment creates the database engine and creates database session
#port 3306
load_dotenv()
import os
DB_URL = os.getenv('http://localhost:3306')
engine = create_engine(DB_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()