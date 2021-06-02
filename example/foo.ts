import bar from './bar';
import baz from './baz';
import qux from './quax';
import quux from './quux';

export default function () {
  quux(1337)
  return {
    bar: bar(42),
    baz: baz(),
    qux: qux()
  }
}

