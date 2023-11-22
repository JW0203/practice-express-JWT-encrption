const express = require('express');
const router = express.Router();
const {User} =  require("../models");
const authenticateToken = require("../middleware/authenticateToken");

router.get('/', authenticateToken, async (req,res) =>{
    const id = req.user.id;
    console.log(req.user)
    // const user = await User.findByPk(id);
    const foundUser = await User.findOne({
        where:{id:id},
        attributes: ['id', 'email', 'createdAt' ]
    })
    console.log(foundUser)
    res.status(200).send(foundUser);
})

module.exports = router;