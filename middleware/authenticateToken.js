const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) =>{
    const autherHeader = req.headers.authorization;
    // autherHeader 가 undefined 이면 false 를 반환
    // autherHeader 에 값이 있으면 && 뒤에 코드를 수행
    const token = autherHeader && autherHeader.split(' ')[1];

    if(!token){
        res.status(401).send("Header에 JWT 토큰을 넣어야 합니다.")
        return;
    }

    //복호화 시키기
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) =>{
        if(err){
            console.log(err)
            return res.status(401).send("잘못된 토큰입니다.")
        }
        req.user = user;
        next();
    })
}
module.exports = authenticateToken;