const jwt = require("jsonwebtoken");

const SECRET_KEY = 'supernova';
const REFRESH_SECRET_KEY = 'refreshSupernova';

const generateToken = (payload) => {
    const token = jwt.sign({ id: payload.id }, SECRET_KEY, { expiresIn: '1m' }); // Access Token 만료 시간 1분
    return token;
};

const generateRefreshToken = (payload) => {
    const token = jwt.sign({ id: payload.id }, REFRESH_SECRET_KEY, { expiresIn: '7d' }); // Refresh Token 만료 시간 7일
    return token;
};

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        return decoded;
    } catch (error) {
        console.error('Error verifying Token', error);
        return null;
    }
};

const refreshToken = (refreshTokenValue) => {
    try {
        const decoded = jwt.verify(refreshTokenValue, REFRESH_SECRET_KEY);
        const payload = { id: decoded.id };
        const newToken = generateToken(payload); // 새로운 액세스 토큰 생성
        return newToken;
    } catch (error) {
        console.error('Error refreshing Token', error);
        return null;
    }
};

module.exports = { generateToken, generateRefreshToken, verifyToken, refreshToken };
