const router=require('express').Router()
const paymentController=require('../controller/paymentController')


router.get('/getPaymentById/:id',paymentController.getPaymentById),
router.get('/getPayments',paymentController.getPayments),
router.get('/getPaymentsWithSubscriptionToDress/:idUser/:idDress',paymentController.checkPermitionDress),
router.get('/getPaymentsWithSubscriptionToComment/:idUser/:idDress',paymentController.checkPermitionComment),
router.put('/updatePayment/:id',paymentController.updatePayment),
 router.delete('/deletePayment/:id',paymentController.deletePayment),
router.post('/addPayment',paymentController.addPayment),

module.exports=router


