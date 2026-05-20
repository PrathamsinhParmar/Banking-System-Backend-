const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [true, "Email is required for creating an account"],
        unique: [true, "Email already exists"],
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    name:{
        type: String,
        required: [true, "Name is required to create an account"]
    },
    password:{
        type: String,
        required: [true, "Password is required to create an account"],
        minlength: [6, "Password must be more then 6 characters"],
        select: false    // IMPORTANT
    },
    systemUser: {
        type: Boolean,
        default: false,                                 
        immutable: true,
        select: false    // IMPORTANT
    }
},{
    timestamps: true
})


userSchema.pre("save", async function(){
    if(!this.isModified("password")){
        return 
    }

    const hashPassword = await bcrypt.hash(this.password, 10)
    this.password = hashPassword

    return 
})



userSchema.methods.comparePassword = async function(password){

    return await bcrypt.compare(password, this.password)    // return true or false

}

const userModel = mongoose.model("user", userSchema)

module.exports = userModel