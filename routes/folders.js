var express = require('express')
var router = express.Router()
 var models = require('../models')

/* GET users listing. */
router.post('/', function (req, res, next) {

  /*** api call here ***/

  var folderId = 0,
      status;
  models.Folders
    .build({
      name: folderName,
      user_id: user.id,
      path: new Date()
    })
    .save()
    .then(function(data) {
      folderId = data.id;
      status = 'ok';
    }).catch(function(error) {
      status = 'error';
  })

  res.json({
    status: status,
    folderId: folderId
  })

})

/* GET SINGLE user info. */
router.get('/:folderId', function (req, res, next) {
  var folderId = parseInt(req.params.folderId, 10) || 0

  if (folderId !== 0) {

    /* models.Users.findOne({id: user_id}).then(function (user) {
     res.json(user)
     })*/

    res.json({
      status: 'ok',
      items: [ {
        id: 1,
        type: '',
        name: 'bla',
        filepath: '',
        thumbnailPath: ''
      } ]
    })
  } else {
    res.json({
      status: 'error',
      message: 'Invalid folder id.'
    })
  }
})

router.delete('/:folderId', function (req, res, next) {
  res.send({
    status: 'ok'
  })
})

router.put('/:folderId', function (req, res, next) {
  res.send({
    status: 'ok'
  })
})

module.exports = router
