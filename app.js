const path = require('path')
require('dotenv').config({ path: path.join(__dirname) + '/.env' })

const express = require('express')

const app = express()
const logger = require('morgan')
const cors = require('cors')

app.use(logger('dev'))

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))
app.use(express.json()) // Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded bodies

// Routes
app.use('/', require('./routes/apiRouter'))

// Auth error message
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    console.log(err.message)
    res.status(401).send(err.message)
  }
})

app.listen(process.env.PORT, () => {
  console.log('Server running on http://localhost:' + process.env.PORT)
  console.log('Press Ctrl-C to terminate...\n')
})
