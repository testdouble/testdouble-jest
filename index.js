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
    return mockAndMaybeReturn(moduleName, factory, options, td, jest, true)
  }
  td.mock._andReturn = function (moduleName, factory, options) {
    return mockAndMaybeReturn(moduleName, factory, options, td, jest, false)
  }
}

const mockAndMaybeReturn = function (moduleName, factory, options, td, jest, returnJest) {
  if (factory) {
    if (returnJest) {
      return jest.mock(moduleName, factory, options)
    } else {
      const mockFactoried = factory()
      jest.mock(moduleName, function () { return mockFactoried }, options)
      return mockFactoried
    }
  } else {
    ensureTdImitate(td)
    const realThing = jest.requireActual(moduleName)
    const mockThing = td.imitate(realThing, moduleName + ': ' + nameFor(realThing))

    const j = jest.mock(moduleName, function () {
      return mockThing
    }, options)
    return returnJest ? j : mockThing
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
