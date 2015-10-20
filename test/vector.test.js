import test from 'ava';
import * as v from '../src/common/util/vector';

function roundVector(v) {
  return {
    x: Math.round(v.x * 1000) / 1000,
    y: Math.round(v.y * 1000) / 1000,
  };
}

test('vector#add', t => {
  const a = { x: 1, y: 0 };
  const b = { x: 1, y: 2 };

  // returns result
  t.same(v.add(a, b), { x: 2, y: 2 });

  // does not mutates arguments
  t.is(a.x, 1);
  t.is(a.y, 0);
  t.is(b.x, 1);
  t.is(b.y, 2);

  // test that add really works
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

test('vector#sub', t => {
  const a = { x: 1, y: 0 };
  const b = { x: 1, y: 2 };

  // returns result
  t.same(v.sub(a, b), { x: 0, y: -2 });

  // does not mutates arguments
  t.is(a.x, 1);
  t.is(a.y, 0);
  t.is(b.x, 1);
  t.is(b.y, 2);

  // test that add really works
  [
    [[0, 0], [0, 0], [0, 0]],
    [[0, 0], [1, 1], [-1, -1]],
    [[1, 1], [0, 0], [1, 1]],
    [[1, 1], [1, 1], [0, 0]],
  ].forEach(([[x1, y1], [x2, y2], [x3, y3]]) => {
    const a = { x: x1, y: y1 };
    const b = { x: x2, y: y2 };
    const c = { x: x3, y: y3 };
    t.same(v.sub(a, b), c);
  });

  t.end();
});

test('vector#unit', t => {
  [
    [0, [0, 1]],
    [Math.PI * 2, [0, 1]],
    [Math.PI, [0, -1]],
    [Math.PI * 3, [0, -1]],
    [Math.PI / 2, [-1, 0]],
    [Math.PI * 3 / 2, [1, 0]],
    [Math.PI / -2, [1, 0]],
    [Math.PI / 4, [-Math.sqrt(2) / 2, Math.sqrt(2) / 2]],
  ].forEach(([n, [x, y]]) => {
    t.same(roundVector(v.unit(n)), roundVector({x, y}));
  });
  t.end();
});

test('vector#cross', t => {
  const a = { x: 1, y: 0 };
  const b = { x: 0, y: 1 };
  t.is(v.cross(a, b), 1);
  t.is(a.x, 1);
  t.is(a.y, 0);
  t.is(b.x, 0);
  t.is(b.y, 1);

  [
    [[1, 0], [0, 1], 1],
    [[0, 1], [1, 0], -1],
    [[1, 0], [1, 0], 0],
    [[1, 0], [-1, 0], 0],
  ].forEach(([[x1, y1], [x2, y2], n]) => {
    const a = { x: x1, y: y1 };
    const b = { x: x2, y: y2 };
    t.is(v.cross(a, b), n);
  });
  t.end();
});

test('vector#rotate', t => {
  const a = { x: 1, y: 0 };
  t.same(roundVector(v.rotate(a, Math.PI)), { x: -1, y: 0 });
  t.is(a.x, 1);
  t.is(a.y, 0);

  [
    [[1, 0], Math.PI, [-1, 0]],
    [[0, 1], Math.PI, [0, -1]],
    [[1, 1], Math.PI, [-1, -1]],
    [[1, 0], Math.PI / 2, [0, 1]],
    [[0, 1], Math.PI / -2, [1, 0]],
  ].forEach(([[x1, y1], f, [x2, y2]]) => {
    const a = { x: x1, y: y1 };
    const b = { x: x2, y: y2 };
    t.same(roundVector(v.rotate(a, f)), roundVector(b));
  });
  t.end();
});

test('vector#scale', t => {
  const a = { x: 1, y: 0 };
  t.same(v.scale(a, 10), { x: 10, y: 0 });
  t.is(a.x, 1);
  t.is(a.y, 0);

  [
    [[1, 1], 0, [0, 0]],
    [[1, 1], 10, [10, 10]],
    [[-1, 1], -1, [1, -1]],
  ].forEach(([[x1, y1], f, [x2, y2]]) => {
    const a = { x: x1, y: y1 };
    const b = { x: x2, y: y2 };
    t.same(roundVector(v.scale(a, f)), roundVector(b));
  });
  t.end();
});
