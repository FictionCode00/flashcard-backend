const sendResponse = require("../common/response");
const { SUCCESS_STATUS_CODE, ERROR_STATUS_CODE } = require("../common/statusCodes");
const User = require("../models/users");
const CustomError = require("../utils/customError");
const hashingPassword = require("../utils/password-hashing");
var jwt = require('jsonwebtoken');

const userToken=(id)=>{
    return jwt.sign({ id:id}, process.env.SECRET_KEY);
}

exports.Signup = async (req, res, next) => {
    let { name, email,password,socialId } = req.body
    const hashPassword=  await hashingPassword(password)
    const user = new User({ name, email, password:hashPassword,socialId })
    let token = userToken(user._id)

    try {
        await user.save()
        return res.status(201).send({
            status:"success",
            token:token,
            data: user
        })
    }
    catch (err) {
        
       return next(err)
    }

}

exports.Signin = async(req,res,next) =>{
    let {email , password}=req.body
 
    //check for empty fields in the request body
    if(!email ||!password){
        const error= new CustomError("Please provide email and password",400)
        return next(error)
    }

    //check if user exists or not
    let user = await User.findOne({email}).select('+password')


    if(!user || !(await user.comparePassword(password,user.password))){
        const error= new CustomError("Invalid email and password",400)
        return next(error)
    }

    let token =userToken(user._id)
    const data = user.toObject()
    delete data['password']
   
    return res.status(200).send({
        status:"success",
        token:token,
        data: data
    })

}

exports.socialLogin = async (req, res, next) => {
    let { email, socialId } = req.body
    if (!email || !socialId) {
        let err = new CustomError("Please provide valid email or social id.", ERROR_STATUS_CODE)
        return next(err)
    }
    try {
        let user = await User.findOne({email})
        
        if (!user) {

            sendResponse(res, { data: { "isFirstTiime": true } }, SUCCESS_STATUS_CODE)
        }
        if (user.socialId == "") {
            let err = new CustomError("This email is already exists with another account.", ERROR_STATUS_CODE)
            return next(err)
        }

        if (user.socialId == socialId) {

            let token = userToken(user._id)
            let userData = user.toObject()
            userData['token'] = token
            userData['isFirstTiime'] = false
            let data = {

                message: "Logged In succesfull.",
                data: userData,
            }
            sendResponse(res, data, SUCCESS_STATUS_CODE)
        }
        else {
            let err = new CustomError("Invlaid social id.", ERROR_STATUS_CODE)
            return next(err)
        }
    } catch (err) {
        next(err)
    }
}


exports.createIntent = async (req, res, next) => {
   
    const stripe = require('stripe')('sk_test_51NTZLiD15EFB6mA7OdDSLaVcS52FR619qbOdMF8X5QEDmBmr03kqLkdICtR9Kre5wmyXv4laGkoESdW8xmMc69SV00OC5kE8s4');

    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 2000,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });
    sendResponse(res, paymentIntent, SUCCESS_STATUS_CODE)
}

exports.SavePayment = async(req,res,next) =>{
    //check if user exists or not
    let user = await User.findById(req.user.id).select('cardlimit');

    if(user){
        let newLimt = user.cardlimit+25;
      User.updateOne({ _id: req.user.id }, { $set: {cardlimit: newLimt } }, function(err, res) {
        if (err) throw err;
        return res.status(200).send({
            status:"success",
        })
      });

    }

    

}

