const getNear = (y: number, x: number) => {
  return [
    [y + 1, x],
    [y - 1, x],
    [y, x - 1],
    [y, x + 1],
  ];
};

// good enough
const cycleWrap = (max: number, val: number) => {
  if (val >= 0 && val <= max) return val;

  if (val < 0) {
    while (val < 0) {
      val += max + 1;
    }

    return val;
  }

  return val % (max + 1);
};

console.log(cycleWrap(100, 0) === 0);
console.log(cycleWrap(100, 100) === 100);
console.log(cycleWrap(100, 50) === 50);

console.log(cycleWrap(100, 101) === 0);
console.log(cycleWrap(100, 200) === 99);

console.log(cycleWrap(100, -1) === 100);
console.log(cycleWrap(100, -100) === 1);

const main = (input: string) => {
  const s1 = input.split('\n').map((v) => v.split(''));

  const start = [0, 0];

  for (let y = 0; y < s1.length; y++) {
    for (let x = 0; x < s1[0].length; x++) {
      if (s1[y][x] === 'S') {
        start[0] = y;
        start[1] = x;
      }
    }
  }

  const inputParsed = {
    map: s1,
    start,
  };

  type IF = (v: typeof inputParsed) => any;

  const first: IF = ({ map, start }) => {
    let current = new Set<string>();
    current.add(start.join('_'));

    for (let i = 0; i < 64; i++) {
      const points = [...current].map((v) =>
        v.split('_').map((v) => Number(v))
      );

      const newPoints = new Set<string>();

      points.forEach((p) => {
        const near = getNear(p[0], p[1]).filter((pp) => {
          const val = map[pp[0]]?.[pp[1]];
          return val === '.' || val === 'S';
        });
        near.forEach((p) => newPoints.add(p.join('_')));
      });

      current = newPoints;
    }

    return current.size;
  };

  const second: IF = ({ map, start }) => {
    const TOTAL = 26501365;
    const vals: number[] = [];

    let last = 0;

    let current = new Set<string>();
    current.add(start.join('_'));

    const maxY = map.length - 1;
    const maxX = map[0].length - 1;

    for (let i = 0; i < 10000; i++) {
      const points = [...current].map((v) =>
        v.split('_').map((v) => Number(v))
      );

      const newPoints = new Set<string>();

      points.forEach((p) => {
        const near = getNear(p[0], p[1]).filter((pp) => {
          const val = map[cycleWrap(maxY, pp[0])]?.[cycleWrap(maxX, pp[1])];
          return val === '.' || val === 'S';
        });
        near.forEach((p) => newPoints.add(p.join('_')));
      });

      current = newPoints;

      if ((i + 1) % map.length === TOTAL % map.length) {
        vals.push(current.size);
        last = current.size;
      }

      if (vals.length === 3) {
        break;
      }
    }

    // Stole solution from reddit
    const [a0, a1, a2] = vals;

    const b0 = a0;
    const b1 = a1 - a0;
    const b2 = a2 - a1;
    const n = Math.round(TOTAL / map.length);

    return b0 + b1 * n + Math.round((n * (n - 1)) / 2) * (b2 - b1);
  };

  console.time('first');
  const f = first(inputParsed);
  console.timeEnd('first');
  console.log(f);

  console.time('second');
  const s = second(inputParsed);
  console.timeEnd('second');
  console.log(s);
};

export default main;
