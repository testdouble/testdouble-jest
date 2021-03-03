# testdouble-jest

Support for [testdouble.js](https://github.com/testdouble/testdouble.js) for
users of [Jest](https://github.com/facebook/jest)!

Note that testdouble-jest requires testdouble@3.6.0 and jest@21.0.0 or higher to work.

## Installation

```
$ npm i -D testdouble-jest
```

Then, from a test helper (we recommend setting a
[setupFilesAfterEnv](https://jestjs.io/docs/en/configuration.html#setupfilesafterenv-array)
module), invoke the module and pass in both `td` and `jest`, like so:

```js
global.td = require('testdouble')
require('testdouble-jest')(td, jest)
```

For an example of a helper that sets up testdouble.js, testdouble-jest, and
ensures `td.reset()` is called after each test, look at
[example/helper.js](/example/helper.js) in this repo.

## Usage

When you invoke `testdouble-jest`, it does two things: (1) adds support for
using `td.replace()` for module replacement in Jest tests, and (2) adds a new
top-level `td.mock()` function that mirrors the `jest.mock()` API.

We recommend using `td.replace()`, since it's terser (by returning the fake
instead of the `jest` object) and your use of testdouble.js will remain portable
even if you were to move to a different test runner.

**`td.replace(moduleName[, manualStub])`**

Once you've initialized testdouble-jest in your test run, `td.replace()` will be
able to replace modules just as it does in any other test runner (as of 
testdouble@3.5.0). Functionally, it's delegates to `td.mock()`, but behaves just 
as it [always
has](https://github.com/testdouble/testdouble.js#module-replacement-with-nodejs)
for module replacement.

Here's a trivial example:

```js
let loadInvoices, subject
describe('td.replace', () => {
  beforeEach(() => {
    loadInvoices = td.replace('./load-invoices')
    subject = require('./calculate-payment')
  })
  it('calculates payments', () => {
    td.when(loadInvoices(2018, 7)).thenReturn([24,28])

    const result = subject('2018-07')

    expect(result).toEqual(52)
  })
})
```

For a runnable example, check
[example/td-replace.test.js](/example/td-replace.test.js).

**`td.mock(moduleName[, moduleFactory, options])`**

`td.mock()` is designed to have the same API as
[`jest.mock()`](https://facebook.github.io/jest/docs/en/es6-class-mocks.html).
If you just pass a module name to `td.mock()`, it will imitate the real
dependency and use Jest's own module replacement facility to ensure that any
`require()` calls by your test subject receive the testdouble fake, as opposed
to the real dependency. There's an example in this repo at
[example/td-mock.test.js](/example/td-mock.test.js).

If you've used `jest.mock()` before, `td.mock()` will seem pretty familiar.
`td.mock()` returns the `jest` object (since that's what
`jest.mock()` does), so your test will also need to `require()` the thing you
just faked if you want to set up any stubbings or invocation assertions.

Note that if you provide a `moduleFactory` and/or `options` argument, `td.mock`
will simply delegate to `jest.mock`, since it won't have anything
testdouble.js-specific to do.
