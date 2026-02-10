from fastapi import FastAPI
from database import engine
from models import Base

app = FastAPI(title="Expense Tracker API")

# Create database tables
Base.metadata.create_all(bind=engine)


@app.get("/")
def home():
    return {"status": "Expense Tracker backend running"}
