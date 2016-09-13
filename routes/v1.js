var express = require('express')
var app = module.exports = express()

app.use('*', function (req, res, next) {
  req.user = {
    id: 10
  }

  next()
})

app.use('/files', require('./files'))
app.use('/folders', require('./folders'))
