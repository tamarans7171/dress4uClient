const router=require('express').Router()
const perferenceController=require('../controller/perferenceController')


router.get('/getPerferenceById/:id',perferenceController.getPerferenceById),//V
router.get('/getPerferences',perferenceController.getPerferencees),
router.get('/getPerferenceByUserAndDress/:user/:dress',perferenceController.checkUserPerferenceByDress),
router.get('/getPerferenceByUser/:user',perferenceController.getPerferencesByUser),
router.put('/updatePerference/:id',perferenceController.updatePerference),
 router.delete('/deletePerference/:id',perferenceController.deletePerference),
router.post('/addPerference',perferenceController.addPerference),

module.exports=router




