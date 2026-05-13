require('dotenv').config()

const app = require('./src/app')
const connectDB = require('./src/config/db')

connectDB()

app.listen(process.env.PORT, (req, res)=>{
    console.log(`Server is running on : http://localhost:${process.env.PORT}`)
})