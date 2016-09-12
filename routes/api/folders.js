var express = require('express')
var router = express.Router()
var models = require('../models')
var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs'))
var env = process.env.NODE_ENV || 'development'
var config = require(__dirname + '/../config/config.json')[env]
var user = {id: 10}


router.post('/', function (req, res, next) {

  if(!user || typeof req.body.folderName === 'undefined' || req.body.folderName === '') {
    res.json({status: "error", message: "403 error"});
  }

  var parentId = 0

  var folderName = req.body.folderName
  folderName = folderName.replace(/[|&;$%#@*"<>()+,^! ]/g, '_')

  if (typeof req.body.parentId !== 'undefined' || req.body.parentId !== '') {
    parentId = parseInt(req.body.parentId)
  }

  return models.Folders.findOne({
    where: {id: parentId, user_id: user.id}
  }).then(function(folder){
    if(folder){
      return folder.folder_path
    }
  }, function (err) {
    return /**/
  });

})