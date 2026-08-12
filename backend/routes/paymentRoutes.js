const express = require('express');
const router = express.Router();
const { validatePayment } = require('../controllers/paymentController');

router.post('/validate', validatePayment);

module.exports = router;
