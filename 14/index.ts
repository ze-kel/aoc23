import { cloneDeep } from 'lodash-es';

const calculateLoad = (map) => {
  let counter = 0;
  for (let y = 0; y < map.length; y++) {
    const distance = map.length - y;

    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === 'O') {
        counter += distance;
      }
    }
  }

  return counter;
};

const roll = (map: string[][], direction: 'top' | 'bot' | 'left' | 'right') => {
  let moved = false;
  let first = true;

  while (moved || first) {
    first = false;
    moved = false;

    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[0].length; x++) {
        if (direction === 'top') {
          if (map[y]?.[x] === 'O') {
            if (map[y - 1]?.[x] === '.') {
              map[y][x] = '.';
              map[y - 1][x] = 'O';
              moved = true;
            }
          }
        }

        if (direction === 'bot') {
          if (map[y]?.[x] === 'O') {
            if (map[y + 1]?.[x] === '.') {
              map[y][x] = '.';
              map[y + 1][x] = 'O';
              moved = true;
            }
          }
        }

        if (direction === 'left') {
          if (map[y]?.[x] === 'O') {
            if (map[y]?.[x - 1] === '.') {
              map[y][x] = '.';
              map[y][x - 1] = 'O';
              moved = true;
            }
          }
        }

        if (direction === 'right') {
          if (map[y]?.[x] === 'O') {
            if (map[y]?.[x + 1] === '.') {
              map[y][x] = '.';
              map[y][x + 1] = 'O';
              moved = true;
            }
          }
        }
      }
    }
  }

  return map;
};

const cycle = (map: string[][]) => {
  roll(map, 'top');
  roll(map, 'left');
  roll(map, 'bot');
  roll(map, 'right');

  return map;
};

const main = (input: string) => {
  const s1 = input.split('\n').map((v) => v.split(''));

  const inputParsed = {
    map: s1,
  };

  type IF = (v: typeof inputParsed) => any;

  const first: IF = ({ map }) => {
    const clonedMap = cloneDeep(map);
    const rolled = roll(clonedMap, 'top');

    return calculateLoad(rolled);
  };

  const second: IF = ({ map }) => {
    const clonedMap = cloneDeep(map);
    const cycleResults: string[] = [];
    let loopCycle, loopStarts;
    let correctExps = 0;

    for (let i = 0; i < 1000; i++) {
      const rolled = cycle(clonedMap);

      const stringified = rolled.map((v) => v.join('')).join('_');

      if (loopCycle) {
        const remainder = (i - loopStarts) % loopCycle;

        if (cycleResults[remainder + loopStarts] === stringified) {
          console.log('good', correctExps);
          correctExps++;
        } else {
          throw new Error('Loop detection error');
        }

        if (correctExps > loopCycle) {
          break;
        }
      }

      if (!loopCycle) {
        const alreadythere = cycleResults.indexOf(stringified);

        if (alreadythere > 0) {
          console.log('i', i, 'matches', alreadythere);
          loopCycle = i - alreadythere;
          loopStarts = alreadythere;
        }
      }

      cycleResults[i] = stringified;
    }

    const remainder = (1000000000 - loopStarts - 1) % loopCycle;

    const final = cycleResults[remainder + loopStarts];

    const finalMap = final.split('_').map((v) => v.split(''));

    return calculateLoad(finalMap);
  };

  const f = first(inputParsed);
  console.log(f);

  const s = second(inputParsed);
  console.log(s);
};

export default main;
