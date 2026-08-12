const VALID_CARD_NUMBERS = new Set(['4444', '5555', '6666', '7777']);

exports.validatePayment = async (req, res) => {
    try {
        const { cardNumber } = req.body || {};

        if (typeof cardNumber !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Card number is required'
            });
        }

        const sanitized = cardNumber.replace(/\s+/g, '').trim();

        if (!sanitized) {
            return res.status(400).json({
                success: false,
                error: 'Card number is required'
            });
        }

        if (!VALID_CARD_NUMBERS.has(sanitized)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid Card Number'
            });
        }

        return res.status(200).json({
            success: true
        });
    } catch (error) {
        console.error('❌ Payment validation error:', error.message);
        return res.status(500).json({
            success: false,
            error: 'Payment validation failed'
        });
    }
};
