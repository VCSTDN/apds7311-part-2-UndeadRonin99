const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (ex) {
        res.status(400).send('Invalid token.');
    }
};

exports.authorize = (role) => (req, res, next) => {
    if (req.user.role !== role) {
        return res.status(403).send('Access denied.');
    }
    next();
};
