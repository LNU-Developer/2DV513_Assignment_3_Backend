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

/** Home route.
 *
 * @param {object} req - request object
 * @param {object} res - result object
 */
apiController.home = async (req, res) => {
  res.status(200).send('Data')
}

/** Insert test.
 *
 * @param {object} req - request object
 * @param {object} res - result object
 */
apiController.msg = async (req, res) => {
  console.log(req.body)
  db.connection.query(
    'INSERT INTO contactdetails (PhoneNo, Adress, PostalNo, City, Email, IsDeleted) VALUES (?,?,?,?,?,?)',
    [
      'test',
      'testgatan 1',
      '25250',
      'Helsinborg',
      'email@email.com',
      false
    ],
    (error, results) => {
      if (error) return res.json({ error: error })
      db.connection.query(
        'INSERT INTO patient (FirstName, LastName, SocialSecurityNumber, ProofOfIdentification, IdentificationType, CreatedDate, CreatedBy, ContactDetailId, IsDeleted) VALUES (?,?,?,?,?,?,?,?,?)',
        [
          'Kalle',
          'Anka',
          '350526-1959',
          true,
          'Licence',
          new Date(),
          1,
          results.insertId,
          false
        ],
        function (error, results, fields) {
          if (error) {
            console.log(error)
          }
        }
      )
      res.status(200).send(JSON.stringify(results))
    })
}

module.exports = apiController
