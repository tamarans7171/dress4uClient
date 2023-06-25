

const router=require('express').Router()
const colorController=require('../controller/colorController')


router.get('/getColorById/:id',colorController.getColorById),
router.get('/getColors',colorController.getColors),
router.put('/updateColor/:id',colorController.updateColor),
 router.delete('/deleteColor/:id',colorController.deleteColor),
router.post('/addColor',colorController.addColor),

module.exports=router


