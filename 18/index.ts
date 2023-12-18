type DIR = 'L' | 'R' | 'U' | 'D';

class CustomMap {
  storage: Record<number, Record<number, string>>;
  edges: [number, number][];

  constructor() {
    this.storage = {};
    this.edges = [];
  }

  set(x: number, y: number) {
    this.edges.push([x, y]);
  }

  countPerimeter() {
    let c = 0;

    for (let i = 1; i < this.edges.length; i++) {
      const o = this.edges[i - 1];
      const b = this.edges[i];

      c += Math.abs(o[0] - b[0]) + Math.abs(o[1] - b[1]);
    }

    const f = this.edges[0];
    const l = this.edges[this.edges.length - 1];

    c += Math.abs(f[0] - l[0]) + Math.abs(f[1] - l[1]);

    return c;
  }

  countSpace() {
    const polygon = this.edges.reduce((a, b) => [...a, ...b], [] as number[]);

    const length = polygon.length;

    let sum = 0;

    for (let i = 0; i < length; i += 2) {
      sum +=
        polygon[i] * polygon[(i + 3) % length] -
        polygon[i + 1] * polygon[(i + 2) % length];
    }

    return Math.abs(sum) * 0.5 + this.countPerimeter() / 2 + 1;
  }
}

type DD = {
  dir: DIR;
  n: number;
  hex: string;
  n2: number;
  dir2: DIR;
};

const dirs: Record<DIR, [number, number]> = {
  D: [0, 1],
  U: [0, -1],
  L: [-1, 0],
  R: [1, 0],
};

const dirs2: Array<DIR> = ['R', 'D', 'L', 'U'];

const procesStep = (
  map: CustomMap,
  pointer: { x: number; y: number },
  dir: DIR,
  n: number
) => {
  const adds = dirs[dir];
  pointer.x = pointer.x + n * adds[0];
  pointer.y = pointer.y + n * adds[1];
  map.set(pointer.x, pointer.y);
};

const main = (input: string) => {
  const s1 = input
    .split('\n')
    .filter((v) => v)
    .map((v) => {
      const s = v.split(' ');

      const hex = s[2].replace('(', '').replace(')', '');

      const n2 = parseInt(hex.slice(0, -1).replace('#', ''), 16);
      const dir2 = dirs2[hex[hex.length - 1]];

      return {
        dir: s[0] as DIR,
        n: Number(s[1]),
        hex: hex,
        n2,
        dir2: dir2 as DIR,
      };
    });

  const inputParsed = {
    steps: s1,
  };

  type IF = (v: typeof inputParsed) => any;

  const first: IF = ({ steps }) => {
    const mmm = new CustomMap();
    const pointer = { x: 0, y: 0 };
    steps.forEach((s) => procesStep(mmm, pointer, s.dir, s.n));
    console.log('p', mmm.countPerimeter());

    return mmm.countSpace();
  };

  const second: IF = ({ steps }) => {
    const mmm = new CustomMap();
    const pointer = { x: 0, y: 0 };
    steps.forEach((s) => procesStep(mmm, pointer, s.dir2, s.n2));
    return mmm.countSpace();
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

// 36627 too high
