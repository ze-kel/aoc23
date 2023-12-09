import { add } from 'lodash-es';
import { getNumbersFromString } from '../utils';

const getDifference = (line: number[]) => {
  const res = [];

  for (let i = 1; i < line.length; i++) {
    res.push(line[i] - line[i - 1]);
  }
  return res;
};

const getDifferences = (line: number[]) => {
  const diffs = [line, getDifference(line)];

  while (diffs[diffs.length - 1].some((v) => v !== 0)) {
    diffs.push(getDifference(diffs[diffs.length - 1]));
  }

  return diffs;
};
const main = (input: string) => {
  const s1 = input.split('\n');

  const inputParsed = {
    lines: s1.map(getNumbersFromString),
  };

  type IF = (v: typeof inputParsed) => any;

  const first: IF = (inp) => {
    const allDifs = inp.lines.map(getDifferences);

    const extrapolated = allDifs.map((diffs) => {
      diffs.reverse();

      const extrapolated = [];

      for (let i = 1; i < diffs.length; i++) {
        const bottom = extrapolated.length ? extrapolated : [0];
        const current = diffs[i];

        const one = bottom[bottom.length - 1];
        const two = current[current.length - 1];

        extrapolated.push(one + two);
      }

      return extrapolated[extrapolated.length - 1];
    });

    return extrapolated.reduce(add);
  };
  const second: IF = (inp) => {
    const allDifs = inp.lines.map(getDifferences);

    const extrapolated = allDifs.map((diffs) => {
      diffs.reverse();

      const extrapolated = [];

      for (let i = 1; i < diffs.length; i++) {
        const bottom = extrapolated.length ? extrapolated : [0];
        const current = diffs[i];

        const one = bottom[bottom.length - 1];
        const two = current[0];

        extrapolated.push(two - one);
      }

      return extrapolated[extrapolated.length - 1];
    });

    return extrapolated.reduce(add);
  };

  const f = first(inputParsed);
  console.log(f);

  const s = second(inputParsed);
  console.log(s);
};

export default main;
