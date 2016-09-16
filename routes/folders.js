var express = require('express')
var router = express.Router()
var models = require('../models')
var Folders = require('../lib/folders')
var env = process.env.NODE_ENV || 'development'
var config = require(__dirname + '/../config/config.json')[env]

/* create new folder. */
router.post('/', function (req, res, next) {
  if (!req.user) {
    return res.json({status: 'error', message: '403 error'})
  }

  var parentId = parseInt(req.body.parentId, 10) || 0
  var folderName = req.body.folderName || ''
  if (folderName === '') {
    return res.json({status: 'error', message: 'folderName name is missing.'})
  }
  folderName = folderName.replace(/[|&;$%#@*"<>()+,^! ]/g, '_')

  return Folders.getParentFolderPathCreateRoot(parentId, req.user.id).then(pPath => {
    return Folders.makeDir(pPath + '/' + folderName)
  }).then(path => {
    return models.Folders.create({
      name: folderName,
      path: path,
      parent_id: parentId,
      user_id: req.user.id
    })
  }).then(newFolder => {
    return res.json({status: 'ok', id: newFolder.id})
  }).catch(err => {
    return res.json({status: 'error', message: err.message})
  })
})

/* GET SINGLE folder info. */
router.get('/:folderId', function (req, res, next) {
  var folderId = parseInt(req.params.folderId, 10) || 0

  return models.Folders.findOne({
    where: {id: folderId, user_id: req.user.id}
  }).then(folderInfo => {
    return models.Files.findAll({
      where: {folder_id: folderInfo.id, user_id: req.user.id}
    })
  }).then(fileItems => {
    return res.json({status: 'ok', folderInfo: fileItems})
  }).catch(err => {
    next(err)
  })
})

router.delete('/:folderId', function (req, res, next) {
  var folderId = parseInt(req.params.folderId, 10) || 0

  return models.Folders.findOne({
    where: {id: folderId, user_id: req.user.id}
  }).then(folderInfo => {
    return Folders.deleteDir(folderInfo).then(id => {
      return models.Folders.destroy({ where: {id: id, user_id: req.user.id} })
    }).then(deletedFolder => {
      return models.Files.destroy({ where: {folder_id: deletedFolder.id, user_id: req.user.id} })
    }).then(() => {
      return res.json({status: 'ok'})
    }).catch(err => {
      next(err)
    })
  })
})

router.put('/', function (req, res, next) {
  var folderId = parseInt(req.body.folderId, 10) || 0
  var folderName = req.body.folderName || ''

  if (folderName === '') {
    return res.json({status: 'error', message: 'folderName name is missing.'})
  }

  folderName = folderName.replace(/[|&;$%#@*"<>()+,^! ]/g, '_')

  return models.Folders.findOne({
    where: {id: folderId, user_id: req.user.id}
  }).then(data => {
    return Folders.renameDir(data, folderName).then(newPath => {
      return models.Folders.update(
        {name: folderName, path: newPath},
        {where: {id: folderId, user_id: req.protouser.id}
      })
    }).then(updatedFolder => {
      return res.json({status: 'ok', name: updatedFolder.name})
    }).catch(err => {
      next(err)
    })
  })
})

module.exports = router
