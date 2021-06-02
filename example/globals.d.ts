/// <reference types="jest" />
/// <reference types="testdouble" />

declare namespace NodeJS {
  interface Global {
    td: typeof testdouble;
  }
}

declare const td: typeof testdouble;

declare namespace testdouble {
  export const mock: typeof jest.mock;
}
