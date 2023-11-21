require('dotenv').config()
const {User} =require('../models');
const sequelize = require('../config/database');
const express = require('express');
const app = express();
const router = express.Router();
const HttpExecption = require('../middleware/HttpException')
const jwt = require('jsonwebtoken')
app.use(express.json());


router.post('/sign-up', async (req, res, next) =>{
    const {email, password} = req.body;

    try{
        const newUser = await sequelize.transaction( async ()=> {

            const checkEmailRegExp = /^[0-9a-zA-Z]([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,5}$/;
            if(!email.match(checkEmailRegExp)){
                throw new HttpExecption(401, "Please check your email address, again");
                return;
            }

            const checkPasswordRegExp = /^([0-9a-zA-Z]+)$/
            if (!password.match(checkPasswordRegExp)){
                throw new HttpExecption(401, "Password must consist of alphabets or numbers and can not contain blank space.")
                return;
            }

            const checkPasswordLength = password.length;
            if(checkPasswordLength < 8 || checkPasswordLength>15){
                throw new HttpExecption(401,"Password should be over 8 numbers and under 15 numbers." );
                return;
            }
            const newUserInformation = await User.create({
                email,
                password
            });
            return newUserInformation;
        });
        res.status(200).send(newUser);
    }catch(err){
        next(err);
        // console.log('Error occurred while sign-up process')
        // res.status(500).send(err)
    }

})

router.post('/sign-in', async(req, res, next) =>{
    const {email, password} = req.body;

    try{
        const checkSignInValidation = await sequelize.transaction(async ()=>{

            const user = await User.findOne({
                where:{email : email}
            });
            if(!user){
                throw new HttpExecption(401, "There is no matching email");
                return;
            }

            if(user.password !== password){
                throw new HttpExecption(401, "Passsword is wrong");
                return;
            }

            const accessToken = jwt.sign({id: user.id}, process.env.JWT_SECRET_KEY,{
                expiresIn: "10s"
            });
            res.status(200).send({ "ACCESS_TOKEN" :accessToken })
        })

    }catch(err){
        next(err);
    }

})

router.use((err, req, res, next) =>{
    console.log(err);
    if (err instanceof HttpExecption){
        res.status(err.status).send(err);
    }
    res.status(500).send({
        message: "Internal Error occurred while processing"
    })
})

module.exports = router;