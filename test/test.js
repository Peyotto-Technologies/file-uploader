var Promise = require('bluebird')
var should = require('should')
var supertest = require('supertest')
var assert = require('assert')

var app = require(__dirname + '/../app')

describe('Sample Test: ', function () {
  it('Shoult do some samle route test', function (done) {
    supertest(app)
      .post('/api/v1/files/')
      .send({public_share: 'jekichan'})
      .end(function (err, res) {
        if (err) {
          done(err)
        }
        res.body.should.have.property('status', 'error')
        done()
      })
  })
})
