var express = require('express');
const { Signup, Signin, socialLogin,createIntent,SavePayment,getUsers,setAdmin } = require('../controller/user-controller');
const { authenticateToken } = require('../middlewares/Authentication');

var router = express.Router();

router.post('/signup',Signup)
router.post('/login',Signin)
router.post('/social-login',socialLogin)
router.post('/get-users',getUsers)
router.post('/save-payment',authenticateToken,SavePayment)
router.get('/create-intent',authenticateToken,createIntent)
router.post('/set-admin',authenticateToken,setAdmin)

module.exports = router;
