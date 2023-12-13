import { add } from 'lodash-es';

const isMirror = (
  map: string[],
  indexOfFirstReflected: number,
  type: 'vert' | 'hor'
) => {
  let errorCounter = 0;

  if (type === 'hor') {
    for (
      let x1 = indexOfFirstReflected, x2 = indexOfFirstReflected - 1;
      x2 >= 0 && x1 < map[0].length;
      x1++, x2--
    ) {
      for (let y = 0; y < map.length; y++) {
        if (map[y][x1] !== map[y][x2]) {
          errorCounter++;
        }
      }
    }
  } else {
    for (
      let y1 = indexOfFirstReflected, y2 = indexOfFirstReflected - 1;
      y1 < map.length && y2 >= 0;
      y1++, y2--
    ) {
      for (let x = 0; x < map[0].length; x++) {
        if (map[y1][x] !== map[y2][x]) {
          errorCounter++;
        }
      }
    }
  }

  return errorCounter;
};

const findReflectionValue = (map: string[], targetErrors = 0) => {
  let result;

  // horizontal match, vertical line
  for (let i = 1; i < map[0].length; i++) {
    const res = isMirror(map, i, 'hor');
    if (res === targetErrors) {
      if (result) {
        console.log('double found');
      }
      result = i;
    }
  }

  // vertical match, horizontal line
  for (let i = 1; i < map.length; i++) {
    const res = isMirror(map, i, 'vert');
    if (res === targetErrors) {
      if (result) {
        console.log('double found');
      }
      result = i * 100;
    }
  }
  return result;
  throw new Error('not found');
};

const main = (input: string) => {
  const s1 = input.split('\n\n').map((v) => {
    return v.split('\n');
  });

  const inputParsed = {
    maps: s1,
  };

  type IF = (v: typeof inputParsed) => any;

  const first: IF = ({ maps }) => {
    const values = maps.map((v) => findReflectionValue(v, 0));
    return values.reduce(add);
  };

  const second: IF = ({ maps }) => {
    const values = maps.map((v) => findReflectionValue(v, 1));
    return values.reduce(add);
  };

  const f = first(inputParsed);
  console.log(f);

  const s = second(inputParsed);
  console.log(s);
};

export default main;
