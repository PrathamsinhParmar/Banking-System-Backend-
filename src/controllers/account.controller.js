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

const getAllUserAccountsController = async (req, res)=>{

    const accounts = await accountModel.find({
        user: req.user._id
    })

    return res.status(200).json({
        message: "All Accounts Fetched!",
        accounts: accounts,
    })
}


const getAccountBalanceController = async (req, res)=>{
    const accountId  = req.params.accountId
    
    const account = await accountModel.findOne({
        _id: accountId,
        user: req.user._id // Tells that it is same user
    })
    console.log("account : ", account)

    if(!account){
        return res.status(404).json({
            message: "Account Not Found!"
        })
    }

    const balance = await account.getBalance();

    res.status(200).json({
        message: "Balance Fetched Successfully!",
        accountId: account._id,
        balance: balance
    })
}

module.exports = {
    createAccountController,
    getAllUserAccountsController,
    getAccountBalanceController
}