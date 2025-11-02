const NGO = require('../models/ngo');
const Complaint = require('../models/complaint');

// Show registration page
exports.showRegister = (req, res) => {
    res.render('ngo-register', { error: null, success: null });
};

// Handle registration
exports.register = async (req, res) => {
    try {
        const { ngoName, username, email, phone, password, category, location, description } = req.body;

        const existingNGO = await NGO.findOne({ $or: [{ username }, { email }] });
        
        if (existingNGO) {
            return res.render('ngo-register', { 
                error: 'Username or email already exists', 
                success: null 
            });
        }

        const ngo = new NGO({
            ngoName,
            username,
            email,
            phone,
            password,
            category: Array.isArray(category) ? category : [category],
            location,
            description
        });

        await ngo.save();
        res.render('ngo-register', { 
            error: null, 
            success: 'Registration successful! Please login.' 
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.render('ngo-register', { 
            error: 'An error occurred. Please try again.', 
            success: null 
        });
    }
};

// Show login page
exports.showLogin = (req, res) => {
    res.render('login', { error: null });
};

// Handle login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const ngo = await NGO.findOne({ username });
        
        if (!ngo) {
            return res.render('login', { error: 'Invalid credentials' });
        }

        const isMatch = await ngo.comparePassword(password);
        
        if (!isMatch) {
            return res.render('login', { error: 'Invalid credentials' });
        }

        // Set session
        req.session.ngoId = ngo._id;
        req.session.ngoName = ngo.ngoName;
        req.session.username = ngo.username;
        
        console.log('Login successful:', ngo.ngoName);
        
        res.redirect('/ngo/dashboard');
    } catch (error) {
        console.error('Login error:', error);
        res.render('login', { error: 'An error occurred. Please try again.' });
    }
};

// Show dashboard
exports.showDashboard = async (req, res) => {
    try {
        res.render('dashboard', { 
            ngoName: req.session.ngoName,
            username: req.session.username 
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.redirect('/ngo/login');
    }
};

// Claim a complaint
exports.claimComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        
        console.log('=== CLAIM REQUEST ===');
        console.log('Complaint ID:', id);
        console.log('NGO Name:', req.session.ngoName);
        console.log('NGO ID:', req.session.ngoId);
        
        const complaint = await Complaint.findById(id);
        
        if (!complaint) {
            console.log('Complaint not found');
            return res.status(404).json({ error: 'Complaint not found' });
        }
        
        console.log('Current complaint status:', complaint.status);
        console.log('Currently assigned to:', complaint.assignedNGOName);
        
        if (complaint.assignedTo) {
            console.log('Already claimed');
            return res.status(400).json({ error: 'Already claimed by ' + complaint.assignedNGOName });
        }
        
        complaint.assignedTo = req.session.ngoId;
        complaint.assignedNGOName = req.session.ngoName;
        complaint.status = 'In Progress';
        complaint.claimedAt = new Date();
        
        await complaint.save();
        
        console.log('✅ Claim successful!');
        console.log('New status:', complaint.status);
        console.log('Assigned to:', complaint.assignedNGOName);
        
        res.json({ success: true, message: 'Complaint claimed successfully!' });
    } catch (error) {
        console.error('❌ Claim error:', error.message);
        console.error('Stack:', error.stack);
        res.status(500).json({ error: 'Failed to claim: ' + error.message });
    }
};

// Logout
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.redirect('/');
    });
};
