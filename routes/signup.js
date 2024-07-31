// const express = require('express')
// const router = express.Router()
//
// router.post('/signup', (req, res, next)=>{
//     const user = req.body
//     const db = req.db
//
//     const existingUser = db.get('login').find({id}).value()
//     if(existingUser) {
//         if(existingUser.id === user.id){
//             return res.status(400).send("존재하는 ID 입니다")
//         } else{
//             req.app.db.get('login').push(user).write()
//             return res.status(200).json({message : "회원가입 완료"})
//         }
//     }
// })