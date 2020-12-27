const apiController = {}
const Database = require('../config/Database.js')

const config = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
}

const db = new Database(config)
db.connect()

/** Get a specific patient from the database.
 *
 * @param {object} req - request object
 * @param {object} res - result object
 */
apiController.getPatient = async (req, res) => {
  const ssn = req.params.ssn
  db.connection.query(
    'SELECT * FROM patient WHERE SocialSecurityNumber = ?', ssn,
    (error, results) => {
      if (error) return res.json({ error: error })
      res.status(200).send(results)
    })
}

/** Get all patients from database.
 *
 * @param {object} req - request object
 * @param {object} res - result object
 */
apiController.getAllPatients = async (req, res) => {
  db.connection.query(
    'SELECT * FROM patient',
    (error, results) => {
      if (error) return res.json({ error: error })
      res.status(200).send(results)
    })
}

/** Insert patient.
 *
 * @param {object} req - request object
 * @param {object} res - result object
 */
apiController.addPatient = async (req, res) => {
  const patient = req.body
  req.body.CreatedBy = 1
  db.connection.query(
    'INSERT INTO contactdetails (PhoneNo, Adress, PostalNo, City, Email) VALUES (?,?,?,?,?)',
    [
      patient.PhoneNo,
      patient.Adress,
      patient.PostalNo,
      patient.City,
      patient.Email
    ],
    (error, results) => {
      if (error) return res.json({ error: error })
      db.connection.query(
        'INSERT INTO patient (FirstName, LastName, SocialSecurityNumber, ProofOfIdentification, IdentificationType, CreatedDate, CreatedBy, ContactDetailId, IsDeleted) VALUES (?,?,?,?,?,?,?,?,?)',
        [
          patient.FirstName,
          patient.LastName,
          patient.SocialSecurityNumber,
          patient.ProofOfIdentification,
          patient.IdentificationType,
          new Date(),
          patient.CreatedBy,
          results.insertId,
          false
        ],
        function (error, results, fields) {
          if (error) return res.json({ error: error })
          else { res.status(200).send('OK') }
        }
      )
    })
}

/** Edit patient.
 *
 * @param {object} req - request object
 * @param {object} res - result object
 */
apiController.editPatient = async (req, res) => {
  const ssn = req.body.ssn
  const patient = req.body

  db.connection.query(
    'SELECT * FROM patient WHERE SocialSecurityNumber = ?', ssn,
    (error, results) => {
      if (error) return res.json({ error: error })
      db.connection.query(
        `UPDATE contactdetails WHERE ContactDetailId = ${results.ContactDetailId} (PhoneNo, Adress, PostalNo, City, Email) VALUES (?,?,?,?,?)`,
        [
          patient.PhoneNo,
          patient.Adress,
          patient.PostalNo,
          patient.City,
          patient.Email
        ],
        (error, results) => {
          if (error) return res.json({ error: error })
          db.connection.query(
            `UPDATE patient WHERE PatientId = ${results.PatientId} (FirstName, LastName, SocialSecurityNumber, ProofOfIdentification, IdentificationType) VALUES (?,?,?,?,?)`,
            [
              patient.FirstName,
              patient.LastName,
              patient.SocialSecurityNumber,
              patient.ProofOfIdentification,
              patient.IdentificationType
            ],
            function (error, results, fields) {
              if (error) {
                console.log(error)
              }
            }
          )
          res.status(200).send('OK')
        })
    })
}

/** Soft delete patient.
 *
 * @param {object} req - request object
 * @param {object} res - result object
 */
apiController.deletePatient = async (req, res) => {
  const ssn = req.body.SocialSecurityNumber

  db.connection.query(
    'SELECT * FROM patient WHERE SocialSecurityNumber = ?', ssn,
    (error, results) => {
      if (error) return res.json({ error: error })
      db.connection.query(
            `UPDATE patient WHERE PatientId = ${results.PatientId} (IsDeleted) VALUES (?)`,
            [
              true
            ],
            function (error, results, fields) {
              if (error) console.log(error)
              res.status(200).send('OK')
            }
      )
    }
  )
}

module.exports = apiController
