const express = require('express');
const app = express();
const PORT = 3000;

const authRoutes = require('./routes/authRoutes');

app.use(express.json());
app.use(express.static('public'));   // 👈 ADD THIS
app.use('/api', authRoutes);

app.get('/', (req, res) => {
    res.send('MindTrance Server is Running 🚀');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});