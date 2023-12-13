const isMirror = (
  map: string[],
  indexOfFirstReflected: number,
  type: 'vert' | 'hor'
) => {
  if (type === 'hor') {
    for (
      let x1 = indexOfFirstReflected, x2 = indexOfFirstReflected - 1;
      x2 >= 0 && x1 < map[0].length;
      x1++, x2--
    ) {
      for (let y = 0; y < map.length; y++) {
        if (map[y][x1] !== map[y][x2]) return false;
      }
    }
  } else {
    for (
      let y1 = indexOfFirstReflected, y2 = indexOfFirstReflected - 1;
      y1 < map.length && y2 >= 0;
      y1++, y2--
    ) {
      if (map[y1] !== map[y2]) return false;
    }
  }

  return true;
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
    let counter = 0;
    for (const map of maps) {
      let isFound = false;

      // horizontal match, vertical line
      for (let i = 1; i < map[0].length; i++) {
        const res = isMirror(map, i, 'hor');
        if (res) {
          counter += i;

          if (isFound === true) {
            console.log('double match');
          }

          isFound = true;
        }
      }

      // vertical match, horizontal line
      for (let i = 1; i < map.length; i++) {
        const res = isMirror(map, i, 'vert');
        if (res) {
          counter += i * 100;

          if (isFound === true) {
            console.log('double match');
          }
          isFound = true;
        }
      }

      if (!isFound) {
        console.log('not found', map);
      }
    }
    return counter;
  };
  const second: IF = ({ maps }) => {};

  const f = first(inputParsed);
  console.log(f);

  const s = second(inputParsed);
  console.log(s);
};

export default main;

// 19865 too low
// 236581 too hight
