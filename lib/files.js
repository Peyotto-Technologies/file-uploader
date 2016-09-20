var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs'))
var easyimg = require('easyimage')
// var thumb = require('node-thumbnail').thumb
//var config = require('../config') ????????
var thumbMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

function createFileDeleteTmp (tempFiles, path) {
  return fs.readFileAsync(tempFiles.path).then(data => {
    return fs.writeFileAsync(path + '/' + tempFiles.originalname, data)
  }).then(() => {
    return deleteFile(tempFiles.destination + '/' + tempFiles.filename).then(() => {
      tempFiles.finalPath = path + '/' + tempFiles.originalname
      if (thumbMimeTypes.indexOf(tempFiles.mimetype) !== -1) {
        return createThumbnail(tempFiles)
      } else {
        tempFiles.thumbnail_path = ''
        return Promise.resolve(tempFiles)
      }
    })
  })
}

function deleteFile (fullPath) {
  return fs.unlinkAsync(fullPath).then(() => {
    return fullPath
  })
}

function exists (path, flag) {
  return fs.openAsync(path, flag).then(() => {
    return true
  }).catch(function (e) {
    if (e.code === 'ENOENT') {
      return false
    }
    return Promise.reject(e)
  })
}

function renameFile (fileInfo, fileName) {
  var oldPath = fileInfo.file_path
  var newPath = oldPath.substring(0, oldPath.lastIndexOf('/'))
  newPath = newPath + '/' + fileName

  if (exists(newPath, 'r')) {
    return Promise.reject(new Error('File with this name already exists!'))
  }
  return fs.renameAsync(oldPath, newPath).then(newPath => {
    return Promise.resolve(newPath)
  })
}

function createThumbnail (fileInfo) {
  return easyimg.thumbnail({
    src: fileInfo.finalPath,
    dst: '../public/img/thumbs/',
    width: 128,
    height: 128,
    x: 0,
    y: 0
  }).then(function (file) {
    console.log('++++++++++ = ', file)
  })
}

module.exports = {
  createFileDeleteTmp,
  deleteFile,
  renameFile
}
