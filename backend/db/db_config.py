# Database configuration file for the Inventory Management System backend service.
# This file sets up the connection to the PostgreSQL database using SQLAlchemy, defines the Base class for ORM models, and provides a dependency function to get a database session for each request.
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")  # Database URL → connects Python to PostgreSQL
# SYNTAX → "postgresql://username:password@localhost:port_number/database_name"

engine = create_engine(DATABASE_URL)

local_session = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# -----------------------------------------------------------------------------------------------------------------------------------------------

# Dependency function to get a database session for each request


def get_db():

    db_session = local_session()

    try:
        yield db_session

    finally:
        db_session.close()


# ----------------------------------------------------------------------------------------------------------------------------------------------

# ** NOTE: This file is crucial for setting up the database connection and session management for the Inventory Management System backend service. It mostly remains unchanged across different implementations, as it provides the foundational configuration for connecting to the PostgreSQL database and managing database sessions using SQLAlchemy. The only potential changes that may occur in this file are related to the DATABASE_URL if there are changes in the database credentials or connection details. However, the overall structure and functionality of this file typically remain consistent across different versions of the backend service.
