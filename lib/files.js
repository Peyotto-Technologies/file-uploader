var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs'))
var models = require('../models')

function createFile (id, path) {

}

function deleteFile (id) {

}

function renameFile (id, name) {

}

module.exports = {
  createFile,
  deleteFile,
  renameFile
}
