type DIR = 'L' | 'R' | 'U' | 'D';

class CustomMap {
  storage: Record<number, Record<number, string>>;
  edges: number[];

  constructor() {
    this.storage = {};
    this.edges = [];
  }

  set(x: number, y: number, val: string, edge?: boolean) {
    if (!(x in this.storage)) {
      this.storage[x] = {};
    }

    this.storage[x][y] = val;

    if (edge) {
      this.edges.push(x, y);
    }
  }

  getRanges() {
    const xK = Object.keys(this.storage).map((v) => Number(v));

    const yK: number[] = [];

    xK.forEach((k) => {
      yK.push(...Object.keys(this.storage[k]).map((v) => Number(v)));
    });

    const minX = Math.min(...xK);
    const maxX = Math.max(...xK);
    const minY = Math.min(...yK);
    const maxY = Math.max(...yK);
    return { minX, minY, maxX, maxY };
  }

  draw() {
    const r = this.getRanges();
    for (let y = r.minY; y <= r.maxY; y++) {
      const l: string[] = [];
      for (let x = r.minX; x <= r.maxX; x++) {
        const d = this.storage[x]?.[y];
        l.push(d ? d : '.');
      }
      console.log(l.join(''));
    }
  }

  countPerimeter() {
    let c = 0;

    const r = this.getRanges();
    for (let y = r.minY; y <= r.maxY; y++) {
      for (let x = r.minX; x <= r.maxX; x++) {
        const d = this.storage[x]?.[y];
        if (d === '#') {
          c++;
        }
      }
    }

    return c;
  }

  countSpace() {
    const polygon = this.edges;

    const length = polygon.length;

    console.log('aaa', this.edges);

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
};

const dirs: Record<DIR, [number, number]> = {
  D: [0, 1],
  U: [0, -1],
  L: [-1, 0],
  R: [1, 0],
};

const procesStep = (
  map: CustomMap,
  pointer: { x: number; y: number },
  step: DD
) => {
  const adds = dirs[step.dir];

  for (let i = 1; i <= step.n; i++) {
    const nX = pointer.x + i * adds[0];
    const nY = pointer.y + i * adds[1];
    map.set(nX, nY, '#', i === step.n);

    if (i === step.n) {
      pointer.x = nX;
      pointer.y = nY;
    }
  }
};

const main = (input: string) => {
  const s1 = input
    .split('\n')
    .filter((v) => v)
    .map((v) => {
      const s = v.split(' ');

      return {
        dir: s[0] as DIR,
        n: Number(s[1]),
        hex: s[2].replace('(', '').replace(')', ''),
      };
    });

  const inputParsed = {
    steps: s1,
  };

  type IF = (v: typeof inputParsed) => any;

  const first: IF = ({ steps }) => {
    const mmm = new CustomMap();
    const pointer = { x: 0, y: 0 };
    steps.forEach((s) => procesStep(mmm, pointer, s));
    console.log('p', mmm.countPerimeter());

    return mmm.countSpace();
  };

  const second: IF = ({ steps }) => {};

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
