const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
//const removeUploadedFiles = require('multer/lib/remove-uploaded-files');



// User Api
router.post('/register', userController.createUser);


module.exports = router;