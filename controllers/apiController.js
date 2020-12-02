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

module.exports = apiController
