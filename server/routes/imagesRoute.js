let express = require('express'),
mongoose = require('mongoose'),
    multer = require('multer'),
    uuidv4 = require("uuid"),
    router = express.Router(),
    Images = require('../models/imagesModel');
const ImagesController=require('../controller/imageController')



const DIR = './public/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4.v4() + '-' + fileName)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {

        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/webp") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});


router.post('/upload-images', upload.array('imgCollection', 6), (req, res, next) => {
    const reqFiles = [];
    const url = req.protocol + '://' + req.get('host')
    for (var i = 0; i < req.files.length; i++) {
        reqFiles.push({url:url + '/public/' + req.files[i].filename, isPermited:0})
    }
    const images = new Images({
        imgCollection: reqFiles
    });
    images.save().then(result => {
        res.status(201).json({
            message: "Images registered successfully!",
            imagesCreated: {
                _id: result._id,
                imgCollection: result.imgCollection
            }
        })
    }).catch(err => {
        console.log(err),
            res.status(500).json({
                error: err
            });
    })
})

router.get("/", (req, res, next) => {
    Images.find().then(data => {
        res.status(200).json({
            message: "Images list retrieved successfully!",
            images: data
        });
    });
});

router.put('/updateImages/:id',ImagesController.updateImages)
router.delete('/deleteImages/:id',ImagesController.deleteImages)
module.exports = router;