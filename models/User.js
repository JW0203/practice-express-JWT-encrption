const sequelize = require('../config/database');
const {DataTypes} = require("sequelize");

const User = sequelize.define('users',{
   id :{
       type: DataTypes.INTEGER,
       autoIncrement: true,
       primaryKey: true
   },
    email:{
       type: DataTypes.STRING,

    },
    password:{
       type: DataTypes.STRING // INTEGER 이면 빈 공간으로 값을 줄때 알아서 에러가 떠서 STRING 으로 변경해봄
    }
},{
    underscored:true
})

module.exports = User;