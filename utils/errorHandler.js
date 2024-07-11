const CustomError = require("./customError")

const ErrorHandler = (error, req, res, next) => {
    
    if (error._message === 'users validation failed') {
        let msg = Object.values(error.errors).join('. ')
        var err = new CustomError(msg, 400)
        err.statusCode = err.statusCode || 500
        err.status = err.status || "error"
        res.status(err.statusCode).send({
            status: err.status,
            message: err.message
        })
    }
    else{
        
        error.statusCode = error.statusCode || 500
        error.status = error.status || "error"
        res.status(error.statusCode).send({
            status: error.status,
            message: error.message
        }) 
    }

}

module.exports = ErrorHandler