const express = require('express');
const app = express();
const port = 3000;
const sequelize = require('./config/database')
const { authRouter, userRouter } = require('./routes')
const HttpException = require('./middleware/HttpException');
sequelize.sync({force:true});
app.use(express.json());
app.use('/auth', authRouter);
app.use('/user', userRouter);
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerDef');

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))


app.get('/',(req, res) => {
    res.send("Practice: Json Web Token and Encryption");
})

app.use((err, req, res, next) =>{
    console.log(err);
    if (err instanceof HttpException){
        res.status(err.status).send(err);
    }
    res.status(500).send({
        message: "Internal Error occurred while processing"
    })
})

app.listen(port, ()=>{
    console.log(`서버가 실행됩니다. http://localhost:${port}`);
})