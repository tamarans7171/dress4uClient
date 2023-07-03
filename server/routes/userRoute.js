const router=require('express').Router()
const userController=require('../controller/userController')
const {authToken, authAdmin} = require("../auth/authToken")


router.get('/getUsers',userController.getUsers),
router.get('/getUserById/:id',userController.getUserById),
router.post('/login',userController.login),
router.put('/updateUser/:id',userController.updateUser),
router.delete('/deleteUser/:id',userController.deleteUser),
router.post('/addUser',userController.addUser),
router.get('/userInfo',authToken,userController.getUserInfo),

module.exports=router


