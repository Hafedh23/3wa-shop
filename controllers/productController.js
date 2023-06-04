import asyncHandler from "express-async-handler"
import Product from "../models/productModel.js"
import User from "../models/userModel.js"
import jwt from 'jsonwebtoken'

const creatProduct=asyncHandler(async(req,res)=>{
   
 
    const{name,image,brand,category,description,price,rating,countInStock}=req.body
   

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ){
        try {
         const token = req.headers.authorization.split(' ')[1]
            console.log(token);
          const decoded = jwt.verify(token, process.env.JWT_SECRET)
          req.user = await User.findById(decoded.id).select('-password')
        
    const product=new Product({
        name:name,image:image,brand:brand,category:category,description:description,price:price,rating:rating,countInStock:countInStock,user:req.user})
        await product.save();
        return res.json({
            status: 200 ,
            message:  "Product created"
        })
    
       
        } catch (error) {
          console.error(error)
          res.status(401)
          throw new Error('Not authorized, token failed')
        }
      }
    })



const getProducts=asyncHandler(async(req,res)=>{
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ){
    try {
     const token = req.headers.authorization.split(' ')[1]
        console.log(token);
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id).select('-password')
    
const products= await Product.find()
if(products){
  res.json(products)
 }
res.send('Error Database')

   
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  }
})


const getProductById=asyncHandler(async(req,res)=>{
    const  productid=req.params.id
    const  produdct=await Product.findOne({_id:productid})
    if(produdct){
res.json(produdct)
    }else
    res.status(401)
    throw new Error('Product not found')
})

const deleteProduct=asyncHandler(async(req,res)=>{
  const  productid=req.params.id
  const product = await Product.findOneAndDelete({_id:productid})

  if (product) {
  
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
})


const updateProduct=asyncHandler(async(req,res)=>{
  const productid=req.params.id
  const product=await Product.findOneAndUpdate({_id:productid},{$set:req.body})
  if(product){
    res.json({ message: "Product updated" });
  }else {
    res.status(404);
    throw new Error("Product not found");
  }
})



const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export{
    creatProduct,
    getProducts,
    getProductById,
    deleteProduct,
    updateProduct,
    createProductReview,

}