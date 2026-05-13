const express = require('express')
const authMiddlewares = require('../middlewares/auth.middleware')
const accountController = require('../controllers/account.controller')

const router = express.Router()

router.post('/', authMiddlewares.authMiddleware, accountController.createAccountController)

module.exports = router