const router=require('express').Router()
const dressController=require('../controller/dressController')

var multer = require('multer');
 
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
 
var upload = multer({ storage: storage });
//
router.get('/getDressById/:id',dressController.getDressById),
router.get('/getDressByUser/:userId',dressController.getDressByUserId),
router.get('/getDresses',dressController.getDresses),
router.put('/updateDress/:id',dressController.updateDress),
 router.delete('/deleteDress/:id',dressController.deleteDress),
router.post('/addDress',upload.single('image'),dressController.addDress),

module.exports=router




