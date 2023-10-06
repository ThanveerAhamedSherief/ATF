const express = require('express');
const authenticateAdminToken = require('../services/authMiddleware');
const { upload } = require('../services/imageUploader');
const { merchantRegister, merchants, merchantPlanUpdate, merchantLogin, merchantProfileUpdate, addNewMerchantAddress, merchantAddressUpdate } = require('../controllers/merchantController');
const merchantRouter = express.Router();

merchantRouter.post('/register',authenticateAdminToken,upload.single('image'), merchantRegister);
merchantRouter.get('/', authenticateAdminToken, merchants);
merchantRouter.post('/planUpdate', merchantPlanUpdate);
merchantRouter.put('/profileUpdate/:id', upload.single('image'),merchantProfileUpdate);
merchantRouter.post('/:merchantId/newAddress', addNewMerchantAddress);
merchantRouter.put('/updateMerchantAddress/:addressId', merchantAddressUpdate);
merchantRouter.post('/login', merchantLogin)

module.exports = merchantRouter;