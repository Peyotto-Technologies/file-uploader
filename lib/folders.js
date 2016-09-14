var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs'))
var models = require('../models')

function makeDir (path) {
  return fs.mkdirAsync(path).then(() => {
    return path
  })
}

function getParentFolderPathCreateRoot (parentId, user_id) {
  if (parentId === 0) {
    return fs.existsAsync('/' + user_id).then(result => {
      if (!result) {
        return makeDir('/' + user_id)
      } else {
        return Promise.resolve('/' + user_id)
      }
    })
  }

  return models.Folders.findOne({
    where: {id: parentId, user_id: user_id}
  }).then(pFolder => {
    if (!pFolder) {
      return Promise.reject(new Error('Parent folder does not exist!'))
    }
    return Promise.resolve(pFolder.path)
  })
}

function deleteDir (folderInfo) {
  return fs.rmdirAsync(folderInfo.path).then(() => {
    return Promise.resolve(folderInfo.id)
  })
}

function renameDir (folderInfo, folderName) {
  var oldPath = folderInfo.path
  var newPath = oldPath.substring(0, oldPath.lastIndexOf('/'))
  newPath = newPath + '/' + folderName

  if (fs.existsAsync(newPath)) {
    return Promise.reject(new Error('File already exists!'))
  }
  fs.renameAsync(oldPath, newPath)
  return Promise.resolve(newPath)
}

module.exports = {
  makeDir,
  getParentFolderPathCreateRoot,
  deleteDir,
  renameDir
}
