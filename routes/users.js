const express = require('express');
const bodyParser = require('body-parser');
const { generateToken, generateRefreshToken, refreshToken } = require("../middleware/jwt");
const router = express.Router();

router.use(bodyParser.json());

router.post('/login', (req, res) => {
  const { id, password } = req.body;
  const db = req.db;

  const existingUser = db.get('login').find({ id }).value();
  if (existingUser) {
    if (existingUser.password === password) {
      const accessToken = generateToken(existingUser);
      const refreshTokenValue = generateRefreshToken(existingUser);

      res.cookie('refreshToken', refreshTokenValue, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
      res.status(200).json({ message: 'User logged in and authenticated', token: accessToken });
    } else {
      return res.status(400).send('Incorrect password.');
    }
  } else {
    return res.status(400).send('User does not exist.');
  }
});

router.post('/refresh-token', (req, res) => {
  const refreshTokenValue = req.cookies.refreshToken;

  if (!refreshTokenValue) {
    return res.status(401).send('Refresh token is missing');
  }

  const newAccessToken = refreshToken(refreshTokenValue);
  if (newAccessToken) {

    res.status(200).json({ token: newAccessToken });
  } else {
    console.log('Invalid or expired refresh token');
    res.status(403).send('Refresh token is invalid or expired');
  }
});

module.exports = router;
