const express = require('express')
const router = express.Router()

const apiController = require('../controllers/apiController')

router.get('/patient/all', apiController.getAllPatients)
router.get('/patient/countcity', apiController.getCountByCity)
router.get('/patient/male', apiController.getPatientMale)
router.get('/patient/female', apiController.getPatientFemale)
router.get('/patient/:city', apiController.getPatientsInCity)
router.get('/patient/:ssn', apiController.getPatient)
router.post('/patient/add', apiController.addPatient)
router.put('/patient/edit', apiController.editPatient)
router.delete('/patient/:ssn', apiController.deletePatient)

module.exports = router
