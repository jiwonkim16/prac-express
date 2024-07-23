const express = require('express');
const router = express.Router();

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
      // 쿠키에 인증 정보를 설정
      res.cookie('auth', { id }, { httpOnly: true });
      return res.status(200).send('User logged in and authenticated');
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
