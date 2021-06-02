import * as td from 'testdouble';
 
global.td = td;

require('testdouble-jest')(td, jest)

afterEach(function () {  
  td.reset()
}) 
