const express = require('express');
const router = express.Router();

// Default permanent demo user
let users = [
    { username: "daniya", password: "1234" }
];

// REGISTER
router.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password required"
        });
    }

    const userExists = users.find(user => user.username === username);

    if (userExists) {
        return res.status(409).json({
            message: "User already exists"
        });
    }

    users.push({ username, password });

    res.json({
        message: "Account created successfully"
    });
});

// LOGIN
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(user => user.username === username);

    if (!user || user.password !== password) {
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    res.json({
        message: "Login successful"
    });
});

// STRESS RESULT
router.post('/stress-result', (req, res) => {
    const { score } = req.body;

    let severity = "";
    let recommendation = "";

    if (score <= 10) {
        severity = "Low";
        recommendation = "Maintain a balanced lifestyle and continue healthy coping practices.";
    } 
    else if (score <= 20) {
        severity = "Moderate";
        recommendation = "Practice relaxation techniques such as breathing exercises and journaling.";
    } 
    else {
        severity = "High";
        recommendation = "Professional consultation is strongly recommended.";
    }

    res.json({
        severity,
        recommendation
    });
});

module.exports = router;