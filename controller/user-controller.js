const sendResponse = require("../common/response");
const { SUCCESS_STATUS_CODE, ERROR_STATUS_CODE, NOT_FOUND_STATUS_CODE } = require("../common/statusCodes");
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
exports.adminSignin = async(req,res,next) =>{
    let {email , password}=req.body
 
    //check for empty fields in the request body
    if(!email ||!password){
        const error= new CustomError("Please provide email and password",400)
        return next(error)
    }

    //check if user exists or not
    let user = await User.findOne({email:email,isSuperAdmin:1}).select('+password')


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
   
    const stripe = require('stripe')('sk_test_5mJkRP6GZO9TNzKunanIIMvF');
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 500,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });
    sendResponse(res, paymentIntent, SUCCESS_STATUS_CODE)
}

exports.SavePayment = async(req,res,next) =>{
    //check if user exists or not
    let usder = await User.findById(req.user.id);
   const { payent_intent } = req.body;

   // console.log(req.body);
   // return
    if(usder){
        if(usder.payent_intent == '' && usder.payent_intent != payent_intent){
            let newLimt = parseInt(usder.cardlimit)+25;
            usder.payent_intent = payent_intent;
            usder.cardlimit = newLimt;
            usder.save();
           sendResponse(res, usder, SUCCESS_STATUS_CODE)
        }else{
            sendResponse(res, {}, ERROR_STATUS_CODE)
        }
        
    }else{
        sendResponse(res, {}, ERROR_STATUS_CODE)
        
    }
}


exports.checkRole = async (req, res, next) => {
    try {
         let {email}=req.body
        
        const users = await User.find({email:email})
        sendResponse(res, users, SUCCESS_STATUS_CODE)
    } catch (error) {
        console.log(error)
        next(error)

    }
}

exports.getUsers = async (req, res, next) => {
    try {
        //const users = await User.find({isSuperAdmin : 0})
        const users = await User.find()
        sendResponse(res, users, SUCCESS_STATUS_CODE)
    } catch (error) {
        console.log(error)
        next(error)

    }
}

exports.setAdmin = async (req, res, next) => {
    try {
        const { userId,isAdmin,isSuperAdmin } = req.body;
        const userss = await User.findById(userId);
        if (!userss) {
            return sendResponse(res, { message: 'User not found' }, NOT_FOUND_STATUS_CODE);
        }

        if(isSuperAdmin == 'isSuperAdmin'){
            userss.isSuperAdmin = isAdmin;
        }else{
            userss.isAdmin = isAdmin;
        }
        
        userss.save();

        const users = await User.find();
        
        sendResponse(res, users, SUCCESS_STATUS_CODE)
    } catch (error) {
        console.log(error)
        next(error)

    }
}
