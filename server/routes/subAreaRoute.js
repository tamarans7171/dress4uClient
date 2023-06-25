const router=require('express').Router()
const subAreaController=require('../controller/subAreaController')


router.get('/getSubAreaById/:id',subAreaController.getSubAreaById),
router.get('/getSubAreas',subAreaController.getSubAreas),
router.get('/getSubAreasByArea/:id',subAreaController.getSubAreasByArea),
router.put('/updateSubArea/:id',subAreaController.updateSubArea),
 router.delete('/deleteSubArea/:id',subAreaController.deleteSubArea),
router.post('/addSubArea',subAreaController.addSubArea),

module.exports=router


