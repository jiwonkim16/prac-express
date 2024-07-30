const jwt = require('jsonwebtoken')
const {refreshToken} = require('./jwt')

const refreshJwtMiddleware = (req, res, next)=>{
    const token = req.cookie.token
    if(token){
        const newToken = refreshToken(token)

        if(newToken){
            res.cookie('refreshToken', newToken, {httpOnly : true, maxAge : 3600000})
        }
    }
    next()
}

module.exports = refreshJwtMiddleware