/*
 * Usage:
 *   require('testdouble-jest')(td, jest)
 *
 * This will decorate td with `td.mock` to allow
 * for module mocking using test double fakes instead
 * of Jest's built-in ones
 */
module.exports = function (td, jest) {
  td.mock = function (moduleName, factory, options) {
    if (factory) return jest.mock(moduleName, factory, options)

    const realThing = jest.requireActual(moduleName)
    return jest.mock(moduleName, function () {
      ensureTdImitate(td)
      return td.imitate(realThing, moduleName + ': ' + nameFor(realThing))
    }, options)
  }

  td.mock.requireMock = function (moduleName) {
    return jest.requireMock(moduleName)
  }

  td.mock.requireActual = function (moduleName) {
    return jest.requireActual(moduleName)
  }
}

const ensureTdImitate = function (td) {
  if (!td.imitate) {
    throw new Error('testdouble-jest depends on the td.imitate() API, which was added in testdouble@3.4.0')
  }
}

const nameFor = function (realThing) {
  if (!(typeof realThing === 'function')) return ''
  return realThing.name || '(anonymous function)'
}
