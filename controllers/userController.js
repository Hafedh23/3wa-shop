import asyncHandler from "express-async-handler"
import User from "../models/userModel.js"
import generateToken from "../utilis/generateToken.js";
import bcrypt from 'bcrypt'


const authentifiaction = asyncHandler (async (req,res) => {
    const {email , password} = req.body
    console.log(req.body);
    const user = await User.findOne({"email": email})
    if(user && await user.matchPassword(password))
       {
        
       let token = generateToken(user._id)
        console.log(token);
        return res.json({
            status: 200,
            user: user,
            token: token
         
        })
     
    }
    else {
        return res.json({
            status: 401,
            message : "User not found"
        })
    }
})


const register = asyncHandler( async(req,res) => {
    const {name, email , password} = req.body
    //const verifEmail = find({"email" : email})
    // pour verifier l email exstant en base de donnée
    const verifEmail =await User.findOne({"email" : email})
    // si ouii on crée un pas un nouveau utilisateur
    if(verifEmail)
    {
        return res.json({
            status: 403 ,
            message:  "Email exist"
        }) 
    }
    //si non on crée un nouveau utilisateur
    const user = new User(
        {name : name, email :email , password :password}
    )
    await user.save();
    return res.json({
        status: 200 ,
        message:  "user created"
    })
})

const getUserprofile = asyncHandler(async (req,res)=>{
 const user = req.query.user._id
        const users = await User.find(user)

 if(users){
    
    return res.json({
        user:req.query.user,
    status:201,
    message:'myprofile'

     })
 } else {
    return res.json('error database')
 }
    
  
})


const updateUserprofile=asyncHandler(async(req,res)=>{
   
        const hashpassword = async(password)=>{
        const salt =await bcrypt.genSalt(10)
        password=await bcrypt.hash(password,salt)
        return password
   }
    
   if (req.body.password){
    req.body.password=await hashpassword(req.body.password)
   }


   const user=await User.findByIdAndUpdate({_id:req.params.id},{$set:req.body})
if (!user) 
return res.status(404).send("An Error occured while updating this user.")
res.status(200).send("user updated Successfully")    
}

)

const addUserByAdmin = asyncHandler( async(req,res) => {
    const {name, email , password} = req.body
    //const verifEmail = find({"email" : email})
    // pour verifier l email exstant en base de donnée
   
    const verifEmail =await User.findOne({"email" : email})
    // si ouii on crée un pas un nouveau utilisateur
    if(verifEmail)
    {
        return res.json({
            status: 403 ,
            message:  "Email exist"
        }) 
    }
    //si non on crée un nouveau utilisateur
    const user = new User(
        {name : name, email :email , password :password}
    )
    await user.save();
    return res.json({
        status: 200 ,
        message:  "user created"
    })
})


const deleteUserByadmin = asyncHandler(async(req,res)=> {
    deluser= await User.deleteOne({ _id: req.params.id })
      .then(() => res.json({ message: "User Deleted" }))
      .catch((err) => res.send(err));
  })
  const getUsers = asyncHandler(async (req, res) => {
  const  users= await User.find()
      if (!users) {
        res.send(err);
      }
      res.json(users);
    });


const getUserById=asyncHandler(async(req,res)=>{
   const  userid=req.params.id
   const  user=await User.findOne({_id:userid})
   if(user){
    res.json(user)
   }
  res.send('Error Database')
})

const updateUserByid=asyncHandler(async(req,res)=>{
    const hashpassword = async(password)=>{
        const salt =await bcrypt.genSalt(10)
        password=await bcrypt.hash(password,salt)
        return password
   }
    
   if (req.body.password){
    req.body.password=await hashpassword(req.body.password)
   }


   const user=await User.findByIdAndUpdate({_id:req.params.id},{$set:req.body})
if (!user) 
return res.status(404).send("An Error occured while updating this user.")
res.status(200).send("user updated Successfully") 
    
})


export {
    register,
    authentifiaction,
    getUserprofile,
    updateUserprofile,
    addUserByAdmin,
    deleteUserByadmin,
    getUsers,
    getUserById,
    updateUserByid
}