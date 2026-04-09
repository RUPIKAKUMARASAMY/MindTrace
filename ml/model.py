from flask import Flask, request, jsonify
from sklearn.ensemble import RandomForestClassifier
import numpy as np

app = Flask(__name__)

# -----------------------------
# Create Dummy Training Data
# -----------------------------

# 10 features now (for 10 questions)
X = np.array([
    [0,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1],
    [2,2,2,2,2,2,2,2,2,2],
    [3,3,3,3,3,3,3,3,3,3],
    [3,2,3,2,3,2,3,2,3,2],
    [1,0,1,0,1,0,1,0,1,0]
])

# Labels
# 0 = Minimal
# 1 = Mild
# 2 = Moderate
# 3 = Severe
y = np.array([0,1,2,3,3,1])

model = RandomForestClassifier()
model.fit(X, y)

# -----------------------------
# Prediction Route
# -----------------------------

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    answers = data["answers"]

    prediction = model.predict([answers])[0]

    severity_map = {
        0: "Minimal",
        1: "Mild",
        2: "Moderate",
        3: "Severe"
    }

    return jsonify({
        "prediction": severity_map[prediction]
    })

if __name__ == "__main__":
    app.run(port=5000)