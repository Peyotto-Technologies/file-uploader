var express = require('express')
var router = express.Router()
var models = require('../models')
var Promise = require('bluebird')
var Folders = require('../lib/folders')
var env = process.env.NODE_ENV || 'development'
var config = require(__dirname + '/../config/config.json')[env]
var user = {id: 10}

/* create new folder. */
router.get('/', function (req, res, next) {
  if (!user) {
    return res.json({status: 'error', message: '403 error'})
  }

  var parentId = parseInt(req.query.parentId, 10) || 0
  var folderName = req.query.folderName || ''
  if (folderName === '') {
    return res.json({status: 'error', message: 'folderName name is missing.'})
  }
  folderName = folderName.replace(/[|&;$%#@*"<>()+,^! ]/g, '_')

  return Folders.getParentFolderPath(parentId, user.id).then(pPath => {
    return Folders.makeDir(pPath + '/' + folderName)
  }).then(path => {
    return models.Folders.create({
      name: folderName,
      path: path,
      parent_id: parentId,
      user_id: user.id
    })
  }).then(newFolder => {
    return res.json({status: 'ok', id: newFolder.id})
  }).catch(err => {
    console.log(err.stack)
    return res.json({status: 'error', message: err.message})
  })
})

/* GET SINGLE folder info. */
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
