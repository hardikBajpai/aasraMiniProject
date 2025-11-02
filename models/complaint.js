const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Education', 'Healthcare', 'Housing', 'Employment', 'Legal Aid', 
               'Food & Nutrition', 'Women Safety', 'Child Welfare', 'Other']
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Open', 'Pending', 'In Progress', 'Resolved'],  // Added 'Pending' to enum
        default: 'Open'  // Changed default to 'Open'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NGO',
        default: null
    },
    assignedNGOName: {
        type: String,
        default: null
    },
    claimedAt: {
        type: Date
    },
    resolvedAt: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Complaint', complaintSchema);
