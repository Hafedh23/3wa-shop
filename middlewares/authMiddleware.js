import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const protect = asyncHandler(async (req, res, next) => {
  let token
  console.log(req.headers)
    console.log(req.headers.authorization)
    console.log(req.headers.Authorization)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
        console.log(token);
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = await User.findById(decoded.id).select('-password')

      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  } 
})


const authadmin = asyncHandler(async (req, res, next) => {
  let token
  console.log(req.headers)
    console.log(req.headers.authorization)
    console.log(req.headers.Authorization)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    
      token = req.headers.authorization.split(' ')[1]
        console.log(token);
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = await User.findOne({_id: decoded.id}).select('isAdmin')
     console.log(req.user);
if(req.user.isAdmin == true){
  next()
}else{
  res.status(404)
  throw new Error('is not Admin')
}
   
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  } 

 
})

export  {
  authadmin,
  protect
}