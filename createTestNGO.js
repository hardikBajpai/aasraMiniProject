const mongoose = require('mongoose');
require('dotenv').config();
const NGO = require('./models/ngo');

async function createTestNGO() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if test NGO already exists
        const existing = await NGO.findOne({ username: 'testngo' });
        
        if (existing) {
            console.log('Test NGO already exists');
            process.exit(0);
        }

        // Create test NGO
        const ngo = new NGO({
            ngoName: 'Test NGO Foundation',
            username: 'testngo',
            email: 'test@ngo.com',
            phone: '9876543210',
            password: 'test123',
            category: ['Education', 'Healthcare'],
            location: 'Mumbai',
            description: 'Test NGO for development'
        });

        await ngo.save();
        console.log('✅ Test NGO created successfully!');
        console.log('Username: testngo');
        console.log('Password: test123');
        
        process.exit(0);
    } catch (error) {
        console.error('Error creating test NGO:', error);
        process.exit(1);
    }
}

createTestNGO();
