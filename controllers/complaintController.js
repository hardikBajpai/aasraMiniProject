const Complaint = require('../models/complaint');

// Submit a new complaint
exports.submitComplaint = async (req, res) => {
    try {
        const { name, email, phone, category, description, location } = req.body;
        
        console.log('Received complaint:', req.body); // Debug log
        
        const complaint = new Complaint({
            name,
            email,
            phone,
            category,
            description,
            location: location || 'Not specified' // Default if missing
        });

        await complaint.save();
        console.log('Complaint saved successfully'); // Debug log
        res.redirect('/?success=true');
    } catch (error) {
        console.error('Error submitting complaint:', error);
        res.redirect('/?error=true');
    }
};

// Get all complaints (for NGO dashboard)
exports.getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .sort({ createdAt: -1 });
        
        console.log('Fetched complaints:', complaints.length); // Debug log
        res.json(complaints);
    } catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({ error: 'Failed to fetch complaints' });
    }
};

// Update complaint status
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updateData = { status };
        if (status === 'Resolved') {
            updateData.resolvedAt = new Date();
        }

        await Complaint.findByIdAndUpdate(id, updateData);
        res.json({ success: true, message: 'Status updated successfully' });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
};

// Delete complaint
exports.deleteComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        await Complaint.findByIdAndDelete(id);
        res.json({ success: true, message: 'Complaint deleted successfully' });
    } catch (error) {
        console.error('Error deleting complaint:', error);
        res.status(500).json({ error: 'Failed to delete complaint' });
    }
};
