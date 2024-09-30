require('dotenv').config({ path: './config/.env' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const ExpressBrute = require('express-brute');
const csurf = require('csurf');

const connectDB = require('./config/db');
console.log('MONGO_URI:', process.env.MONGO_URI);

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://trusted.cdn.com"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https://trusted.image.cdn.com"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    hsts: {
      maxAge: 31536000, // One year
      includeSubDomains: true,
      preload: true,
    },
}));

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(hpp());
app.use(morgan('combined'));

// CSRF Protection
const csrfProtection = csurf({ cookie: true });

// CSRF Token Route
app.get('/api/csrf-token', csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() }); // Send CSRF token to client
});

// Secure Cookies
app.use((req, res, next) => {
    res.cookie('secureCookie', 'encryptedData', {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
    });
    next();
});

// Force HTTPS
app.use((req, res, next) => {
    if (req.secure) {
        next();
    } else {
        res.redirect(`https://${req.headers.host}${req.url}`);
    }
});

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
app.use(limiter);

// Brute-force protection
const store = new ExpressBrute.MemoryStore();
const bruteforce = new ExpressBrute(store);
app.use('/api/auth/login', bruteforce.prevent);

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// SSL Certificates
const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, 'certificates', 'server.key')),
    cert: fs.readFileSync(path.join(__dirname, 'certificates', 'server.cert')),
};

// Start the HTTPS Server
const PORT = process.env.PORT || 3000;
https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`Secure server running on port ${PORT}`);
});

// Redirect HTTP to HTTPS
const httpApp = express();
httpApp.use((req, res) => {
    res.redirect(`https://${req.headers.host}${req.url}`);
});

http.createServer(httpApp).listen(80, () => {
    console.log('HTTP server redirecting to HTTPS');
});

// Error Handling Middleware
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);
