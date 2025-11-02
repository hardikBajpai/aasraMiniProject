const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();
const adminRoutes = require('./routes/adminRoutes');
const connectDB = require('./config/db');
const complaintController = require('./controllers/complaintController');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const publicRoutes = require('./routes/publicRoutes');
const ngoRoutes = require('./routes/ngoRoutes');

app.use('/', publicRoutes);
app.use('/ngo', ngoRoutes);

app.use('/admin', adminRoutes);

// API routes for dashboard
app.get('/api/complaints', complaintController.getAllComplaints);
app.put('/api/complaints/:id/status', complaintController.updateStatus);
app.delete('/api/complaints/:id', complaintController.deleteComplaint);

// 404 handler
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Run only locally
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
}

// Export the app for Vercel
module.exports = app;

