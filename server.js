const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware configurations
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

// Serve static files (HTML, CSS, JS, Images) from the current directory
app.use(express.static(path.join(__dirname)));

// ----------------------------------------------------
// Mock Database
// ----------------------------------------------------
const destinations = [
    {
        id: 1,
        image: 'tropical_beach.png',
        alt: 'Tropical Beach Resort',
        location: 'Maldives',
        title: 'Crystal Blue Resort',
        description: 'Experience ultimate relaxation in overwater bungalows with pristine ocean views.',
        price: '$1,299',
        delay: '0.1s'
    },
    {
        id: 2,
        image: 'paris_city.png',
        alt: 'Historic European City',
        location: 'Paris, France',
        title: 'Romantic City Escape',
        description: 'Stroll through cobblestone streets and enjoy world-class culinary experiences.',
        price: '$899',
        delay: '0.2s'
    },
    {
        id: 3,
        image: 'desert_safari.png',
        alt: 'Desert Safari Dubai',
        location: 'Dubai, UAE',
        title: 'Golden Dunes Safari',
        description: 'An exhilarating off-road adventure through the vast golden sand dunes.',
        price: '$650',
        delay: '0.3s'
    }
];

// ----------------------------------------------------
// API Endpoints
// ----------------------------------------------------

// GET: Retrieve all destinations
app.get('/api/destinations', (req, res) => {
    // In a real app, this would fetch from a database like MongoDB or PostgreSQL
    res.json(destinations);
});

// GET: Retrieve a single destination by ID
app.get('/api/destinations/:id', (req, res) => {
    const destId = parseInt(req.params.id);
    const destination = destinations.find(d => d.id === destId);
    
    if (!destination) {
        return res.status(404).json({ error: 'Destination not found' });
    }
    
    res.json(destination);
});

// POST: Handle a booking request
app.post('/api/bookings', (req, res) => {
    const { destinationId, name, email, date, travelingGuests } = req.body;
    
    // Basic validation
    if (!destinationId || !name || !email) {
        return res.status(400).json({ error: 'Missing required booking fields' });
    }
    
    // In a real application, you would save this booking to your database
    const newBooking = {
        bookingId: 'BK' + Math.floor(Math.random() * 100000),
        destinationId,
        name,
        email,
        date: date || new Date().toISOString(),
        travelingGuests: travelingGuests || 1,
        status: 'confirmed'
    };
    
    console.log('New booking received:', newBooking);
    
    // Respond with success
    res.status(201).json({ 
        message: 'Booking successfully confirmed!', 
        booking: newBooking 
    });
});

// POST: Handle a contact form submission
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing required contact fields' });
    }
    
    console.log('New contact message received:', { name, email, message: message.substring(0, 50) + '...' });
    
    res.status(200).json({ 
        success: true,
        message: 'Thank you for contacting us! We will get back to you soon.' 
    });
});

// POST: Handle a newsletter subscription
app.post('/api/newsletter', (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    
    console.log('New newsletter subscription:', email);
    
    res.status(200).json({ 
        success: true,
        message: 'Successfully subscribed to the newsletter!' 
    });
});

// Handle Fallback (redirect unknown paths to the main HTML)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'first.html'));
});

// ----------------------------------------------------
// Start the Server
// ----------------------------------------------------
app.listen(PORT, () => {
    console.log(`🚀 Server is running smoothly on http://localhost:${PORT}`);
    console.log(`➡️  View the API data at http://localhost:${PORT}/api/destinations`);
});
