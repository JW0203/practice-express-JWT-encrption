const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: '품 관보서 API',
            version: '1.0.0'
        },
    },
    apis: ['./routes/*.js']
}

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;