const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    if (!process.env.JWT_SECRET) {
        console.error('FATAL: JWT_SECRET environment variable is missing.');
        return res.status(500).json({ message: 'Server configuration error: JWT_SECRET missing' });
    }

    // Get token from header
    const authHeader = req.header('Authorization');
    
    // Check if no header or doesn't start with Bearer
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No authentication token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid or has expired' });
    }
};
