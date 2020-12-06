const express = require('express')
const router = express.Router()

const apiController = require('../controllers/apiController')

router.get('/', apiController.home)
router.get('/msg', apiController.msg)

module.exports = router
