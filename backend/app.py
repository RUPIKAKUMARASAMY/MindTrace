from flask import Flask, render_template, request, jsonify, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__, template_folder="../templates", static_folder="../static")

app.config['SECRET_KEY'] = 'mindtrace_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mindtrace.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"


# -----------------------------------
# DATABASE MODEL
# -----------------------------------

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)


class Result(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    test_name = db.Column(db.String(100))
    score = db.Column(db.Integer)
    severity = db.Column(db.String(50))


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


# -----------------------------------
# AUTH PAGES
# -----------------------------------

@app.route("/login")
def login():
    return render_template("login.html")


@app.route("/register")
def register():
    return render_template("register.html")


@app.route("/register-user", methods=["POST"])
def register_user():
    username = request.form.get("username")
    email = request.form.get("email")
    password = request.form.get("password")

    hashed_password = generate_password_hash(password)

    new_user = User(
        username=username,
        email=email,
        password=hashed_password
    )

    db.session.add(new_user)
    db.session.commit()

    return redirect(url_for("login"))


@app.route("/login-user", methods=["POST"])
def login_user_route():
    email = request.form.get("email")
    password = request.form.get("password")

    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        login_user(user)
        return redirect(url_for("dashboard"))

    return "Invalid login credentials"


@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("login"))


# -----------------------------------
# MAIN PAGES
# -----------------------------------

@app.route("/")
@login_required
def dashboard():
    return render_template("dashboard.html")


@app.route("/assessment")
@login_required
def assessment():
    return render_template("assessment.html")
@app.route("/games")
@login_required
def games():
    return render_template("games.html")


@app.route("/blog")
def blog():
    return render_template("blog.html")


@app.route("/article.html")
def article():
    return render_template("article.html")


@app.route("/mood")
@login_required
def mood():
    return render_template("mood.html")


@app.route("/consultation")
def consultation():
    return render_template("consultation.html")


@app.route("/results")
@login_required
def results():
    user_results = Result.query.filter_by(user_id=current_user.id).all()
    return render_template("results.html", results=user_results)


# ✅ ADDED HERE (ONLY ADDITION)
@app.route("/user")
@login_required
def user():
    return render_template("user.html")


# ✅ EXISTING API
@app.route("/api/get-user-results")
@login_required
def get_user_results():
    results = Result.query.filter_by(user_id=current_user.id).all()

    data = []
    for r in results:
        data.append({
            "test_name": r.test_name,
            "score": r.score,
            "severity": r.severity
        })

    return jsonify(data)


# -----------------------------------
# TEST PAGES
# -----------------------------------

@app.route("/stress")
def stress():
    return render_template("stress.html")


@app.route("/anxiety")
def anxiety():
    return render_template("anxiety.html")


@app.route("/depression")
def depression():
    return render_template("depression.html")


@app.route("/adhd")
def adhd():
    return render_template("adhd.html")


@app.route("/ptsd")
def ptsd():
    return render_template("PTSD.html")


@app.route("/addiction")
def addiction():
    return render_template("addiction.html")


@app.route("/social-anxiety")
def social_anxiety():
    return render_template("social anxiety.html")


@app.route("/youth")
def youth():
    return render_template("youth.html")


# -----------------------------------
# COMMON RESULT SAVING FUNCTION
# -----------------------------------

def save_result(test_name, score):
    print("DEBUG: Saving result →", test_name, score)

    if score <= 10:
        severity = "Low"
        recommendation = "Your condition appears mild."

    elif score <= 20:
        severity = "Moderate"
        recommendation = "You may benefit from self-care and monitoring."

    else:
        severity = "High"
        recommendation = "Consider professional help."

    result = Result(
        user_id=current_user.id,
        test_name=test_name,
        score=score,
        severity=severity
    )

    db.session.add(result)
    db.session.commit()

    return severity, recommendation


# -----------------------------------
# APIs
# -----------------------------------

@app.route("/api/stress-result", methods=["POST"])
@login_required
def stress_result():
    data = request.get_json()
    score = data["score"]

    severity, recommendation = save_result("Stress", score)

    return jsonify({
        "severity": severity,
        "recommendation": recommendation
    })


@app.route("/api/anxiety-result", methods=["POST"])
@login_required
def anxiety_result():
    data = request.get_json()
    score = data["score"]

    severity, recommendation = save_result("Anxiety", score)

    return jsonify({
        "severity": severity,
        "recommendation": recommendation
    })


@app.route("/api/depression-result", methods=["POST"])
@login_required
def depression_result():
    data = request.get_json()
    score = data["score"]

    severity, recommendation = save_result("Depression", score)

    return jsonify({
        "severity": severity,
        "recommendation": recommendation
    })


# -----------------------------------
# CHATBOT
# -----------------------------------

@app.route("/chatbot", methods=["POST"])
def chatbot():
    data = request.get_json()
    message = data.get("message", "").lower()

    if "stress" in message:
        reply = "It sounds like you're experiencing stress. You may want to try the Stress Assessment."

    elif "anxiety" in message or "anxious" in message:
        reply = "Anxiety can feel overwhelming. Our Anxiety Assessment may help you understand your symptoms."

    elif "sad" in message or "depressed" in message:
        reply = "I'm sorry you're feeling this way. The Depression Assessment may help you reflect on your feelings."

    elif "hello" in message or "hi" in message:
        reply = "Hello! I'm MindTrace AI. How are you feeling today?"

    else:
        reply = "MindTrace can help you explore your mental wellbeing through assessments, mood tracking, and articles."

    return jsonify({"reply": reply})


# -----------------------------------
# CREATE DATABASE
# -----------------------------------

with app.app_context():
    db.create_all()


# -----------------------------------
# RUN APP
# -----------------------------------

if __name__ == "__main__":
    app.run(debug=True)