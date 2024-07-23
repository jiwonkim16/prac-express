const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require("path");
const router = express.Router();

// 디렉토리가 없을 경우 생성해주는 예외처리, server listen 전 단계이므로 동기식 코드여도 무방
try {
    fs.readdirSync('public/uploads');  // 폴더 확인
} catch (e) {
    console.error('uploads 폴더가 없습니다. 폴더를 생성합니다.');
    fs.mkdirSync('public/uploads');
}

// 요청 타입이 multeipart/form-data인 경우 multer를 이용해 받을 수 있음
// storage는 저장할 공간에 대한 정보, 디스크나 메모리 저장 가능.
// diskStorage는 하드디스크에 업로드 파일을 저장한다는 것
// destination은 저장할 경로
// filename은 저장할 파일명(파일명+날짜+확장자 형식)
// Limits는 파일 개수나 파일 사이즈를 제한할 수 있음.
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {  // 저장 위치
            done(null, path.join(__dirname, '../public/uploads')); // uploads 폴더 안에 저장, 첫번째 인수엔 에러가 있다면 에러를 넣고 두번째 인수엔 실제 경로나 파일이름
        },
        filename(req, file, done) {  // 파일명을 어떤 이름으로 올릴지
            const decodedOriginalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
            const newFilename = `${decodedOriginalName}`;
            done(null, newFilename);
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }
});

// 파일 업로드 엔드포인트
router.post('/', (req, res, next) => {
    upload.single('files')(req, res, (err) => {
        if (err) {
            console.error('Multer error:', err);
            return res.status(500).send(err.message);
        }
        next();
    });
}, (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const db = req.db; // req 객체에서 데이터베이스 가져오기
    const fileRecord = {
        id: Date.now(),
        filePath: `/images/${req.file.filename}` // images 경로를 저장
    };

    try {
        // 파일 정보를 JSON DB에 저장
        db.get('images').push(fileRecord).write();

        res.status(201).json(fileRecord);
    } catch (e) {
        console.error('Error saving file record:', e);
        res.status(500).send(e.message);
    }
});

// 모든 이미지 정보를 반환하는 엔드포인트
router.get('/', (req, res) => {
    const db = req.db; // req 객체에서 데이터베이스 가져오기
    const images = db.get('images').value();
    res.status(200).json(images);
});

module.exports = router;
