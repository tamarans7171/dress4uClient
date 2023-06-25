const router=require('express').Router()
const commentController=require('../controller/commentController')


router.get('/getCommentById/:id',commentController.getCommentById),
router.get('/getCommentByDressId/:id',commentController.getCommentByDressId),
router.get('/getComments',commentController.getComments),
router.put('/updateComment/:id',commentController.updateComment),
 router.delete('/deleteComment/:id',commentController.deleteComment),
router.post('/addComment',commentController.addComment),

module.exports=router


