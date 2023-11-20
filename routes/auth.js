const {User} =require('../models');
const sequelize = require('../config/database');
const express = require('express');
const app = express();
const router = express.Router();

app.use(express.json());


router.post('/sign-up', async (req, res) =>{
    const {email, password} = req.body;

    const checkEmail = /^[0-9a-zA-Z]([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,5}$/;
    if(!email.match(checkEmail)){
        return res.status(401).send("Please check your email address, again");
    }

    const checkSpace = /^([0-9a-zA-Z]+)$/
    if (!password.match(checkSpace)){
        return res.status(401).send("Password can not contain blank space.")
    }

    const checkPasswordLength = password.length;
    if(checkPasswordLength < 8 || checkPasswordLength>15){
        return res.status(401).send("Password should be over 8 numbers and under 15 numbers.")
    }


    try{
        const newUser = await sequelize.transaction( async ()=> {

            const newUserInformation = await User.create({
                email,
                password
            });
            return newUserInformation;
        });
        res.status(200).send(newUser);
    }catch(error){
        console.log('Error occurred while sign-up process')
        res.status(500).send(error)
    }

})


module.exports = router;