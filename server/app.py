from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from portfolio_api import router as portfolio_router
from fastapi import FastAPI
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Initialize FastAPI app
app = FastAPI()

# --- SQLite Database Setup ---
DATABASE_URL = "sqlite:///./spreadwealth.db"  # database file will be created in this folder

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Example table
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from portfolio_api import router as portfolio_router
from fastapi import FastAPI
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Initialize FastAPI app
app = FastAPI()

# --- SQLite Database Setup ---
DATABASE_URL = "sqlite:///./spreadwealth.db"  # database file will be created in this folder

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Example table
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    age = Column(Integer, nullable=True)


# Create tables
Base.metadata.create_all(bind=engine)

# --- Example route to test ---
@app.get("/")
def home():
    return {"message": "SQLite connected successfully!"}

# CORS: allow local dev client on 5173
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(portfolio_router)

@app.get("/api/health")
def health():
    return {"ok": True}


# Create tables
Base.metadata.create_all(bind=engine)

# --- Example route to test ---
@app.get("/")
def home():
    return {"message": "SQLite connected successfully!"}

# CORS: allow local dev client on 5173
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(portfolio_router)

@app.get("/api/health")
def health():
    return {"ok": True}
from fastapi import Request
from pydantic import BaseModel

# --- Define request model ---
class SignupData(BaseModel):
    name: str
    email: str
    password: str
    age: int

@app.post("/signup")
def signup(data: SignupData):
    db = SessionLocal()
    new_user = User(
        name=data.name,
        email=data.email,
        password=data.password,
        age=data.age
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    db.close()
    return {"message": "User created successfully!", "user_id": new_user.id}