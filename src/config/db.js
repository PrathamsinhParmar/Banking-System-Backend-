const mongoose = require('mongoose')

const connectDB = ()=>{
    mongoose.connect(process.env.MONGO_URI)
        .then(
            console.log("Server is connected to DB")
        )
        .catch(err=>{
            console.log("Error connecting to DB")
            process.exit(1) // If DB not connected, then stop the server
        })
}

module.exports = connectDB