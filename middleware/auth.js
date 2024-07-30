const jwt = require('jsonwebtoken');
const SECRET_KEY = 'supernova';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                console.error('Token verification error:', err); // 에러 로그 추가
                if (err.name === 'TokenExpiredError') {
                    // 만료된 토큰인 경우 401 응답을 반환
                    return res.status(401).json({ message: 'Token expired' });
                } else {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
            } else {
                req.user = user;
                next();
            }
        });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = authMiddleware;
