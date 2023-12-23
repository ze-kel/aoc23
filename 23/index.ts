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
    const keyPlaces: Record<string, Record<string, number>> = {};

    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[0].length; x++) {
        if (!['.', '>', '<', '^', 'v'].includes(map[y]?.[x])) {
          continue;
        }
        const near = getNear(y, x);
        const possible = near.filter(([y, x]) => {
          return ['.', '>', '<', '^', 'v'].includes(map[y]?.[x]);
        });

        if (possible.length > 2) {
          possible.forEach(([y, x]) => {
            console.log(y, x, map[y][x]);
          });

          keyPlaces[`${y}-${x}`] = {};
        }
      }
    }

    const endString = `${map.length - 1}-${map[0].length - 2}`;
    keyPlaces['0-1'] = {};
    keyPlaces[endString] = {};

    for (let y = 0; y < map.length; y++) {
      let line: string[] = [];
      for (let x = 0; x < map[0].length; x++) {
        line.push(`${y}-${x}` in keyPlaces ? 'O' : map[y][x]);
      }
      console.log(line.join(''));
    }

    Object.keys(keyPlaces).forEach((place) => {
      const [y, x] = place.split('-').map(Number);

      const queue = [[y, x, new Set<string>([`${y}-${x}`])]];

      while (queue.length) {
        const [y, x, history] = queue.shift() as [number, number, Set<string>];

        history.add(`${y}-${x}`);
        if (`${y}-${x}` in keyPlaces && `${y}-${x}` !== place) {
          const t = `${y}-${x}`;

          if (!keyPlaces[place][t]) {
            keyPlaces[place][t] = -1;
          }

          if (keyPlaces[place][t] < history.size) {
            keyPlaces[place][t] = history.size;
          }
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

    let max = 0;

    while (queue.length) {
      const [y, x, steps, history] = queue.pop() as [
        number,
        number,
        number,
        Set<string>
      ];

      history.add(`${y}-${x}`);
      if (y === map.length - 1 && x === map[0].length - 2) {
        if (steps > max) {
          max = steps;
          console.log('new max', max);
        }
        continue;
      }

      const [first, ...rest] = [...Object.entries(keyPlaces[`${y}-${x}`])]
        .map(([coords, steps]) => [coords.split('-').map(Number), steps])
        .filter(
          ([coords, steps]) => !history.has(`${coords[0]}-${coords[1]}`)
        ) as [number[], number][];

      if (!first) {
        continue;
      }

      const [coords, nS] = first;
      queue.push([coords[0], coords[1], steps + nS - 1, history]);

      rest.forEach((v) => {
        const [coords, nS] = v;
        queue.push([
          coords[0],
          coords[1],
          steps + nS - 1,
          structuredClone(history),
        ]);
      });
    }

    return max;
  };

  console.timeEnd('preprocess');

  console.time('first');
  const f = first(inputParsed);
  console.timeEnd('first');
  console.log(f);

  console.time('second');

  console.log(
    'checking all cases takes a lot(52s on m2 u), but in my case it finds the right answers really fast'
  );
  const s = second(inputParsed);
  console.timeEnd('second');
  console.log(s);
};

export default main;

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
