import Heap from 'heap-js';

type ICoords = {
  x: number;
  y: number;
  consecCounter: number;
  cAxis: 'x' | 'y';
  cDir: number;
  cost: number;
  path?: string;
};

const hash = (c: ICoords) => {
  return `${c.x}-${c.y}-${c.cAxis}-${c.cDir}-${c.consecCounter}`;
};

const getFastest1 = (map: number[][]) => {
  const fastestMap: number[][] = [[0]];
  const visit = new Set();

  let checks = 0;

  const queue = new Heap<ICoords>((a, b) => a.cost - b.cost);

  queue.push({ x: 0, y: 0, consecCounter: 0, cAxis: 'y', cDir: 1, cost: 0 });

  while (queue.size()) {
    const c = queue.pop();

    if (!c) {
      throw new Error('aaa');
    }

    const h = hash(c);

    if (visit.has(h)) {
      continue;
    }

    checks++;

    visit.add(h);

    const turns: ICoords[] =
      c.cAxis === 'x'
        ? [
            {
              x: c.x,
              y: c.y + 1,
              cAxis: 'y',
              cDir: 1,
              consecCounter: 1,
              cost: c.cost,
            },
            {
              x: c.x,
              y: c.y - 1,
              cAxis: 'y',
              cDir: -1,
              consecCounter: 1,
              cost: c.cost,
            },
          ]
        : [
            {
              x: c.x + 1,
              y: c.y,
              cAxis: 'x',
              cDir: 1,
              consecCounter: 1,
              cost: c.cost,
            },
            {
              x: c.x - 1,
              y: c.y,
              cAxis: 'x',
              cDir: -1,
              consecCounter: 1,
              cost: c.cost,
            },
          ];

    const total = [...turns];

    for (let i = c.consecCounter + 1; i <= 3; i++) {
      const n: ICoords = {
        ...c,
        consecCounter: i,
      };
      n[c.cAxis] += c.cDir;
      total.push(n);
    }

    const f = total.filter((v) => typeof map[v.y]?.[v.x] === 'number');

    f.forEach((v) => {
      const cost = map[v.y][v.x];

      v.cost = v.cost + cost;

      const current = fastestMap[v.y]?.[v.x];

      if (typeof current !== 'number' || current > v.cost) {
        if (!fastestMap[v.y]) {
          fastestMap[v.y] = [];
        }
        fastestMap[v.y][v.x] = v.cost;
      }
    });

    queue.push(...f);
  }

  const fastestToEnd = fastestMap[map.length - 1]?.[map[0].length - 1];

  return { fastestMap };
};

const getDirections = (c: ICoords) => {
  const total: ICoords[] = [];
  if (c.consecCounter < 10) {
    const n: ICoords = {
      ...c,
    };
    n.consecCounter++;
    n[c.cAxis] += c.cDir;
    total.push(n);
  }

  if (c.consecCounter >= 4 || c.consecCounter === 0) {
    if (c.cAxis === 'x') {
      total.push(
        {
          x: c.x,
          y: c.y + 1,
          cAxis: 'y',
          cDir: 1,
          consecCounter: 1,
          cost: c.cost,
          path: c.path,
        },
        {
          x: c.x,
          y: c.y - 1,
          cAxis: 'y',
          cDir: -1,
          consecCounter: 1,
          cost: c.cost,
          path: c.path,
        }
      );
    }

    if (c.cAxis === 'y') {
      total.push(
        {
          x: c.x + 1,
          y: c.y,
          cAxis: 'x',
          cDir: 1,
          consecCounter: 1,
          cost: c.cost,
          path: c.path,
        },
        {
          x: c.x - 1,
          y: c.y,
          cAxis: 'x',
          cDir: -1,
          consecCounter: 1,
          cost: c.cost,
          path: c.path,
        }
      );
    }
  }

  return total;
};

const getFastest2 = (map: number[][]) => {
  const fastestMap: number[][] = [[0]];
  const fastestMapPath: string[][] = [];
  const visited = new Set();

  let checks = 0;

  const queue = new Heap<ICoords>((a, b) => a.cost - b.cost);

  queue.push({
    x: 0,
    y: 0,
    consecCounter: 0,
    cAxis: 'y',
    cDir: 1,
    cost: 0,
    path: '0-0',
  });

  while (queue.size()) {
    const c = queue.pop();

    if (!c) {
      throw new Error('aaa');
    }

    checks++;

    const currentMin = fastestMap[c.y]?.[c.x];
    if (typeof currentMin !== 'number' || currentMin > c.cost) {
      if (c.y === map.length - 1 && c.x === map[0].length - 1) {
        if (c.consecCounter < 4) {
          continue;
        }
      }

      if (!fastestMap[c.y]) {
        fastestMap[c.y] = [];
      }
      fastestMap[c.y][c.x] = c.cost;

      if (c.path) {
        if (!fastestMapPath[c.y]) {
          fastestMapPath[c.y] = [];
        }
        fastestMapPath[c.y][c.x] = c.path;
      }
    }

    const total: ICoords[] = getDirections(c);

    total.forEach((v) => {
      const c = map[v.y]?.[v.x];

      if (typeof c === 'number') {
        const h = hash(v);
        if (visited.has(h)) {
          return;
        }

        v.cost += c;

        v.path += `|${v.x}-${v.y}`;
        visited.add(h);
        queue.push(v);
      }
    });
  }

  return { fastestMap, fastestMapPath };
};

const main = (input: string) => {
  const s1 = input
    .split('\n')
    .filter((v) => v)
    .map((v) => v.split('').map((v) => Number(v)));

  const inputParsed = {
    map: s1,
  };

  type IF = (v: typeof inputParsed) => any;

  const first: IF = ({ map }) => {
    const { fastestMap } = getFastest1(map);

    return fastestMap[map.length - 1][map[0].length - 1];
  };

  const second: IF = ({ map }) => {
    const { fastestMap, fastestMapPath } = getFastest2(map);

    const last = fastestMapPath[map.length - 1][map[0].length - 1];

    const mod = last.split('|').map((v) => {
      const s = v.split('-');

      return { x: Number(s[0]), y: Number(s[1]) };
    });

    const toPrint: string[][] = [];

    for (let y = 0; y < map.length; y++) {
      toPrint[y] = [];
      for (let x = 0; x < map[0].length; x++) {
        toPrint[y][x] = '.';
      }
    }

    mod.forEach((v) => {
      toPrint[v.y][v.x] = String(map[v.y][v.x]);
    });

    toPrint.forEach((l) => {
      console.log(l.join(''));
    });

    return fastestMap[map.length - 1][map[0].length - 1];
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

// 1213 too low
