var express = require('express');
const { Signup, Signin, socialLogin,createIntent,SavePayment,getUsers,setAdmin,adminSignin,checkRole } = require('../controller/user-controller');
const { authenticateToken } = require('../middlewares/Authentication');

var router = express.Router();

router.post('/signup',Signup)
router.post('/login',Signin)
router.post('/admin-login',adminSignin)
router.post('/social-login',socialLogin)
router.post('/get-users',getUsers)
router.post('/save-payment',authenticateToken,SavePayment)
router.post('/check-role',authenticateToken,checkRole)
router.get('/create-intent',authenticateToken,createIntent)
router.post('/set-admin',authenticateToken,setAdmin)

module.exports = router;
