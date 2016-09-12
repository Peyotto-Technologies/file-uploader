var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({
    status: 'ok',
    files: []
  })
})

router.delete('/:fileId', function (req, res, next) {
  res.send({
    status: 'ok'
  })
})

router.put('/:fileId', function (req, res, next) {
  res.send({
    status: 'ok'
  })
})

module.exports = router
