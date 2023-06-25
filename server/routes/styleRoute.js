const router=require('express').Router()
const styleController=require('../controller/styleController')


router.get('/getStyleById/:id',styleController.getStyleById),
router.get('/getStyles',styleController.getStyles),
router.put('/updateStyle/:id',styleController.updateStyle),
 router.delete('/deleteStyle/:id',styleController.deleteStyle),
router.post('/addStyle',styleController.addStyle),

module.exports=router