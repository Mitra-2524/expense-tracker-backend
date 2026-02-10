from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import engine, SessionLocal
from models import Base, Expense
import joblib
import os


app = FastAPI(title="Expense Tracker API")

# Create database tables
Base.metadata.create_all(bind=engine)

# Load ML model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "expense_category_model.pkl")

model = joblib.load(MODEL_PATH)


# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def home():
    return {"status": "Expense Tracker backend running"}


@app.post("/expenses")
def add_expense(
    amount: float,
    category: str,
    description: str,
    db: Session = Depends(get_db)
):
    expense = Expense(
        amount=amount,
        category=category,
        description=description
    )
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense


@app.get("/expenses")
def get_expenses(db: Session = Depends(get_db)):
    return db.query(Expense).all()

@app.post("/predict-category")
def predict_category(description: str):
    prediction = model.predict([description])[0]
    return {
        "description": description,
        "predicted_category": prediction
    }
