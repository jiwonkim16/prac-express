const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const jsonServer = require("json-server");
const cors = require("cors");

const usersRouter = require('./routes/users');
const imagesRouter = require('./routes/images');
const { updateDeviceByUID } = require("./middleware/updateDevice");
const {deleteDeviceByUID} = require("./middleware/deleteDevice");
const addDeviceRouter = require('./routes/addDevice');

const app = express();
const router = jsonServer.router('./db.json'); // JSON Server 라우터 생성
const port = 3001;

app.use(cors({
  origin: 'http://localhost:3033', // 클라이언트 애플리케이션의 도메인
  credentials: true // 쿠키를 허용하려면 true로 설정
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/images', express.static(path.join(__dirname, 'public/uploads')));

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

// UID를 기준으로 업데이트하는 미들웨어 추가
app.use('/api/device', updateDeviceByUID);
app.use('/api/device', deleteDeviceByUID);

app.use('/api/device', addDeviceRouter)

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
