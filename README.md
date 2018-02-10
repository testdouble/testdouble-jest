# testdouble-jest

Support for [testdouble.js](https://github.com/testdouble/testdouble.js) for
users of [Jest](https://github.com/facebook/jest)!

## Installation

```
$ npm i -D testdouble-jest
```

And then, somewhere in a test helper (probably wherever you have
`global.td = require('testdouble')`), invoke the module and pass in both `td` and
`jest`. You know, something like this:

```js
global.td = require('testdouble')
require('testdouble-jest')(td, jest)
```

## Usage

When you invoke `testdouble-jest`, it adds a new method to testdouble.js:
`td.mock()`!

**`td.mock(moduleName[, moduleFactory, options])`**

`td.mock()` is designed to have the same API as
[`jest.mock()`](https://facebook.github.io/jest/docs/en/es6-class-mocks.html).
If you just pass a module name to `td.mock()`, it will imitate the real
dependency and use Jest's own module mocking facility to ensure that any
`require()` calls by your test subject receive the testdouble fake, as opposed
to the real dependency.

Here's an example to give you an idea of what typical usage looks like:

```js
let subject
describe('td.replace', () => {
  beforeEach(() => {
    td.mock('./load-invoices')

    subject = require('./calculate-payment')
  })
  it('calculates payments', () => {
    const loadInvoices = require('./load-invoices')
    td.when(loadInvoices(2018, 7)).thenReturn([24,28])

    const result = subject('2018-07')

    expect(result).toEqual(52)
  })
})
```

If you've used `jest.mock()` before, the above will seem pretty familiar. 
`td.mock()` will return the `jest` object (since that's what
`jest.mock()` does), so your test will also need to `require()` the thing you
just faked if you want to set up any stubbings or invocation assertions. You may
also want to look at this project's [example](/example) project.

Note that if you provide a `moduleFactory` and/or `options` argument, `td.mock`
will simply delegate to `jest.mock`, since it won't have anything
testdouble.js-specific to do.
