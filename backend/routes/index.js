const express = require('express')
const router = express.Router();
const authController = require('../controllers/authController')

router.post('/signupDetails', authController.signupDetails)

router.post('/loginDetails', authController.loginDetails)

router.post('/logout', authController.logoutData)

module.exports = router;
