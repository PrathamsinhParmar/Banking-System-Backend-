const transactionModel = require('../models/transaction.model')
const accountModel = require('../models/account.model')
const mongoose = require('mongoose')
const ledgerModel = require('../models/ledger.model')
const emailService = require('../services/email.service')
const userModel = require('../models/user.model')

/**
 * - Create a new transaction
 * The 1-Step Transaction Flow
    * 1. Validate request
    * 2. Validate idempotency key
    * 3. Check account status  (ACTIVE, FROZEN, CLOSED)
    * 4. Derive sender balance from ledger
    * 5. Create transaction (PENDING)
    * 6. Create DEBIT ledger entry
    * 7. Create CREDIT ledger entry
    * 8. Mark transaction COMPLETED
    * 9. Commit MongoDB session
    * 10. Send email notification
 */


const createTransaction = async (req, res)=>{

    /**
     * 1. Validate Request 
    */

    const { fromAccount, toAccount, amount, idempotencyKey } = req.body
    
    if( !fromAccount || !toAccount || !amount || !idempotencyKey ){
        return res.status(400).json({
            message: "fromAccount, toAccount, amount and idempotencyKey is required for creating a transaction"
        })
    }

    // Check if fromAccount and toAccount is exixtes or not
    const fromUserAccount = await accountModel.findOne({
        _id: fromAccount 
    })

    const toUserAccount = await accountModel.findOne({
        _id: toAccount
    })

    if(!fromUserAccount || !toUserAccount){
        return res.status(400).json({
            message: "Invalid fromAccount or toAccount!"
        })
    }


    /**
     * 2. Validate idempotency key 
    */

    const isTransactionAlreadyExists = transactionModel.findOne({
        idempotencyKey: idempotencyKey
    })

    if(isTransactionAlreadyExists){

        if(isTransactionAlreadyExists.status === "COMPLETED"){
            return res.status(200).json({
                message: "Transaction already processed",
                transaction: isTransactionAlreadyExists

            })
        }

        if(isTransactionAlreadyExists.status === "PENDING"){
            return res.status(200).json({
                message: "Transaction is still processing"
            })
        }

        if(isTransactionAlreadyExists.status === "FAILED"){
            return res.status(500).json({
                message: "Transaction processing failed, Please try again"
            })
        }

        if(isTransactionAlreadyExists.status === "REVERSED"){
            return res.status(500).json({
                message: "Transaction was reversed, Please try again"
            })
        } 
    }

    
    /**
     * 3. Check account status 
    */

    if(fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE"){
        return res.status(400).json({
            message: "Both formAccount and toAccount must be ACTIVE or process transaction"
        })
    }



    /**
     * 4: Derive sender balance from ledger
    */
    const balance = await fromUserAccount.getBalance()

    if(balance < amount){
        res.status(400).json({
            message: `Insufficient Balance. Current balance is ${balance}, Requested amount is ${amount}`
        })
    }




    
    /**
     * 5: Create transaction (PENDING)
     * 6. Create DEBIT ledger entry
     * 7.Create CREDIT ledger entry
     * 8. Mark transaction COMPLETED
     * 9. Commit MongoDB session
    */

    const session = await mongoose.startSession()
    session.startTransaction()


    const transaction = await transactionModel.create([{
        fromAccount: fromAccount,
        toAccount: toAccount,
        status: "PENDING",
        amount: amount,
        idempotencyKey: idempotencyKey
    }], { session })


    const debitLedgerEntry = await ledgerModel.create([{
        account: fromAccount,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT"
    }], { session })


    const creditLedgerEntry = await ledgerModel.create([{
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT"
    }], { session })

    transaction.status = "COMPLETED"

    await transaction.save( { session } )

    await session.commitTransaction()
    session.endSession()


    /**
     * 10. Send Email Notification 
    */

    await emailService.sendTransactionEmail(req.user.email, req.user.name, amount, toAccount)
    return res.status(201).json({
        message: `Transaction completed successfully`,
        transaction: transaction
    })


}


const createInitialFundsTransaction = async(req, res)=>{
    const { toAccount, amount, idempotencyKey } = req.body

    if(!toAccount || !amount || !idempotencyKey ){
        return res.status(401).json({
            message: "toAccount, amount & idempotencyKey is required to create transaction!"
        })
    }

    const toUserAccount = await accountModel.findOne({
        _id: toAccount
    })
    console.log("To Account : ", toUserAccount)

    if(!toUserAccount){
        return res.status(402).json({
            message: "toAccount not found!"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        user: req.user._id // tells that it is the same user that logged in
    })
    console.log("From Account : ", fromUserAccount)

    if(!fromUserAccount){
        return res.status(400).json({
            message: "System user account not found!"
        })
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = new transactionModel({
        fromAccount: fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING"
    })

    console.log(transaction)

    
    const debitLedgerEntry = await ledgerModel.create([{
        account: fromUserAccount._id,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT"
    }], { session })



    const creditLedgerEntry = await ledgerModel.create([{
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT"
    }], { session })

    transaction.status = "COMPLETED"
    await session.commitTransaction()

    session.endSession()

    return res.status(201).json({
        message: "Initial funds transaction completed successfully!",
        transaction: transaction
    })

}

module.exports = {
    createTransaction,
    createInitialFundsTransaction
}