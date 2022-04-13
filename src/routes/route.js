const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const productController = require('../controller/productController');
//const removeUploadedFiles = require('multer/lib/remove-uploaded-files');



// User Api
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/user/:userId/profile', userController.getUser);
router.put('/user/:userId/profile', userController.updateProfile);
// product api
router.post('/products', productController.createProduct);
router.get('/products', productController.getProductDetails);
module.exports = router;