const jwt=require('jsonwebtoken');
const CustomError = require('../utils/customError');
const { UNAUTHORIZATION_CODE, FORBIDDEN_STATUS_CODE } = require('../common/statusCodes');

function verifyAccessToken(token) {
    const secret = process.env.SECRET_KEY;

    try {
        const decoded = jwt.verify(token, secret);
        return { success: true, data: decoded };
    } catch (error) {
        return { success: false, error: error.message };
    }
}



function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        let err = new CustomError('Unauthorized', UNAUTHORIZATION_CODE)
        return next(err)
    }

    const result = verifyAccessToken(token);

    if (!result.success) {
        let err = new CustomError(result.error,FORBIDDEN_STATUS_CODE)
        return next(err)
    }
    req.user = result.data;
    console.log(result.data)
    next();
}

module.exports= {
    authenticateToken,
    verifyAccessToken
}