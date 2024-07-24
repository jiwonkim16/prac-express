const express = require('express');
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const router = express.Router();

const SECRET_KEY = 'supernova'

router.use(bodyParser.json())
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 로그인 엔드포인트
router.post('/login', (req, res) => {
  const { id, password } = req.body;
  const db = req.db; // req 객체에서 데이터베이스 가져오기

  // 사용자 정보 확인
  const existingUser = db.get('login').find({ id }).value();

  if (existingUser) {
    // 비밀번호가 일치하는지 확인
    if (existingUser.password === password) {
      // JWT Token 생성
      const token = jwt.sign({id : id.split("@")[0]}, SECRET_KEY, {expiresIn : '1h'})
      return res.status(200).json({message : 'User logged in and authenticated', token : token});
    } else {
      // 비밀번호가 일치하지 않으면 오류 반환
      return res.status(400).send('Incorrect password.');
    }
  } else {
    // 사용자가 존재하지 않으면 오류 반환
    return res.status(400).send('User does not exist.');
  }
});

module.exports = router;
