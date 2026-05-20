const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const emailService = require('../services/email.service')
const tokenBlacklistModel = require('../models/blackList.model')


/**
 * - User Register Controller 
 * - POST /api/auth/register
 */
const userRegisterController = async (req, res)=>{

    const { email, password, name, systemUser } = req.body
    
    const isEmailExists = await userModel.findOne({
        email: email
    })

    if(isEmailExists){
        return res.status(422).json({
            messge: "User already exists with email!",
            status: "failed"
        })
    }

    const user = await userModel.create({
        email, password, name, systemUser
    })

    const token = jwt.sign({
        userId: user._id
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(201).json({
        message: "User Created Successfully",
        user: {
            _id: user._id,
            email: user.email,
            password: user.password,
            name: user.name,
            systemUser: user.systemUser
        },
        token
    })
    emailService.sendRegestrationEmail(user.email, user.name)
}

/**
 * - User Login Controller
 * - POST /api/auth/login
 */
const userLoginController = async (req, res)=>{
    const { email, password } = req.body
    
    const user = await userModel.findOne({ email }).select("+password")

    if(!user){
        return res.status(422).json({
            message: "Enail or password is Invalid!"
        })
    }

    const isPasswordCorrect = await user.comparePassword(password)

    if(!isPasswordCorrect){
        return res.status(402).json({
            message: "Invalid Password!"
        })
    }

    const token = jwt.sign({
        userId: user._id
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(200).json({
        message: "User Loggedin Successfully",
        user,
        token
    })
}



/**
 * - User Logout Controller
 * - POST /api/auth/logout
 */
const userLogoutController = async (req, res)=>{
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    if(!token){
        return res.status(200).json({
            message: "You can't Logout, Token missing!"
        })
    }

   await tokenBlacklistModel.create({
        token: token
   })

   res.clearCookie("token")

   res.status(200).json({
        message: "User Loggedout Successfully!"
   })
}



module.exports = {
    userRegisterController,
    userLoginController,
    userLogoutController
}