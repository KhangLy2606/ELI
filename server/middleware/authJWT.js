// server/middleware/authJWT.js
const jwt = require('jsonwebtoken');
// MODIFICATION: You'll need to add jwtRefreshSecret to your config file.
const { jwtSecret, jwtRefreshSecret } = require('../config');

/**
 * Middleware to authenticate a standard access token from the Authorization header.
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            // This will catch errors like 'jwt expired'
            console.error('JWT Verification Error:', err.message);
            return res.status(403).json({ message: 'Forbidden: Invalid or expired token.' });
        }
        req.user = user;
        next();
    });
};

/**
 * Route handler for refreshing an access token.
 * Expects a 'refreshToken' in the request body.
 * Verifies the refresh token and issues a new, short-lived access token.
 */
const handleTokenRefresh = (req, res) => {
    const { refreshToken } = req.body;

    if (refreshToken == null) {
        return res.status(401).json({ message: 'Refresh token is required.' });
    }

    jwt.verify(refreshToken, jwtRefreshSecret, (err, user) => {
        if (err) {
            console.error('Refresh Token Verification Error:', err.message);
            return res.status(403).json({ message: 'Forbidden: Invalid or expired refresh token.' });
        }

        const payload = { userId: user.userId, email: user.email };
        const newAccessToken = jwt.sign(payload, jwtSecret, { expiresIn: '15m' });

        res.json({
            token: newAccessToken
        });
    });
};


module.exports = {
    authenticateToken,
    handleTokenRefresh, // MODIFICATION: Export the new handler
};
