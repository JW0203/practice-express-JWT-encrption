const {User} =require('../models');
const sequelize = require('../config/database');
const express = require('express');
const app = express();
const router = express.Router();
const HttpExecption = require('../middleware/HttpException')
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

router.use((err, req, res, next) =>{
    console.log(err);
    if (err instanceof HttpExecption){
        res.status(err.status).send(err);
    }
    res.status(500).send({
        message: "Error occurred while sign-up process"
    })
})

module.exports = router;