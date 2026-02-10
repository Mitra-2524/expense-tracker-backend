from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
import joblib

texts = [
    "pizza", "burger", "coffee",
    "bus ticket", "train ticket", "uber ride",
    "electricity bill", "mobile recharge",
    "movie ticket", "netflix"
]

labels = [
    "Food", "Food", "Food",
    "Transport", "Transport", "Transport",
    "Bills", "Bills",
    "Entertainment", "Entertainment"
]

model = Pipeline([
    ("tfidf", TfidfVectorizer()),
    ("classifier", MultinomialNB())
])

model.fit(texts, labels)

joblib.dump(model, "expense_category_model.pkl")

print("ML model trained and saved ✅")
