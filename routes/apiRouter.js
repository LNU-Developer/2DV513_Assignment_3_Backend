const express = require('express')
const router = express.Router()

const apiController = require('../controllers/apiController')

router.get('/', apiController.home)

module.exports = router
