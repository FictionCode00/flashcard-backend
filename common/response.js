const sendResponse = (res,data,statusCode) =>{
    return res.status(statusCode).send(data)
}


module.exports = sendResponse;