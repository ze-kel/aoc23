import { chunk } from 'lodash-es';

const getNumbersFromString = (i: string): number[] => {
  const arr = i.match(/(\d+)/gm)?.map((v) => Number(v));
  if (!arr) return [];
  return arr;
};

const main = (input: string) => {
  const s1 = input.split('\n\n');
  const seeds = getNumbersFromString(s1[0]);
  const blocks = s1.slice(1);

  const ranges = blocks.map((v) => {
    const s = v.split('\n');

    return {
      title: s[0],
      rest: s
        .slice(1)
        .map((v) => {
          const ns = getNumbersFromString(v);
          return { destinationStart: ns[0], sourceStart: ns[1], len: ns[2] };
        })
        .filter((v) => typeof v.destinationStart === 'number'),
    };
  });

  const first = (sed: typeof seeds, blo: typeof ranges) => {
    for (const block of blo) {
      sed = sed.map((from) => {
        for (const r of block.rest) {
          if (from >= r.sourceStart && from <= r.sourceStart + r.len - 1) {
            return from - r.sourceStart + r.destinationStart;
          }
        }
        return from;
      });
    }

    return Math.min(...sed);
  };
  const second = (sed: typeof seeds, blo: typeof ranges) => {
    let pairs = chunk(sed, 2).map((v) => {
      return { start: v[0], len: v[1] };
    });

    for (const block of blo) {
      const tempPairs: typeof pairs = [];

      const sortedRest = block.rest.sort(
        (a, b) => a.sourceStart - b.sourceStart
      );

      for (const pair of pairs) {
        const pairsGenerated: typeof pairs = [];
        let pointer = pair.start;

        const lenLeft = (pointer) => {
          return pair.len - (pointer - pair.start);
        };

        while (pointer <= pair.start + pair.len - 1) {
          let start;
          let len;

          for (const r of sortedRest) {
            const rEnd = r.sourceStart + r.len - 1;

            const rOffset = -r.sourceStart + r.destinationStart;

            // first number of pair is in range
            if (
              pointer >= r.sourceStart &&
              pointer <= rEnd &&
              typeof start !== 'number'
            ) {
              start = pointer + rOffset;

              const numberOfLenghtUnitsNotInPair =
                lenLeft(r.sourceStart) - lenLeft(pointer);

              // range fully covers pair
              if (r.len - numberOfLenghtUnitsNotInPair >= lenLeft(pointer)) {
                len = lenLeft(pointer);
                pointer = Infinity;
              } else {
                // range ends before pair
                len = r.len - numberOfLenghtUnitsNotInPair;
                pointer += r.len - numberOfLenghtUnitsNotInPair;
              }
            }

            // first part out of range then some number are in range
            if (
              pointer + lenLeft(pointer) >= r.sourceStart &&
              pointer <= rEnd &&
              typeof start !== 'number'
            ) {
              pairsGenerated.push({
                start: pointer,
                len: r.sourceStart - pointer,
              });

              start = r.sourceStart + rOffset;
              pointer = r.sourceStart;

              // range fully covers pair
              if (r.len >= lenLeft(pointer)) {
                len = lenLeft(pointer);
                pointer = Infinity;
              } else {
                // range ends before pair
                len = r.len;
                pointer += r.len;
              }
            }
          }
          // no intersections
          if (typeof start !== 'number') {
            start = pointer;
            len = lenLeft(pointer);
            pointer = Infinity;
          }

          pairsGenerated.push({ start, len });
        }

        tempPairs.push(...pairsGenerated);
      }

      pairs = tempPairs;
    }

    return Math.min(...pairs.map((v) => v.start));
  };

  const f = first(seeds, ranges);
  console.log(f);

  const s = second(seeds, ranges);
  console.log(s);
};

export default main;
