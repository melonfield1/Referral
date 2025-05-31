const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referralController');

router.post('/create', referralController.createReferral);
router.post('/purchase-completed', referralController.markPurchaseCompleted);
router.get('/user/:userId', referralController.getReferralsByUser);

module.exports = router;
