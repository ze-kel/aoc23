type ICoords = { x: number; y: number };

const getAdjacent = (letter: string, { x, y }: ICoords) => {
  if (letter === '|')
    return [
      { x, y: y + 1 },
      { x, y: y - 1 },
    ];
  if (letter === '-')
    return [
      { x: x - 1, y },
      { x: x + 1, y },
    ];
  if (letter === 'L')
    return [
      { x, y: y - 1 },
      { x: x + 1, y },
    ];
  if (letter === 'J')
    return [
      { x, y: y - 1 },
      { x: x - 1, y },
    ];
  if (letter === '7') return [{ x: x - 1, y }, , { x, y: y + 1 }];
  if (letter === 'F')
    return [
      { x: x + 1, y },
      { x, y: y + 1 },
    ];
  return null;
};

const getValueByCoords = (map: string[][], coords: ICoords) => {
  if (map[coords.y]) {
    return map[coords.y][coords.x];
  }
  return;
};

const findStart = (map: string[][]) => {
  let sX;
  let sY;

  for (let y = 0; y < map.length; y++) {
    const t = map[y].indexOf('S');

    if (t !== -1) {
      sY = y;
      sX = t;
      break;
    }
  }

  const adjacent: ICoords[] = [
    { x: sX, y: sY + 1 },
    { x: sX, y: sY - 1 },
    { x: sX + 1, y: sY },
    { x: sX - 1, y: sY },
  ].filter((v) => {
    //@ts-ignore
    const aaj = getAdjacent(getValueByCoords(map, v), v);
    if (!aaj) return false;

    //@ts-ignore
    return aaj.some(({ x, y }) => x === sX && y === sY);
  });

  const start = { x: sX, y: sY };

  const possible = ['|', '-', 'L', 'J', '7', 'F'];

  const adjSimple = adjacent.map((v) => `${v.x}-${v.y}`);
  const letter = possible.find((v) => {
    //@ts-ignore
    const shouldBe = getAdjacent(v, start).map((v) => `${v.x}-${v.y}`);

    return shouldBe.every((v) => adjSimple.includes(v));
  });

  return {
    start,
    adjacent,
    letter,
  };
};

const setMap = (map: string[][], { x, y }: ICoords, val: string) => {
  if (!map[y]) {
    map[y] = [];
  }
  map[y][x] = val;
};

const main = (input: string) => {
  const s1 = input.split('\n');

  const inputParsed = {
    map: s1.map((v) => v.split('')),
  };

  type IF = (v: typeof inputParsed) => any;

  let commonVisited: string[][] = [];

  const first: IF = ({ map }) => {
    const start = findStart(map);

    const visited: string[][] = [];

    setMap(visited, start.start, '0');

    const toCheck: ICoords[] = [...start.adjacent];

    toCheck.forEach((v) => {
      setMap(visited, v, '1');
    });

    while (toCheck.length) {
      const current = toCheck.shift();
      //@ts-ignore
      const currentVal = getValueByCoords(map, current);
      //@ts-ignore
      const currentVisited = Number(getValueByCoords(visited, current));

      //@ts-ignore
      const adj = getAdjacent(currentVal, current).filter((v) => {
        //@ts-ignore
        const isVisited = getValueByCoords(visited, v);
        return typeof isVisited === 'string' ? false : true;
      });

      adj.forEach((v) => {
        //@ts-ignore
        setMap(visited, v, String(currentVisited + 1));
        //@ts-ignore
        toCheck.push(v);
      });
    }

    let max = 0;

    visited.forEach((v) => {
      for (let i = 0; i < v.length; i++) {
        if (v[i]) {
          const n = Number(v[i]);

          if (n > max) {
            max = n;
          }
        }
      }
    });

    commonVisited = visited;

    return max;
  };
  const second: IF = ({ map }) => {
    const start = findStart(map);
    //@ts-ignore
    setMap(map, start.start, start.letter);

    let inside = 0;

    for (let y = 0; y < map.length; y++) {
      let intersectCount = 0;

      for (let x = 0; x < map[y].length; x++) {
        const base = getValueByCoords(map, { x, y });
        const vasVisited = getValueByCoords(commonVisited, { x, y });

        if (vasVisited) {
          //@ts-ignore
          if (['|', 'L', 'J'].includes(base)) {
            intersectCount++;
          }
        } else {
          if (intersectCount % 2 !== 0) {
            inside++;
          }
        }
      }
    }

    return inside;
  };

  const f = first(inputParsed);
  console.log(f);

  const s = second(inputParsed);
  console.log(s);
};

export default main;

//319 too low
