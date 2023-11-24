require('dotenv').config()
const {User} =require('../models');
const sequelize = require('../config/database');
const express = require('express');
const router = express.Router();
const HttpException = require('../middleware/HttpException')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

router.post('/sign-up', async (req, res, next) =>{
    const {email, password} = req.body;

    try{
        await sequelize.transaction( async ()=> {

            const checkEmailRegExp = /^[0-9a-zA-Z]([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,5}$/;
            const emailDuplication = await User.findOne({
                where:{
                    email
                }
            })
            if(emailDuplication){
                throw new HttpException(401, "The email address is existing.");
                return;
            }

            if(!email.match(checkEmailRegExp)){
                throw new HttpException(401, "Please check your email address, again");
                return;
            }

            const checkPasswordRegExp = /^([0-9a-zA-Z]+)$/
            if (!password.match(checkPasswordRegExp)){
                throw new HttpException(401, "Password must consist of alphabets or numbers and can not contain blank space.")
                return;
            }

            const checkPasswordLength = password.length;
            if(checkPasswordLength < 8 || checkPasswordLength>15){
                throw new HttpException(401,"Password should be over 8 numbers and under 15 numbers." );
                return;
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const newUserInformation = await User.create({
                email,
                password: hashedPassword
            });
            res.status(201).send(newUserInformation);
        });
    }catch(err){
        next(err);
    }

})

router.post('/sign-in', async(req, res, next) =>{
    const {email, password} = req.body;

    try{
        const checkSignInValidation = await sequelize.transaction(async ()=>{

            const user = await User.findOne({
                where: { email }
            });
            if(!user){
                throw new HttpException(401, "There is no matching email");
                return;
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if(!isPasswordValid){
                throw new HttpException(401, "Passsword is wrong");
                return;
            }

            const accessToken = jwt.sign({id: user.id}, process.env.JWT_SECRET_KEY,{
                expiresIn: "1m"
            });
            res.status(200).send({ accessToken })

        })
        // POST /auth/sign-up

    } catch(err){
        next(err);
    }

})

module.exports = router;