import test from 'tape';
import * as v from '../src/shared/util/vector';

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
  t.deepEquals(v.add(a, b), { x: 2, y: 2 });

  // does not mutates arguments
  t.equals(a.x, 1);
  t.equals(a.y, 0);
  t.equals(b.x, 1);
  t.equals(b.y, 2);

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
    t.deepEquals(v.add(a, b), c);
  });

  t.end();
});

test('vector#sub', t => {
  const a = { x: 1, y: 0 };
  const b = { x: 1, y: 2 };

  // returns result
  t.deepEquals(v.sub(a, b), { x: 0, y: -2 });

  // does not mutates arguments
  t.equals(a.x, 1);
  t.equals(a.y, 0);
  t.equals(b.x, 1);
  t.equals(b.y, 2);

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
    t.deepEquals(v.sub(a, b), c);
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
    t.deepEquals(roundVector(v.unit(n)), roundVector({x, y}));
  });
  t.end();
});

test('vector#cross', t => {
  const a = { x: 1, y: 0 };
  const b = { x: 0, y: 1 };
  t.equals(v.cross(a, b), 1);
  t.equals(a.x, 1);
  t.equals(a.y, 0);
  t.equals(b.x, 0);
  t.equals(b.y, 1);

  [
    [[1, 0], [0, 1], 1],
    [[0, 1], [1, 0], -1],
    [[1, 0], [1, 0], 0],
    [[1, 0], [-1, 0], 0],
  ].forEach(([[x1, y1], [x2, y2], n]) => {
    const a = { x: x1, y: y1 };
    const b = { x: x2, y: y2 };
    t.equals(v.cross(a, b), n);
  });
  t.end();
});

test('vector#rotate', t => {
  const a = { x: 1, y: 0 };
  t.deepEquals(roundVector(v.rotate(a, Math.PI)), { x: -1, y: 0 });
  t.equals(a.x, 1);
  t.equals(a.y, 0);

  [
    [[1, 0], Math.PI, [-1, 0]],
    [[0, 1], Math.PI, [0, -1]],
    [[1, 1], Math.PI, [-1, -1]],
    [[1, 0], Math.PI / 2, [0, 1]],
    [[0, 1], Math.PI / -2, [1, 0]],
  ].forEach(([[x1, y1], f, [x2, y2]]) => {
    const a = { x: x1, y: y1 };
    const b = { x: x2, y: y2 };
    t.deepEquals(roundVector(v.rotate(a, f)), roundVector(b));
  });
  t.end();
});

test('vector#scale', t => {
  const a = { x: 1, y: 0 };
  t.deepEquals(v.scale(a, 10), { x: 10, y: 0 });
  t.equals(a.x, 1);
  t.equals(a.y, 0);

  [
    [[1, 1], 0, [0, 0]],
    [[1, 1], 10, [10, 10]],
    [[-1, 1], -1, [1, -1]],
  ].forEach(([[x1, y1], f, [x2, y2]]) => {
    const a = { x: x1, y: y1 };
    const b = { x: x2, y: y2 };
    t.deepEquals(roundVector(v.scale(a, f)), roundVector(b));
  });
  t.end();
});

test('vector#length', t => {
  const a = { x: 1, y: 0 }
  t.equals(v.length(a), 1);
  t.equals(a.x, 1);
  t.equals(a.y, 0);
  [
    [[1, 0], 1],
    [[0, 1], 1],
    [[4, 3], 5],
  ].forEach(([[x, y], l]) => {
    t.equals(v.length({x, y}), l);
  });
  t.end();
});

test('vector#distance', t => {
  const a = { x: 1, y: 0 };
  const b = { x: 2, y: 0 };
  t.equals(v.distance(a, b), 1);
  t.equals(a.x, 1);
  t.equals(b.x, 2);
  t.equals(a.y, 0);
  t.equals(b.y, 0);

  [
    [[1, 0], [2, 0], 1],
    [[2, 0,], [1, 0], 1],
    [[0, 1], [0, 2], 1],
    [[0, 2], [0, 1], 1],
    [[1, 1], [4, 5], 5],
  ].forEach(([[x1, y1], [x2, y2], d]) => {
    const a = { x: x1, y: y1 };
    const b = { x: x2, y: y2 };
    t.equals(v.distance(a, b), d);
  });
  t.end();
});
