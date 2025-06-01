require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Route Imports
const userRoutes = require('./routes/userRoutes');
const referralRoutes = require('./routes/referralRoutes');
const adminRoutes = require('./routes/adminRoutes');
const rewardRoutes = require('./routes/rewardRoutes');
const shopifyRoutes = require('./routes/shopifyRoutes'); // ✅ Shopify webhook
const announcementRoutes = require('./routes/announcementRoutes'); // ✅ NEW

// ✅ Mount API Routes
app.use('/api/users', userRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/shopify', shopifyRoutes);
app.use('/api', announcementRoutes); // ✅ Mount under /api

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// ✅ Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
