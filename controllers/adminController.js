const Admin = require('../models/Admin');
const Complaint = require('../models/complaint');
const NGO = require('../models/ngo');

// Show admin login page
exports.showLogin = (req, res) => {
    res.render('admin/login', { error: null });
};

// Handle admin login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });

        if (!admin) return res.render('admin/login', { error: 'Invalid credentials' });

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) return res.render('admin/login', { error: 'Invalid credentials' });

        // Set session
        req.session.adminId = admin._id;
        req.session.adminUsername = admin.username;

        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error(error);
        res.render('admin/login', { error: 'Something went wrong' });
    }
};

// Middleware to protect admin routes
exports.authMiddleware = (req, res, next) => {
    if (!req.session.adminId) return res.redirect('/admin/login');
    next();
};

// Show dashboard with complaints and NGOs
exports.showDashboard = async (req, res) => {
    try {
        const complaints = await Complaint.find().sort({ createdAt: -1 });
        const ngos = await NGO.find().sort({ ngoName: 1 });

        res.render('admin/dashboard', {
            adminUsername: req.session.adminUsername,
            complaints,
            ngos
        });
    } catch (error) {
        console.error(error);
        res.redirect('/admin/login');
    }
};

// Update complaint status (Admin)
exports.updateComplaintStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, assignedTo } = req.body; // assignedTo is NGO ID

        const complaint = await Complaint.findById(id);
        if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

        complaint.status = status || complaint.status;

        if (assignedTo) {
            const ngo = await NGO.findById(assignedTo);
            if (!ngo) return res.status(400).json({ error: 'Invalid NGO ID' });

            complaint.assignedTo = ngo._id;
            complaint.assignedNGOName = ngo.ngoName;
        }

        await complaint.save();
        res.json({ success: true, complaint });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update complaint' });
    }
};

// Delete complaint (Admin)
exports.deleteComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        await Complaint.findByIdAndDelete(id);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete complaint' });
    }
};

// Logout
exports.logout = (req, res) => {
    req.session.destroy(() => res.redirect('/admin/login'));
};
