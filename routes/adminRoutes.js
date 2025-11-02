const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/login', adminController.showLogin);
router.post('/login', adminController.login);

router.use(adminController.authMiddleware); // Protect routes below

router.get('/dashboard', adminController.showDashboard);

// API routes for updating and deleting complaints by admin
router.put('/complaints/:id/status', adminController.updateComplaintStatus);
router.delete('/complaints/:id', adminController.deleteComplaint);

router.get('/logout', adminController.logout);

module.exports = router;
