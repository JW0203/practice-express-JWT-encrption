const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) =>{
    const autherHeader = req.headers.authorization;
    const token = autherHeader && autherHeader.split(' ')[1];

    if(!token){
        res.status(401).send("Header에 JWT 토큰을 넣어야 합니다.")
        return;
    }

    //복호화 시키기 & 토큰기한 만료 체크
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) =>{
        if(err){
            // console.log(err)
            console.log(err.message)
            if (err.message === "jwt expired"){
                return res.status(401).send("토큰기한이 만료되었습니다.")
            }
            return res.status(401).send("잘못된 토큰입니다.")
        }
        req.user = user;
        next();
    })
}
module.exports = authenticateToken;