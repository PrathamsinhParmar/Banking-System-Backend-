const express = require('express')
const authRouter = require('../src/routes/auth.routes')
const accountRouter = require('../src/routes/account.routes')
const cookieParser = require('cookie-parser')

const app = express()
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRouter)

app.use('/api/accounts', accountRouter)

module.exports = app