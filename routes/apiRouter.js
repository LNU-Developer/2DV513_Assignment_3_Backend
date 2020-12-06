const express = require('express')
const router = express.Router()

const apiController = require('../controllers/apiController')

router.get('/patient/all', apiController.getAllPatients)
router.get('/patient/:ssn', apiController.getPatient)
router.post('/patient/add', apiController.addPatient)
router.put('/patient/edit', apiController.editPatient)
router.delete('/patient/:ssn', apiController.deletePatient)

module.exports = router
