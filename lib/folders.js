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

function deleteDir (folderId, user_id) {
  return models.Folders.findOne({
    where: {id: folderId, user_id: user_id}
  }).then(pFolder => {
    if (!pFolder) {
      return Promise.reject(new Error('Folder does not exist!'))
    }
    return fs.rmdirAsync(pFolder.path).then(() => pFolder.id)
  })
}

function renameDir (folderId, folderName, user_id) {
  return models.Folders.findOne({
    where: {id: folderId, user_id: user_id}
  }).then(pFolder => {
    if (!pFolder) {
      return Promise.reject(new Error('Folder does not exist!'))
    }

    var oldPath = pFolder.path
    var newPath = oldPath.replace(pFolder.name, folderName) // TODO: BUG !!!
    if (fs.existsSync(newPath)) {
      return Promise.reject(new Error('Folder already exists!'))
    }
    fs.renameSync(oldPath, newPath)
    return Promise.resolve(newPath)
  })
}

module.exports = {
  makeDir,
  getParentFolderPath,
  deleteDir,
  renameDir
}
