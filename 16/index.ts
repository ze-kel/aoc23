import { add } from 'lodash-es';

type ICoords = { x: number; y: number; axis: 'x' | 'y'; direction: number };

const hash = (c: ICoords) => `${c.x}-${c.y}-${c.axis}-${c.direction}`;

const simulateLight = (map: string[][], start: ICoords) => {
  const marked: boolean[][] = [];
  const currentSpots: ICoords[] = [start];

  const alreadyChecked = new Set();

  while (currentSpots.length) {
    const current = currentSpots.shift();

    if (!current) {
      throw new Error('no current');
    }

    const place = map[current.y]?.[current.x];

    if (!place) {
      continue;
    }

    const currentHash = hash(current);

    if (alreadyChecked.has(currentHash)) {
      continue;
    }

    alreadyChecked.add(currentHash);

    if (!marked[current.y]) {
      marked[current.y] = [];
    }
    marked[current.y][current.x] = true;

    if (place === '.') {
      current[current.axis] += 1 * current.direction;
      currentSpots.push(current);
      continue;
    }

    if (place === '|') {
      if (current.axis === 'y') {
        current[current.axis] += 1 * current.direction;
        currentSpots.push(current);
        continue;
      }

      currentSpots.push(
        {
          x: current.x,
          y: current.y - 1,
          direction: -1,
          axis: 'y',
        },
        {
          x: current.x,
          y: current.y + 1,
          direction: 1,
          axis: 'y',
        }
      );
    }

    if (place === '-') {
      if (current.axis === 'x') {
        current[current.axis] += 1 * current.direction;
        currentSpots.push(current);
        continue;
      }

      currentSpots.push(
        {
          x: current.x - 1,
          y: current.y,
          direction: -1,
          axis: 'x',
        },
        {
          x: current.x + 1,
          y: current.y,
          direction: 1,
          axis: 'x',
        }
      );
    }

    if (place === '/') {
      const switchDir = current.direction * -1;
      if (current.axis === 'x') {
        currentSpots.push({
          x: current.x,
          y: current.y + switchDir,
          direction: switchDir,
          axis: 'y',
        });
      }

      if (current.axis === 'y') {
        currentSpots.push({
          x: current.x + switchDir,
          y: current.y,
          direction: switchDir,
          axis: 'x',
        });
      }
    }

    if (place === '\\') {
      if (current.axis === 'x') {
        currentSpots.push({
          x: current.x,
          y: current.y + current.direction,
          direction: current.direction,
          axis: 'y',
        });
      }

      if (current.axis === 'y') {
        currentSpots.push({
          x: current.x + current.direction,
          y: current.y,
          direction: current.direction,
          axis: 'x',
        });
      }
    }

    continue;
  }

  return marked;
};

const countMarked = (marked: boolean[][]) => {
  return marked.map((v) => v.reduce((a, b) => a + Number(b), 0)).reduce(add);
};

const main = (input: string) => {
  const s1 = input
    .split('\n')
    .filter((v) => v)
    .map((v) => v.split(''));

  const inputParsed = {
    map: s1,
  };

  type IF = (v: typeof inputParsed) => any;

  const first: IF = ({ map }) => {
    const m = simulateLight(map, { x: 0, y: 0, direction: 1, axis: 'x' });

    map.forEach((line, y) => {
      let l = '';
      for (let i = 0; i < line.length; i++) {
        const t = m[y]?.[i];
        l += t ? 'L' : '.';
      }
    });

    return countMarked(m);
  };

  const second: IF = ({ map }) => {
    const positions: ICoords[] = [];

    for (let y = 0; y < map.length; y++) {
      positions.push(
        {
          x: 0,
          y,
          axis: 'x',
          direction: 1,
        },
        {
          x: map[0].length - 1,
          y,
          axis: 'x',
          direction: -1,
        }
      );
    }

    for (let x = 0; x < map[0].length; x++) {
      positions.push(
        {
          x,
          y: 0,
          axis: 'y',
          direction: 1,
        },
        {
          x,
          y: map.length - 1,
          axis: 'y',
          direction: -1,
        }
      );
    }

    const mapped = positions
      .map((pos) => simulateLight(map, pos))
      .map(countMarked);

    return Math.max(...mapped);
  };

  const f = first(inputParsed);
  console.log(f);

  const s = second(inputParsed);
  console.log(s);
};

export default main;

// 904 too low
//8349 too low
