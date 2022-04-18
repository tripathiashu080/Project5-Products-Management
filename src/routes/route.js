const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const productController = require('../controller/productController');
const cartController = require('../controller/cartController');

//const removeUploadedFiles = require('multer/lib/remove-uploaded-files');



// User Api
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/user/:userId/profile', userController.getUser);
router.put('/user/:userId/profile', userController.updateProfile);
// product api
router.post('/products', productController.createProduct);
router.get('/products', productController.getProductByFilter);
router.get('/products/:productId', productController.getProductById);
router.put('/products/:productId', productController.updateProduct);
router.delete('/products/:productId', productController.deleteProduct);
// cart api
router.post('/users/:userId/cart', cartController.addToCart);
router.put('/users/:userId/cart', cartController.removeProductFromCart);
router.get('/users/:userId/cart', cartController.userCart);
router.delete('/users/:userId/cart', cartController.deleteUserCart);
// order api


module.exports = router;