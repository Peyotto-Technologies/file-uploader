var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs'))
var easyimg = require('easyimage')

function createFileDeleteTmp (tempFiles, path) {
  return fs.readFileAsync(tempFiles.path).then(data => {
    return fs.writeFileAsync(path + '/' + tempFiles.originalname, data)
  }).then(() => {
    return deleteFile(tempFiles.destination + '/' + tempFiles.filename).then(() => {
      tempFiles.finalPath = path + '/' + tempFiles.originalname
      return createThumbnail(tempFiles)
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
  fs.renameAsync(oldPath, newPath)
  return Promise.resolve(newPath)
}

function createThumbnail (fileInfo) {
  easyimg.thumbnail({
    src: fileInfo.finalPath,
    dst: './public/img/thumbs/' + fileInfo.originalname,
    width: 128,
    height: 128,
    x: 0,
    y: 0
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
