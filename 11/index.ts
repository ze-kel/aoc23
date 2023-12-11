type ICoords = { x: number; y: number };

const generatePoints = (
  map: string[][],
  emptyX: number[],
  emptyY: number[],
  mult = 2
) => {
  let xAdd,
    yAdd = 0;

  const points: ICoords[] = [];

  for (let y = 0; y < map.length; y++) {
    xAdd = 0;
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === '#') {
        points.push({ y: y + yAdd, x: x + xAdd });
      }
      if (emptyX.includes(x)) {
        xAdd += 1 * mult - 1;
      }
    }
    if (emptyY.includes(y)) {
      yAdd += 1 * mult - 1;
    }
  }

  return points;
};

const main = (input: string) => {
  const s1 = input.split('\n').map((v) => v.split(''));

  const emptyY = s1
    .map((line, i) => (line.some((v) => v !== '.') ? null : i))
    .filter((v) => typeof v === 'number') as number[];

  const emptyX = s1[0]
    .map((_, x) => {
      for (let y = 0; y < s1.length; y++) {
        if (s1[y][x] !== '.') {
          return null;
        }
      }
      return x;
    })
    .filter((v) => typeof v === 'number') as number[];

  const inputParsed = {
    points: generatePoints(s1, emptyX, emptyY, 2),
    points2: generatePoints(s1, emptyX, emptyY, 1000000),
  };

  type IF = (v: typeof inputParsed) => any;

  const first: IF = ({ points }) => {
    let sum = 0;

    for (const left of points) {
      for (const right of points) {
        const diffX = Math.abs(left.x - right.x);
        const diffY = Math.abs(left.y - right.y);

        sum += diffX + diffY;
      }
    }

    return sum / 2;
  };
  const second: IF = ({ points2 }) => {
    let sum = 0;

    for (const left of points2) {
      for (const right of points2) {
        const diffX = Math.abs(left.x - right.x);
        const diffY = Math.abs(left.y - right.y);

        sum += diffX + diffY;
      }
    }

    return sum / 2;
  };

  const f = first(inputParsed);
  console.log(f);

  const s = second(inputParsed);
  console.log(s);
};

export default main;
