// 1. นำเข้าไลบรารีที่จำเป็น
const passport = require('passport');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

// 2. นำเข้าโมดูล User หรือตาราง User จากฐานข้อมูล
const User = require('./models/User');

// 3. กำหนด JWT options
const jwtOptions = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
};

// 4. กำหนด JWT strategy
const strategy = new JWTStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
        const user = await User.findById(jwtPayload.id);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
});

// 5. เริ่มต้นใช้ Passport
passport.use(strategy);

// 6. Middleware function สำหรับการตรวจสอบสิทธิ์การเข้าถึง (Authorization)
const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (roles && !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        next();
    };
};

module.exports = {
    passport,
    authorize
};
