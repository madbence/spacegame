import test from 'ava';
import * as v from '../src/common/util/vector';

test('vector#add', t => {
  const a = { x: 1, y: 0 };
  const b = { x: 1, y: 2 };
  t.same(v.add(a, b), { x: 2, y: 2 });
  t.is(a.x, 1);
  t.is(a.y, 0);
  t.is(b.x, 1);
  t.is(b.y, 2);

  [
    [[0, 0], [0, 0], [0, 0]],
    [[0, 0], [1, 1], [1, 1]],
    [[1, 1], [0, 0], [1, 1]],
    [[1, 1], [1, 1], [2, 2]],
  ].forEach(([[x1, y1], [x2, y2], [x3, y3]]) => {
    const a = { x: x1, y: y1 };
    const b = { x: x2, y: y2 };
    const c = { x: x3, y: y3 };
    t.same(v.add(a, b), c);
  });
  t.end();
});
