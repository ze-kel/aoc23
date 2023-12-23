const getNear = (y: number, x: number) => {
  return [
    [y + 1, x],
    [y - 1, x],
    [y, x - 1],
    [y, x + 1],
  ];
};

const getPossibleFirst = (
  map: string[][],
  [y, x]: [number, number],
  history: Set<string>
) => {
  const cur = map[y][x];

  let possible;

  if (cur === '>') {
    possible = [[y, x + 1]];
  }
  if (cur === '<') {
    possible = [[y, x - 1]];
  }
  if (cur === '^') {
    return [[y - 1, x]];
  }
  if (cur === 'v') {
    return [[y + 1, x]];
  }

  if (cur === '.') {
    possible = [];

    if (map[y + 1]?.[x] && map[y + 1]?.[x] !== '^') {
      possible.push([y + 1, x]);
    }

    if (map[y - 1]?.[x] && map[y - 1]?.[x] !== 'v') {
      possible.push([y - 1, x]);
    }

    if (map[y]?.[x + 1] && map[y]?.[x + 1] !== '<') {
      possible.push([y, x + 1]);
    }
    if (map[y]?.[x - 1] && map[y]?.[x - 1] !== '>') {
      possible.push([y, x - 1]);
    }
  }

  if (!possible) {
    throw new Error('saa');
  }

  return possible.filter(([y, x]) => {
    return !history.has(`${y}-${x}`) && map[y]?.[x] && map[y]?.[x] !== '#';
  });
};

const main = (input: string) => {
  console.time('preprocess');
  const s1 = input.split('\n').map((v) => v.split(''));

  const inputParsed = {
    map: s1,
  };

  type IF = (v: typeof inputParsed) => any;

  const first: IF = ({ map }) => {
    const finished: Set<string>[] = [];

    // y x steps id
    const queue = [[0, 1, new Set<string>(['0-1'])]];

    while (queue.length) {
      const [y, x, history] = queue.shift() as [number, number, Set<string>];

      history.add(`${y}-${x}`);
      if (y === map.length - 1 && x === map[0].length - 2) {
        finished.push(history);
        continue;
      }

      const [first, ...rest] = getPossibleFirst(map, [y, x], history);

      if (!first) {
        continue;
      }

      queue.push([...first, history]);

      rest.forEach((v) => {
        queue.push([...v, structuredClone(history)]);
      });
    }

    // because we have initial position in set too
    const steps = finished.map((v) => v.size - 1);
    return Math.max(...steps);
  };

  const second: IF = ({ map }) => {
    const keyPlaces: Record<string, Set<string>> = {};

    // find places where we can choose direction
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[0].length; x++) {
        const possible = getNear(y, x).filter(
          ([y, x]) => map[y]?.[x] && map[y]?.[x] !== '#'
        );

        if (possible.length > 2) {
          keyPlaces[`${y}-${x}`] = new Set();
        }
      }
    }

    const endString = `${map.length - 1}-${map[0].length - 2}`;
    keyPlaces['0-1'] = new Set();
    keyPlaces[endString] = new Set();

    Object.keys(keyPlaces).forEach((place) => {
      const [y, x] = place.split('-').map(Number);

      const queue = [[y, x, new Set<string>([`${y}-${x}`])]];

      while (queue.length) {
        const [y, x, history] = queue.shift() as [number, number, Set<string>];

        history.add(`${y}-${x}`);
        if (`${y}-${x}` in keyPlaces && `${y}-${x}` !== place) {
          keyPlaces[place].add(`${y}-${x}-${history.size}`);
          continue;
        }

        const [first, ...rest] = getNear(y, x).filter(([y, x]) => {
          return (
            !history.has(`${y}-${x}`) && map[y]?.[x] && map[y]?.[x] !== '#'
          );
        });

        if (!first) {
          continue;
        }

        queue.push([...first, history]);

        rest.forEach((v) => {
          queue.push([...v, structuredClone(history)]);
        });
      }
    });

    console.log(keyPlaces);

    // y x steps id
    const queue = [[0, 1, 0, new Set<string>(['0-1'])]];
    const finished: number[] = [];

    while (queue.length) {
      const [y, x, steps, history] = queue.shift() as [
        number,
        number,
        number,
        Set<string>
      ];

      history.add(`${y}-${x}`);
      if (y === map.length - 1 && x === map[0].length - 2) {
        finished.push(steps);
        console.log('f', queue.length);
        continue;
      }

      const [first, ...rest] = [...keyPlaces[`${y}-${x}`]]
        .map((v) => v.split('-').map(Number))
        .filter(([y, x]) => !history.has(`${y}-${x}`));

      if (!first) {
        continue;
      }

      const [nY, nX, nS] = first;
      queue.push([nY, nX, steps + nS - 1, history]);

      rest.forEach((v) => {
        const [nY, nX, nS] = v;
        queue.push([nY, nX, steps + nS - 1, structuredClone(history)]);
      });
    }

    // because we have initial position in set too
    return Math.max(...finished);
  };

  console.timeEnd('preprocess');

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

// 2314 too high

/*

    finished.forEach((set) => {
      console.log('\n\n');
      console.log('steps', set.size);
      for (let y = 0; y < map.length; y++) {
        let line: string[] = [];
        for (let x = 0; x < map[0].length; x++) {
          line.push(set.has(`${y}-${x}`) ? 'O' : map[y][x]);
        }
        console.log(line.join(''));
      }
    });
    */
