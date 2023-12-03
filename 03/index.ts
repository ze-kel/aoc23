type ICoord = { x: number; y: number };

const getAdjacentCoods = ({ x, y }: { x: number; y: number }) => {
  return [
    { x: x - 1, y: y - 1 },
    { x: x, y: y - 1 },
    { x: x + 1, y: y - 1 },

    { x: x - 1, y: y },
    { x: x + 1, y: y },

    { x: x - 1, y: y + 1 },
    { x: x, y: y + 1 },
    { x: x + 1, y: y + 1 },
  ];
};

const main = (input: string) => {
  const lll = input.split('\n').filter((v) => v.length);

  const nRegex = /\d+/gm;

  const first = (lines: typeof lll) => {
    const adj: string[] = [];

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      const matches = line.matchAll(nRegex);
      for (const match of matches) {
        const matchCoords = match[0].split('').map((_, i) => {
          if (typeof match.index !== 'number') {
            throw new Error('noind');
          }
          return { x: match.index + i, y: lineIndex };
        });

        const adjacent = matchCoords.reduce((a: ICoord[], b) => {
          return [...a, ...getAdjacentCoods(b)];
        }, []);

        for (const c of adjacent) {
          const target = lines[c.y]?.[c.x];

          if (
            target !== undefined &&
            Number.isNaN(Number(target)) &&
            target !== '.'
          ) {
            adj.push(match[0]);
            break;
          }
        }
      }
    }
    return adj.reduce((a, b) => Number(a) + Number(b), 0);
  };
  const second = (lines: typeof lll) => {
    const gears: Record<string, string[]> = {};

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      const matches = line.matchAll(nRegex);
      for (const match of matches) {
        const matchCoords = match[0].split('').map((_, i) => {
          if (typeof match.index !== 'number') {
            throw new Error('noind');
          }
          return { x: match.index + i, y: lineIndex };
        });

        const adjacent = matchCoords.reduce((a: ICoord[], b) => {
          return [...a, ...getAdjacentCoods(b)];
        }, []);

        const gearsNearby: Set<string> = new Set();

        for (const c of adjacent) {
          const target = lines[c.y]?.[c.x];

          if (target === '*') {
            gearsNearby.add(`${c.y}-${c.x}`);
          }
        }

        for (const v of gearsNearby) {
          if (!gears[v]) {
            gears[v] = [match[0]];
          } else {
            gears[v].push(match[0]);
          }
        }
      }
    }

    const gearsArr = Object.values(gears).filter((v) => v.length === 2);

    return gearsArr
      .map((v) => Number(v[0]) * Number(v[1]))
      .reduce((a, b) => Number(a) + Number(b), 0);
  };
  const f = first(lll);
  console.log(f);

  const s = second(lll);
  console.log(s);
};

export default main;
