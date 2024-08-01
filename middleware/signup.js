// const express = require('express')
// const router = express.Router()
// router.post('/signup', (req, res, next)=>{
//     const user = req.body
//     const id = user.id
//     const db = req.db
//
//     const existingUser = db.get('login').find({ id }).value();
//     if(existingUser) {
//         return res.status(400).json({message : "존재하는 ID 입니다"})
//     } else{
//         db.get('login').push(user).write()
//         return res.status(200).json({message : "회원가입 완료"})
//     }
// })