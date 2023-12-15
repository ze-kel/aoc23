import { add } from 'lodash-es';

const hash = (input: string) => {
  let currentValue = 0;

  for (let i = 0; i < input.length; i++) {
    const ASCII = input.charCodeAt(i);
    currentValue += ASCII;
    currentValue = currentValue * 17;
    currentValue = currentValue % 256;
  }

  return currentValue;
};

const main = (input: string) => {
  const s1 = input
    .replace(/\n/g, ',')
    .split(',')
    .filter((v) => v);

  const inputParsed = {
    all: s1,
  };

  type IF = (v: typeof inputParsed) => any;

  const first: IF = ({ all }) => {
    const hashes = all.map(hash);

    return hashes.reduce(add);
  };

  const second: IF = ({ all }) => {
    type Lens = { id: string; focal: number };

    const boxes: Lens[][] = [];

    for (const sequence of all) {
      if (sequence.includes('-')) {
        const lens = sequence.replace('-', '');

        const h = hash(lens);

        if (boxes[h]) {
          const index = boxes[h].findIndex((v) => v.id === lens);

          if (index !== -1) {
            boxes[h].splice(index, 1);
          }
        }
      } else {
        const spl = sequence.split('=');

        const lens = spl[0];

        const h = hash(lens);
        const n = Number(spl[1]);

        if (boxes[h]) {
          const index = boxes[h].findIndex((v) => v.id === lens);

          if (index !== -1) {
            boxes[h][index].focal = n;
          } else {
            boxes[h].push({ id: lens, focal: n });
          }
        } else {
          boxes[h] = [{ id: lens, focal: n }];
        }
      }
    }

    const powers = boxes.map((b, i) => {
      if (!b.length) return 0;

      return b.map((v, iL) => (i + 1) * (iL + 1) * v.focal).reduce(add);
    });

    return powers.reduce(add);
  };

  const f = first(inputParsed);
  console.log(f);

  const s = second(inputParsed);
  console.log(s);
};

export default main;
