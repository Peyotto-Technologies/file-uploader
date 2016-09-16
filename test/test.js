var Promise = require('bluebird')
var should = require('should')
var supertest = require('supertest')
var assert = require('assert')

var app = require(__dirname + '/../app')

// test for adding a new folder
describe('Creating folder: ', function () {
  it('should add a new folder with name and parent id', function (done) {
    supertest(app)
      .post('/api/v1/folders')
      .send({
        status: 'ok',
        folderName: 'test'
      })
      .end(function (err, res) {
        if (err) {
          res.body.should.have.property('message')
          done(err)
        }
        res.body.should.have.property('status', 'ok')
        res.body.should.have.property('id')
        done()
      })
  })
})

// test for adding a new file
describe('Add a file: ', function () {
  it('should add a new file with name and parent id', function (done) {
    supertest(app)
      .post('/api/v1/files/:folderId')
      .send({
        status: 'ok',
        fileName: 'test',
        folderId: 2
      })
      .end(function (err, res) {
        if (err) {
          res.body.should.have.property('message')
          done(err)
        }
        res.body.should.have.property('status', 'ok')
        res.body.should.have.property('id')
        done()
      })
  })
})

// list folder contents
describe('List folder contents: ', function () {
  it('should list folder contents by folder id', function (done) {
    supertest(app)
      .get('/api/v1/folders/5')
      .end(function (err, res) {
        if (err) {
          res.body.should.have.property('status', 'error')
          done(err)
        }
        res.body.should.have.property('status', 'ok')
        res.body.should.have.property('folderInfo')
        done()
      })
  })
})

// delete uploaded file
describe('Delete uploaded file: ', function () {
  it('delete file by id', function (done) {
    supertest(app)
      .delete('/api/v1/files/:fileId')
      .send({
        status: 'ok',
        fileId: 1
      })
      .end(function (err, res) {
        if (err) {
          res.body.should.have.property('message')
          done(err)
        }
        res.body.should.have.property('status', 'ok')
        done()
      })
  })
})

// delete uploaded folder
describe('Delete uploaded folder: ', function () {
  it('delete folder by id', function (done) {
    supertest(app)
      .delete('/api/v1/folders/:folderId')
      .send({
        status: 'ok',
        folderId: 15
      })
      .end(function (err, res) {
        if (err) {
          res.body.should.have.property('message')
          done(err)
        }
        res.body.should.have.property('status', 'ok')
        done()
      })
  })
})

// update folder
describe('Update folder: ', function () {
  it('should update folder by id', function (done) {
    supertest(app)
      .put('/api/v1/folders/')
      .send({
        status: 'ok',
        folderId: 15,
        folderName: 'new n000ame'

      })
      .end(function (err, res) {
        if (err) {
          res.body.should.have.property('message')
          done(err)
        }
        res.body.should.have.property('status', 'ok')
        res.body.should.have.property('name')
        done()
      })
  })
})

// rename file
describe('Rename file: ', function () {
  it('should rename file by id', function (done) {
    supertest(app)
      .put('/api/v1/files/1')
      .send({
        status: 'ok'

      })
      .end(function (err, res) {
        if (err) {
          res.body.should.have.property('message')
          done(err)
        }
        res.body.should.have.property('status', 'ok')
        done()
      })
  })
})

// Order files
describe('Order files: ', function () {
  it('should order files by - upload date, name', function (done) {
    supertest(app)
      .get('/api/v1/files')
      .send({
        status: 'ok'

      })
      .end(function (err, res) {
        if (err) {
          res.body.should.have.property('message')
          done(err)
        }
        res.body.should.have.property('status', 'ok')
        done()
      })
  })
})
