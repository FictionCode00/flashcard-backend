var express = require('express');
const { Signup, Signin, socialLogin } = require('../controller/user-controller');
var router = express.Router();

router.post('/signup',Signup)
router.post('/login',Signin)
router.post('/social-login',socialLogin)

module.exports = router;
