const express = require('express')
const authMiddlewares = require('../middlewares/auth.middleware')
const accountController = require('../controllers/account.controller')

const router = express.Router()

/**
 * - POST /api/accounts
 * - Create an account
 */
router.post('/', authMiddlewares.authMiddleware, accountController.createAccountController)


/**
 * - GET /api/accounts/
 * - Get user's all accounts
 * - Protected route
 */
router.get('/', authMiddlewares.authMiddleware, accountController.getAllUserAccountsController)



/**
 * - POST /api/accounts/balance/:accountId
 * - Get user account balance
 */
router.get('/balance/:accountId', authMiddlewares.authMiddleware, accountController.getAccountBalanceController)

module.exports = router