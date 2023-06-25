const router=require('express').Router()
const areaController=require('../controller/areaController')


router.get('/getAreaById/:id',areaController.getAreaById),//V
router.get('/getAreas',areaController.getAreas),
router.put('/updateArea/:id',areaController.updateAreas),
router.delete('/deleteArea/:id',areaController.deleteArea),
router.post('/addArea',areaController.addArea),

module.exports=router




