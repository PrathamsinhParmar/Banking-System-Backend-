const accountModel = require('../models/account.model')

const createAccountController = async (req, res)=>{
    const user = req.user
    console.log(user)

    const account = await accountModel.create({
        user: user._id
    })

    res.status(201).json({
        message: "Account Created Successfully",
        account
    })
}

module.exports = {
    createAccountController
}