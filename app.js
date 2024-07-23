const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const jsonServer = require("json-server");
const cors = require("cors");

const usersRouter = require('./routes/users');
const imagesRouter = require('./routes/images');

const app = express();
const router = jsonServer.router('./db.json'); // JSON Server 라우터 생성
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app 객체에 데이터베이스 추가
app.db = router.db;

// 사용자 정의 라우터를 먼저 설정
app.use('/api/users', (req, res, next) => {
  req.db = app.db;
  next();
}, usersRouter);

app.use('/api/images', (req, res, next) => {
  req.db = app.db;
  next();
}, imagesRouter);

// 정적 파일 제공
app.use('/images', express.static(path.join(__dirname, 'public/uploads')));

// JSON Server 라우터 설정
app.use('/api', (req, res, next) => {
  req.app.db = router.db; // JSON Server의 데이터베이스를 app 객체에 추가
  next();
}, router);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.listen(port, () => {
  console.log(`Server running on port : ${port}`);
});
