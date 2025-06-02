require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const chartRoutes = require('./routes/chartRoutes');
app.use('/api/charts', chartRoutes);
// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Route Imports
const userRoutes = require('./routes/userRoutes');
const referralRoutes = require('./routes/referralRoutes');
const adminRoutes = require('./routes/adminRoutes');
const rewardRoutes = require('./routes/rewardRoutes');
const shopifyRoutes = require('./routes/shopifyRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const shopifyAdminRoutes = require('./routes/shopifyAdminRoutes');
app.use('/api/shopify-admin', shopifyAdminRoutes);

// ✅ Health Check
app.get('/health', (req, res) => res.send('OK'));

// ✅ Mount Routes
app.use('/api/users', userRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/shopify', shopifyRoutes);
app.use('/api', announcementRoutes);

// ✅ DB Connect
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// ✅ Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
