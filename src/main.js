const express = require('express');
const app = express();
const {sequelize} = require('./db/models')
const dotenv = require('dotenv');
dotenv.config()
const PORT = process.env.PORT || 3001

app.use(express.json())

app.listen(PORT, async (err)=> {
    if(err) {
        console.error(err.message)
        process.exit(1)
    }
    await sequelize.sync({force: true})
    console.log(`App iniciada en el puerto ${PORT}`)
})