var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs'))
var models = require('../models')

function makeDir (path) {
  return fs.mkdirAsync(path).then(() => {
    return path
  })
}

function getParentFolderPath (parentId, user_id) {
  if (parentId === 0) {
    if (!fs.existsSync('/' + user_id)) {
      makeDir('/' + user_id)
    }
    return Promise.resolve('/' + user_id)
  }

  return models.Folders.findOne({
    where: {id: parentId, user_id: user_id}
  }).then(pFolder => {
    if (!pFolder) {
      return Promise.reject(new Error('Parent folder does not exist!'))
    } else {
      return pFolder.path
    }
  })
}

function deleteDir (folderId, user_id) {
  return models.Folders.findOne({
    where: {id: folderId, user_id: user_id}
  }).then(pFolder => {
    if (!pFolder) {
      return Promise.reject(new Error('Folder does not exist!'))
    } else {
      fs.rmdirSync(pFolder.path)
      return pFolder.id
    }
  })
}

function renameDir (folderId, folderName, user_id) {
  return models.Folders.findOne({
    where: {id: folderId, user_id: user_id}
  }).then(pFolder => {
    if (!pFolder) {
      return Promise.reject(new Error('Folder does not exist!'))
    } else {
      var oldPath = pFolder.path
      var newPath = oldPath.replace(pFolder.name, folderName)
      fs.renameSync(oldPath, newPath)
      return newPath
    }
  })
}

module.exports = {
  makeDir,
  getParentFolderPath,
  deleteDir,
  renameDir
}
