const express = require('express');
const router = express.Router();
const ngoController = require('../controllers/ngoController');
const authMiddleware = require('../middleware/authMiddleware');

// Registration
router.get('/register', ngoController.showRegister);
router.post('/register', ngoController.register);

// Login routes
router.get('/login', ngoController.showLogin);
router.post('/login', ngoController.login);

// Dashboard (protected)
router.get('/dashboard', authMiddleware, ngoController.showDashboard);

// Claim a complaint (protected)
router.post('/claim/:id', authMiddleware, ngoController.claimComplaint);

// Logout
router.get('/logout', ngoController.logout);

module.exports = router;
