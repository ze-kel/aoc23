import { inRange } from 'lodash-es';
import { getNumbersFromString } from '../utils';

import { init } from 'z3-solver';

// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
// Determine the intersection point of two line segments
// Return FALSE if the lines don't intersect
function intersect2(x1, y1, x2, y2, x3, y3, x4, y4) {
  // Check if none of the lines are of length 0
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    //  dont need this check
    //  return false;
  }

  const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

  // Lines are parallel
  if (denominator === 0) {
    return false;
  }

  let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
  let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

  // is the intersection along the segments
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    // dont need this check
    // return false;
  }

  // Return a object with the x and y coordinates of the intersection
  let x = x1 + ua * (x2 - x1);
  let y = y1 + ua * (y2 - y1);

  return { x, y };
}

const getPointAtT = (
  point: { point: number[]; speed: number[] },
  t: number,
  z?: boolean
) => {
  const p = [
    point.point[0] + point.speed[0] * t,
    point.point[1] + point.speed[1] * t,
  ];

  if (z) {
    p.push(point.point[2] + point.speed[2] * t);
  }
  return p;
};

const main = async (input: string) => {
  console.time('preprocess');

  const inputs = input.split('\n');

  const s1 = input.split('\n').map((v) => {
    const [coords, speed] = v.split('@');

    return {
      point: getNumbersFromString(coords),
      speed: getNumbersFromString(speed),
    };
  });

  const inputParsed = {
    points: s1,
  };

  type IF = (v: typeof inputParsed) => any;

  const first: IF = ({ points }) => {
    const intersections = new Set<string>();

    //const rangeStart = 7;
    //const rangeEnd = 27;
    const rangeStart = 200000000000000;
    const rangeEnd = 400000000000000;

    let checked = 0;

    for (let a = 0; a < points.length; a++) {
      const [x1, y1] = getPointAtT(points[a], 0);
      const [x2, y2] = getPointAtT(points[a], 1);

      for (let b = a + 1; b < points.length; b++) {
        if (b === a) continue;
        checked++;
        const [x3, y3] = getPointAtT(points[b], 0);
        const [x4, y4] = getPointAtT(points[b], 1);

        const inter = intersect2(x1, y1, x2, y2, x3, y3, x4, y4);

        if (inter) {
          const { x, y } = inter;

          if (
            x > x1 == x2 - x1 > 0 &&
            y > y1 == y2 - y1 > 0 &&
            x > x3 == x4 - x3 > 0 &&
            y > y3 == y4 - y3 > 0 &&
            inRange(x, rangeStart, rangeEnd) &&
            inRange(y, rangeStart, rangeEnd)
          ) {
            intersections.add(`${a}-${b}`);
          }
        }
      }
    }

    return intersections.size;
  };

  const second: IF = async ({ points }) => {
    // looked up solution on reddit.
    const {
      Context, // High-level Z3Py-like API
    } = await init();

    const { Solver, Int, And, BitVec, Eq, GE, Real } = Context('main');

    const s = new Solver();

    const bv = (s: string) => Real.const(s);

    const x = bv('x');
    const y = bv('y');
    const z = bv('z');

    const vx = bv('vx');
    const vy = bv('vy');
    const vz = bv('vz');

    for (let i = 0; i < points.length; i++) {
      const t = bv(`t_{${i}}`);

      const p = points[i];

      s.add(GE(t, 0));
      s.add(Eq(x.add(vx.mul(t)), t.mul(p.speed[0]).add(p.point[0])));
      s.add(Eq(y.add(vy.mul(t)), t.mul(p.speed[1]).add(p.point[1])));
      s.add(Eq(z.add(vz.mul(t)), t.mul(p.speed[2]).add(p.point[2])));
    }

    const res = await s.check();
    console.log('res', res);

    const m = s.model();

    const xRes = m.eval(x);
    const yRes = m.eval(y);
    const zRes = m.eval(z);

    console.log('x', xRes.sexpr(), 'y', yRes.sexpr(), 'z', zRes.sexpr());

    return Number(xRes.sexpr()) + Number(yRes.sexpr()) + Number(zRes.sexpr());
  };

  console.timeEnd('preprocess');

  console.time('first');
  const f = first(inputParsed);
  console.timeEnd('first');
  console.log(f);

  console.time('second');

  const s = await second(inputParsed);
  console.timeEnd('second');
  console.log(s);
};

export default main;
