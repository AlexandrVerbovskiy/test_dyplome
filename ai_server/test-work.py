import numpy as np
import joblib
import pandas as pd

# Завантажте збережену модель і трансформери
model = joblib.load('client_rating_trainy.pkl')
tfidf_description = joblib.load('tfidf_client_rating_description.pkl')
tfidf_title = joblib.load('tfidf_client_rating_title.pkl')

# Дані для прогнозування
data = {
    'num_disputes': 0,
    'num_successful_orders': 50,
    'ratings': [],
    'order_description': "Complex task",
    'order_title': "Task B",
    'price': 250,
    'latitude': 49.99,
    'longitude': 36.23
}

# Перетворення текстових даних
X_description = tfidf_description.transform([data['order_description']])
X_title = tfidf_title.transform([data['order_title']])

# Заповнення рейтингових значень
max_num_ratings = len(data['ratings']) 
ratings_array = np.array([data['ratings'] + [0] * (max_num_ratings - len(data['ratings']))])

# Формування ознак
X_new = np.hstack([
    ratings_array,
    X_description.toarray(),
    X_title.toarray(),
    np.array([[data['num_disputes'], data['num_successful_orders'], 
               data['price'], data['latitude'], data['longitude']]])
])

# Перетворення X_new в DataFrame для відповідності з моделлю
X_new_df = pd.DataFrame(X_new)
X_new_df.columns = [f"feature_{i}" for i in range(X_new_df.shape[1])]  # Ненадійне присвоєння імен, якщо потрібно, налаштуйте відповідно

# Отримання імен ознак з тренувальної моделі
feature_names_in = model.feature_names_in_

# Перетворення X_new_df до правильної форми для моделі
X_new_df = X_new_df.reindex(columns=feature_names_in, fill_value=0)

# Отримання ймовірностей класів
prediction_proba = model.predict_proba(X_new_df)

# Отримання ймовірності небезпеки (True) для нового зразка
danger_probability = prediction_proba[0][1]

print(f"Probability of danger: {danger_probability * 100:.2f}%")