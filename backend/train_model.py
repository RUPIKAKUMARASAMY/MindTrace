import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

# STEP 1: Load the dataset
data = pd.read_csv("dataset.csv")

# STEP 2: Separate input and output
X = data.drop("label", axis=1)   # questions
y = data["label"]                # result

# STEP 3: Create Random Forest model
model = RandomForestClassifier(n_estimators=100)

# STEP 4: Train the model
model.fit(X, y)

# STEP 5: Save the trained model
joblib.dump(model, "model.pkl")

print("Model trained successfully and saved as model.pkl")