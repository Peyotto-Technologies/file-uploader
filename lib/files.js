var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs'))
var easyimg = require('easyimage')
var thumb = require('node-thumbnail').thumb
//var config = require('../config')

function createFileDeleteTmp (tempFiles, path) {
  return fs.readFileAsync(tempFiles.path).then(data => {
    return fs.writeFileAsync(path + '/' + tempFiles.originalname, data)
  }).then(() => {
    return deleteFile(tempFiles.destination + '/' + tempFiles.filename).then(() => {
      tempFiles.finalPath = path + '/' + tempFiles.originalname
      if (config.thumbMimeTypes.includes(tempFiles.mimetype)) {
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

function renameFile (fileInfo, fileName) {
  var oldPath = fileInfo.file_path
  var newPath = oldPath.substring(0, oldPath.lastIndexOf('/'))
  newPath = newPath + '/' + fileName

  if (fs.existsAsync(newPath)) {
    return Promise.reject(new Error('File already exists!'))
  }
  return fs.renameAsync(oldPath, newPath).then(newPath => {
    return Promise.resolve(newPath)
  })
}

function createThumbnail (fileInfo) {
  console.log('**** = ', fileInfo.finalPath)
  return thumb({
    source: fileInfo.finalPath + fileInfo.originalname,
    destination: '../public/img/thumbs/'
  }).then(img => {
    console.log('THUMB promise = ', img) // ?????????????
    return Promise.resolve(fileInfo)
  })
}

module.exports = {
  createFileDeleteTmp,
  deleteFile,
  renameFile
}
