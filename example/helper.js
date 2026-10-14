global.td = require('testdouble')

require('testdouble-jest')(td, jest)

afterEach(function () {
  td.reset()
})
