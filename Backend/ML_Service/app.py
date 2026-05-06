import os
import time
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel
from pymongo import MongoClient
from dotenv import load_dotenv
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import Union, List
from typing import Optional

# ---------------- LOAD ENV
load_dotenv()

MONGO_URI = os.getenv("MONGODB_URL")
DB_NAME = "test"
COLLECTION_NAME = "schemes"

# ---------------- APP INIT
app = FastAPI()

# ---------------- DB CONNECTION
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

# ---------------- LOAD & TRANSFORM DATA
def load_data():
    data = list(collection.find({}))

    if not data:
        raise Exception("No data found in MongoDB")

    df = pd.DataFrame(data).fillna("")

    # Convert ObjectId → string
    df["_id"] = df["_id"].astype(str)

    # category (array → string)
    df["category"] = df["category"].apply(
        lambda x: " ".join(x) if isinstance(x, list) else str(x)
    )

    df["documents"] = df.get("documentsRequired", "")
    df["application"] = df.get("howToApply", "")
    df["benefits"] = df.get("keyFeatures", "")
    df["eligibility"] = df.get("eligibility", "")

    def to_text(x):
        if isinstance(x, list):
            return " ".join(x)
        return str(x)

    df["documents"] = df["documents"].apply(to_text)
    df["application"] = df["application"].apply(to_text)
    df["benefits"] = df["benefits"].apply(to_text)
    df["eligibility"] = df["eligibility"].apply(to_text)

    df["combined"] = (
        df["description"] + " " +
        df["benefits"] + " " +
        df["eligibility"] + " " +
        df["category"] + " " +
        df["level"]
    )

    return df
# ---------------- CACHE SYSTEM
df = None
vectorizer = None
tfidf_matrix = None
last_loaded = 0
CACHE_TIME = 300  # 5 minutes


def refresh_data():
    global df, vectorizer, tfidf_matrix

    df = load_data()
    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(df["combined"])


class UserInput(BaseModel):
    category: Optional[Union[str, List[str]]] = None
    interests: Optional[List[str]] = None
    level: Optional[str] = "State"


# ---------------- API ENDPOINT
@app.post("/recommend")
def recommend(user: UserInput):
    refresh_data()

    # -------- HANDLE CATEGORY / INTERESTS --------
    if user.category:
        category = user.category
    elif user.interests:
        category = user.interests
    else:
        category = ["General"]

    # Convert to text
    if isinstance(category, list):
        category_text = " ".join(category)
    else:
        category_text = category

    level = user.level or "State"

    # Give more weight to category
    user_input = f"{category_text} {category_text} {level}"

    user_vector = vectorizer.transform([user_input])

    similarities = cosine_similarity(user_vector, tfidf_matrix)[0]

    top_indices = similarities.argsort()[::-1][:10]

    results = []

    for idx in top_indices:
        scheme = df.iloc[idx]

        results.append({
             "_id": scheme["_id"],
            "title": scheme["title"],
            "description": scheme["description"],
            "benefits": scheme["benefits"],
            "category": scheme["category"],
            "level": scheme["level"],
            "documents": scheme["documents"],
            "application": scheme["application"]
        })

    return results