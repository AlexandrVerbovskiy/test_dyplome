import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
import joblib

model = joblib.load('pkls/client_rating_trainy.pkl')
tfidf_description = joblib.load('pkls/tfidf_client_rating_description.pkl')
tfidf_title = joblib.load('pkls/tfidf_client_rating_title.pkl')

data = {
    'num_disputes': 50,
    'num_successful_orders': 50,
    'ratings': [2],
    'order_description': "No issues",
    'order_title': "Task J",
    'price': 200,
    'latitude': 50,
    'longitude': 30
}

X_description = tfidf_description.transform([data['order_description']])
X_title = tfidf_title.transform([data['order_title']])

max_num_ratings = len(data["ratings"])
ratings_array = np.array([data['ratings'] + [0] * (max_num_ratings - len(data['ratings']))])

X_new = np.hstack([
    ratings_array,
    X_description.toarray(),
    X_title.toarray(),
    np.array([[data['num_disputes'], data['num_successful_orders'], 
               data['price'], data['latitude'], data['longitude']]])
])

print(f"Shape of X_new: {X_new.shape}")

X_new_df = pd.DataFrame(X_new, columns=[str(i) for i in range(X_new.shape[1])])

print("Feature names in the model:", model.feature_names_in_)
print("Feature names in X_new_df:", X_new_df.columns)

X_new_df = X_new_df.reindex(columns=model.feature_names_in_, fill_value=0)

prediction_proba = model.predict_proba(X_new_df)
print(f"Prediction probabilities: {prediction_proba}")

danger_probability = prediction_proba[0][1]
print(f"Probability of danger: {danger_probability * 100:.2f}%")