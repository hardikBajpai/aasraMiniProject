const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');

// Show homepage with complaint form
router.get('/', (req, res) => {
    res.render('index', { 
        success: req.query.success,
        error: req.query.error 
    });
});

// Submit complaint
router.post('/submit-complaint', complaintController.submitComplaint);

module.exports = router;
