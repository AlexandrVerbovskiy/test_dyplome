import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib

# Підготовка даних
data = pd.DataFrame({
    'num_disputes': [1, 0, 3, 2, 0, 1, 5, 0, 1, 0],
    'num_successful_orders': [20, 50, 5, 10, 60, 45, 3, 100, 55, 60],
    'ratings': [
        [5, 4], [3, 2], [1], [4, 5], [5, 5], [4], [1, 2, 1], [5], [4, 3], [5]
    ],
    'order_description': [
        "Simple task", "Complex task", "Urgent task", "High payment",
        "Standard task", "Low payment", "Multiple revisions", "Quick task", "Detailed task", "No issues"
    ],
    'order_title': [
        "Task A", "Task B", "Task C", "Task D", "Task E", "Task F", "Task G", "Task H", "Task I", "Task J"
    ],
    'price': [100, 250, 500, 300, 200, 150, 450, 1000, 250, 200],
    'latitude': [50.45, 49.99, 50.45, 50.45, 49.84, 50.45, 49.99, 48.45, 46.48, 50.45],
    'longitude': [30.52, 36.23, 30.52, 30.52, 24.03, 30.52, 36.23, 34.98, 30.74, 30.52],
     'success': [True, True, False, False, True, True, False, True, True, True]
})

# TF-IDF перетворення текстових даних
tfidf_description = TfidfVectorizer()
tfidf_title = TfidfVectorizer()

X_description = tfidf_description.fit_transform(data['order_description'])
X_title = tfidf_title.fit_transform(data['order_title'])

# Заповнення рейтингових значень
max_num_ratings = max(len(r) for r in data['ratings'])
ratings_array = np.array([r + [0] * (max_num_ratings - len(r)) for r in data['ratings']])

# Формування ознак
X = pd.concat([
    pd.DataFrame(X_description.toarray(), index=data.index),
    pd.DataFrame(X_title.toarray(), index=data.index),
    pd.DataFrame(ratings_array, index=data.index),
    data[['num_disputes', 'num_successful_orders', 'price', 'latitude', 'longitude']]
], axis=1)

# Переконайтесь, що усі імена стовпців є рядками
X.columns = X.columns.astype(str)

# Розділення даних на навчальну та тестову вибірки
X_train, X_test, y_train, y_test = train_test_split(X, data['success'], test_size=0.2, random_state=42)

# Переконайтесь, що стовпці в X_train і X_test є рядками
X_train.columns = X_train.columns.astype(str)
X_test.columns = X_test.columns.astype(str)

# Створення і тренування моделі
model = RandomForestClassifier(random_state=42)
model.fit(X_train, y_train)

# Збереження моделі та трансформерів
joblib.dump(model, 'pkls/client_rating_trainy.pkl')
joblib.dump(tfidf_description, 'pkls/tfidf_client_rating_description.pkl')
joblib.dump(tfidf_title, 'pkls/tfidf_client_rating_title.pkl')

# Оцінка моделі
y_pred = model.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, y_pred)}")
print(classification_report(y_test, y_pred))