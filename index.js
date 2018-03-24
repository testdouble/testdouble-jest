/*
 * Usage:
 *   require('testdouble-jest')(td, jest)
 *
 * This will decorate td with `td.mock` to allow
 * for module mocking using test double fakes instead
 * of Jest's built-in ones
 */
module.exports = function (td, jest) {
  ensureTdFeatures(td)
  td.quibble.ignoreCallsFromThisFile()
  function absolutify (moduleName) {
    return td.quibble.absolutify(moduleName)
  }
  td.mock = function (moduleName, factory, options) {
    var absoluteModulePath = absolutify(moduleName)
    if (factory) return jest.mock(absoluteModulePath, factory, options)

    const realThing = jest.requireActual(absoluteModulePath)
    return jest.mock(absoluteModulePath, function () {
      return td.imitate(realThing, moduleName + ': ' + nameFor(realThing))
    }, options)
  }

  td.mock.requireMock = function (moduleName) {
    return jest.requireMock(absolutify(moduleName))
  }

  td.mock.requireActual = function (moduleName) {
    return jest.requireActual(absolutify(moduleName))
  }
}

const ensureTdFeatures = function (td) {
  if (!td.quibble || !td.imitate) {
    throw new Error('testdouble-jest depends on td.imitate and td.quibble, added in testdouble@3.4.0 and testdouble@3.6.0, respectively.')
  }
}

const nameFor = function (realThing) {
  if (!(typeof realThing === 'function')) return ''
  return realThing.name || '(anonymous function)'
}
