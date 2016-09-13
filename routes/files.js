var express = require('express')
var router = express.Router()
var models = require('../models')
var Promise = require('bluebird')
var Files = require('../lib/Files')
var env = process.env.NODE_ENV || 'development'
var config = require(__dirname + '/../config/config.json')[env]
var user = {id: 10}

/* GET a single file from the folder */
router.get('/:fileId', function (req, res, next) {
  var fileId = parseInt(req.params.fileId, 10) || 0

  return models.Files.findOne({
    where: {id: fileId, user_id: user.id}
  }).then(fileData => {
    return res.json({status: 'ok', file: fileData})
  }).catch(err => {
    console.log(err.stack)
    return res.json({status: 'error', message: err.message})
  })
})

/* create new file. */
router.post('/:folderId', function (req, res, next) {
  if (!user) {
    return res.json({status: 'error', message: '403 error'})
  }

  var folderId = parseInt(req.params.folderId, 10) || 0
  var fileName = req.body.fileName || ''
  if (fileName === '') {
    return res.json({status: 'error', message: 'file name name is missing.'})
  }
  fileName = fileName.replace(/[|&;$%#@*"<>()+,^! ]/g, '_')

  return models.Folders.findOne({
    where: {id: folderId, user_id: user.id}
  }).then(pfolder => {
    return Files.createFile(fileName, pfolder.path) // TODO creatFile should be written in files lib
  }).then((fileInfo) => {
    return models.Files.create({
      name: fileName,
      path: fileInfo.filePath,
      folder_id: folderId,
      mimetype: fileInfo.mimetype,
      thumbnail_path: fileInfo.thumbnail_path,
      user_id: user.id
    })
  }).then(newFile => {
    return res.json({status: 'ok', id: newFile.id})
  }).catch(err => {
    return res.json({status: 'error', message: err.message})
  })
})

router.delete('/:fileId', function (req, res, next) {
  var fileId = parseInt(req.params.fileId, 10) || 0

  return Files.deleteFile(fileId).then(() => { // TODO create deleteFile function in files lib
    return models.Files.destroy({ where: {id: fileId, user_id: user.id} })
  }).then(() => {
    return res.json({status: 'ok'})
  }).catch(err => {
    return res.json({status: 'error', message: err.message})
  })
})

router.put('/:fileId', function (req, res, next) {
  var fileId = parseInt(req.params.fileId, 10) || 0
  var fileName = req.body.fileName || ''
  if (fileName === '') {
    return res.json({status: 'error', message: 'file name name is missing.'})
  }
  fileName = fileName.replace(/[|&;$%#@*"<>()+,^! ]/g, '_')

  return Files.renameFile(fileId, fileName).then(() => { // TODO create renameFile function in files lib
    return models.Files.update({ where: {id: fileId, user_id: user.id} })
  }).then(() => {
    return res.json({status: 'ok'})
  }).catch(err => {
    return res.json({status: 'error', message: err.message})
  })
})

module.exports = router
