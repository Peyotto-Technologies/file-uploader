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

module.exports = {
  makeDir,
  getParentFolderPath
}
