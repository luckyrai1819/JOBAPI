const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {


  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || `something went wrong`
  }
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }
  if (err.code && err.code === 11000) {
    customError.statusCode = 400;
    customError.message = `duplicate value for ${Object.keys(err.keyValue)} field, please choose another value`
  }
  if (err.name === 'CastError') {
    customError.message = `no job with id ${err.value}`
    customError.statusCode = 404
  }
  return res.status(customError.statusCode).json({ msg: customError.message });
  // return res.status(customError.statusCode).json(err);
}

module.exports = errorHandlerMiddleware
