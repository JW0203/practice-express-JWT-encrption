const express = require('express');
const app = express();
const port = 3000;
const sequelize = require('./config/database')
const authRouter = require('./routes/auth')

sequelize.sync({force:true});
app.use(express.json());
app.use('/auth', authRouter);

app.get('/',(req, res) => {
    res.send("Practice: Json Web Token and Encryption");
})
app.listen(port, ()=>{
    console.log(`서버가 실행됩니다. http://localhost:${port}`);
})