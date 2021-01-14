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
    'SELECT * FROM user WHERE SocialSecurityNumber = ?',
    ssn,
    (error, results) => {
      if (error) return res.json({ error: error })
      res.status(200).send(results)
    }
  )
}

/** Get al Male patients from the database.
 *
 * @param {object} req - request object
 * @param {object} res - result object
 */
apiController.getPatientMale = async (req, res) => {
  db.connection.query(
    'SELECT * FROM malepatients',
    (error, results) => {
      if (error) return res.json({ error: error })
      res.status(200).send(results)
    }
  )
}

/** Get al Female patients from the database.
 *
 * @param {object} req - request object
 * @param {object} res - result object
 */
apiController.getPatientFemale = async (req, res) => {
  db.connection.query(
    'SELECT * FROM femalepatients',
    (error, results) => {
      if (error) return res.json({ error: error })
      res.status(200).send(results)
    }
  )
}

/** Get all patients from database.
 *
 * @param {object} req - request object
 * @param {object} res - result object
 */
apiController.getAllPatients = async (req, res) => {
  db.connection.query(
    'SELECT user.*, contactdetails.* FROM user JOIN contactdetails ON patient.ContactDetailId = contactdetails.ContactDetailId WHERE IsDeleted = 0',
    (error, results) => {
      if (error) return res.json({ error: error })
      else res.status(200).send(results)
    }
  )
}

/** Get group patients on city from database.
 *
 * @param {object} req - request object
 * @param {object} res - result object
 */
apiController.getCountByCity = async (req, res) => {
  db.connection.query(
    'SELECT COUNT(ContactDetailId) AS count, City AS cityName FROM contactdetails GROUP BY City',
    (error, results) => {
      if (error) return res.json({ error: error })
      else res.status(200).send(results)
    }
  )
}

/** Get all patients from a city in the database.
 *
 * @param {object} req - request object
 * @param {object} res - result object
 */
apiController.getPatientsInCity = async (req, res) => {
  const city = req.params.city
  console.log(city)
  db.connection.query(
    'SELECT * FROM user JOIN contactdetails ON user.ContactDetailId = contactdetails.ContactDetailId AND contactdetails.City = ? WHERE IsDeleted = 0',
    city,
    (error, results) => {
      if (error) return res.json({ error: error })
      res.status(200).send(results)
    }
  )
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
      else {
        db.connection.query(
          'INSERT INTO user (FirstName, LastName, SocialSecurityNumber, IdentificationType, CreatedDate, CreatedBy, ContactDetailId, IsDeleted) VALUES (?,?,?,?,?,?,?,?)',
          [
            patient.FirstName,
            patient.LastName,
            patient.SocialSecurityNumber,
            patient.IdentificationType,
            new Date(),
            patient.CreatedBy,
            results.insertId,
            false
          ],
          function (error, results, fields) {
            if (error) return res.json({ error: error })
            else res.status(200).send('OK')
          }
        )
      }
    }
  )
}

/** Edit patient.
 *
 * @param {object} req - request object
 * @param {object} res - result object
 */
apiController.editPatient = async (req, res) => {
  const patientId = req.body.PatientId
  const patient = req.body
  db.connection.query(
    'SELECT * FROM user WHERE UserId = ?',
    patientId,
    (error, results) => {
      const contactDetailId = results[0].ContactDetailId
      if (error) return res.json({ error: error })
      db.connection.query(
                `UPDATE contactdetails SET PhoneNo = ?, Adress = ?, PostalNo = ?, City = ?, Email = ? WHERE ContactDetailId = ${contactDetailId}`,
                [
                  patient.PhoneNo,
                  patient.Adress,
                  patient.PostalNo,
                  patient.City,
                  patient.Email
                ],
                (error, results) => {
                  if (error) return res.json({ error: error })
                  else {
                    db.connection.query(
                            `UPDATE user SET FirstName = ?, LastName = ?, SocialSecurityNumber = ?, IdentificationType = ? WHERE PatientId = ${patientId}`,
                            [
                              patient.FirstName,
                              patient.LastName,
                              patient.SocialSecurityNumber,
                              patient.IdentificationType
                            ],
                            function (error, results) {
                              if (error) return res.json({ error: error })
                              else res.status(200).send('OK')
                            }
                    )
                  }
                }
      )
    }
  )
}

/** Soft delete patient.
 *
 * @param {object} req - request object
 * @param {object} res - result object
 */
apiController.deletePatient = async (req, res) => {
  const ssn = req.params.ssn

  db.connection.query(
    'UPDATE user SET IsDeleted = ? WHERE `SocialSecurityNumber` = ?',
    [true, ssn],
    function (error, results, fields) {
      if (error) return res.json({ error: error })
    }
  )
  res.status(200).send('OK')
}

module.exports = apiController
