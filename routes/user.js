const express = require('express');
const router = express.Router();
const {User} =  require("../models");
const authenticateToken = require("../middleware/authenticateToken");


/**
 * @swagger
 * /:
 *   get:
 *     summary: 유저 정보 조회
 *     description: 모든 유저 정보를 조회한다.
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                    description: The user's name
 */
router.get('/', authenticateToken, async (req,res, next) =>{
    try {
        const id = req.user.id;
        // console.log(req.user)
        const foundUser = await User.findOne({
            where:{id},
            attributes: ['id', 'email', 'createdAt' ]
        })
        // console.log(foundUser)
        res.status(200).send(foundUser);
    } catch (err) {
        next(err);
    }
})


module.exports = router;