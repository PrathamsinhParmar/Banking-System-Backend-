const express = require('express')
const authRouter = require('../src/routes/auth.routes')
const accountRouter = require('../src/routes/account.routes')
const transactionRouter = require('../src/routes/transaction.routes')
const cookieParser = require('cookie-parser')

const app = express()
app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res)=>{
    res.send("Banking System Is Up & Running !")
})

app.use('/api/auth', authRouter)

app.use('/api/accounts', accountRouter)

app.use('/api/transaction', transactionRouter)

module.exports = app