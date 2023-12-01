import { writeFile, writeFileSync } from 'fs';

const first = (lines: string[]) => {
  const all = lines.map((line) => {
    const onlyDigits = line.replace(/\D/g, '');

    return Number(onlyDigits[0] + onlyDigits[onlyDigits.length - 1]);
  });

  return all.reduce((a, b) => a + b);
};

const replaceMap = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

const second = (lines: string[]) => {
  const all = lines.map((line) => {
    const reg = /\d|one|two|three|four|five|six|seven|eight|nine/g;
    const matches: string[] = [];
    while (true) {
      const found = reg.exec(line);
      if (!found || !found[0]) {
        break;
      }
      matches.push(found[0]);

      reg.lastIndex = found.index + 1;
    }
    const f = matches[0];
    const l = matches[matches.length - 1];
    return Number(
      `${isNaN(Number(f)) ? replaceMap[f] : f}${
        isNaN(Number(l)) ? replaceMap[l] : l
      }`
    );
  });

  writeFileSync('./temp.txt', all.map((v) => v + '\n').join(''));

  return all.reduce((a, b) => a + b);
};

const main = (input: string) => {
  const lines = input.split('\n').filter((v) => v.length);

  const f = first(lines);
  console.log(f);

  const s = second(lines);
  console.log(s);
};

export default main;
