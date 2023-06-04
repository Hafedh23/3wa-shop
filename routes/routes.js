import express from "express"



import {
   authentifiaction,
   register,
   getUserprofile,
   updateUserprofile,
   addUserByAdmin,
   deleteUserByadmin,
   getUsers,
   getUserById,
   updateUserByid
} from "../controllers/userController.js"


import { 
   createProductReview,
   creatProduct, 
   deleteProduct, 
   getProductById, 
   getProducts, 
   updateProduct 
} from "../controllers/productController.js"

import{authadmin,protect} from "../middlewares/authMiddleware.js"

const router = express.Router()

//*******user router *******/
router.route('/api/register').post(register)
router.route('/api/authentifiaction').post(authentifiaction)
router.route('/api/getuserprofile').get(getUserprofile)
router.route('/api/updateuserprofile/:id').post(updateUserprofile)
router.route('/api/adduserbyadmin/').post(authadmin,addUserByAdmin)
router.route('/api/deleteuserbyadmin/:id').post(authadmin,deleteUserByadmin)
router.route('/api/getusers').get(authadmin,getUsers)
router.route('/api/getuserbyid/:id').get(authadmin,getUserById)
router.route('/api/updateuserbyid/:id').post(authadmin,updateUserByid)

//*******product router*******/
router.route('/api/creatproduct').post(authadmin,creatProduct)
router.route('/api/getproducts').get(authadmin,getProducts)
router.route('/api/getproductbyid/:id').get(getProductById)
router.route('/api/deleteproduct/:id').delete(protect,authadmin, deleteProduct)
router.route('/api/updateproduct/:id').post(protect,authadmin, updateProduct)
router.route('/api/createproductreview/:id/:user').post(protect, createProductReview)
export default router