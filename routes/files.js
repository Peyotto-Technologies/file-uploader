var express = require('express')
var router = express.Router()
var models = require('../models')
var Files = require('../lib/Files')
var env = process.env.NODE_ENV || 'development'
var config = require(__dirname + '/../config/config.json')[env]
var multer = require('multer')
var upload = multer({ dest: './public/img' })

/* GET a single file from the folder */
router.get('/:fileId', function (req, res, next) {
  var fileId = parseInt(req.params.fileId, 10) || 0

  return models.Files.findOne({
    where: {id: fileId, user_id: req.user.id}
  }).then(fileData => {
    return res.json({status: 'ok', file: fileData})
  }).catch(err => {
    next(err)
  })
})

/* create new file. */
router.post('/:folderId', upload.single('uploadFile'), function (req, res, next) {
  if (!req.user) {
    return res.json({status: 'error', message: '403 error'})
  }

  var folderId = parseInt(req.params.folderId, 10) || 0
  var tempFiles = req.file
  console.log('tempFiles-------', tempFiles)
  if (!tempFiles) {
    return res.json({status: 'error', message: 'file name name is missing.'})
  }

  return models.Folders.findOne({
    where: {id: folderId, user_id: req.user.id}
  }).then(pfolder => {
    return Files.createFileDeleteTmp(tempFiles, pfolder.path)
  }).then((fileInfo) => {
    return models.Files.create({
      file_name: fileInfo.originalname,
      file_path: fileInfo.finalPath,
      folder_id: folderId,
      mimetype: fileInfo.mimetype,
      thumbnail_path: fileInfo.thumbnail_path,
      user_id: req.user.id
    })
  }).then(newFile => {
    return res.json({status: 'ok', id: newFile.id})
  }).catch(err => {
    next(err)
  })
})

router.delete('/:fileId', function (req, res, next) {
  var fileId = parseInt(req.params.fileId, 10) || 0

  return models.Files.findOne({
    where: {id: fileId, user_id: req.user.id}
  }).then(fileInfo => {
    if (!fileInfo) {
      return Promise.reject(new Error('There is no such file!'))
    }
    return Files.deleteFile(fileInfo.file_path).then(() => {
      return models.Files.destroy({ where: {id: fileId, user_id: req.user.id} })
    }).then(() => {
      return res.json({status: 'ok'})
    }).catch(err => {
      next(err)
    })
  })
})

router.put('/:fileId', function (req, res, next) {
  var fileId = parseInt(req.params.fileId, 10) || 0
  var fileName = req.body.fileName || ''
  if (fileName === '') {
    return res.json({status: 'error', message: 'file name name is missing.'})
  }
  fileName = fileName.replace(/[|&;$%#@*"<>()+,^! ]/g, '_')

  return models.Files.findOne({
    where: {id: fileId, user_id: req.user.id}
  }).then(fileInfo => {
    if (!fileInfo) {
      return Promise.reject(new Error('There is no such file!'))
    }
    return Files.renameFile(fileInfo, fileName).then(newPath => {
      return models.Files.update(
        {file_name: fileName, file_path: newPath},
        {where: {id: fileId, user_id: req.user.id}})
    }).then(() => {
      return res.json({status: 'ok'})
    }).catch(err => {
      next(err)
    })
  })
})

// ordering by ...
router.get('/:fileId/:order/:orderby', function (req, res, next) {
  return models.Files.findAll({ limit: 10, order: '"' + req.params.orderby + '" ' + req.params.order }, {where: {user_id: req.user.id}}).then(files => {
    return res.json({status: 'ok', files})
  }).catch(err => {
    next(err)
  })
})

module.exports = router
