import { memoize } from 'lodash-es';

const countOnLine = (
  line: string,
  streak: number,
  sequence: number[]
): number => {
  if (!line.length) {
    if (!sequence.length && streak === 0) {
      return 1;
    }

    if (sequence.length == 1 && streak === sequence[0]) {
      return 1;
    }

    return 0;
  }

  if (!sequence.length && streak > 0) {
    return 0;
  }

  if (streak > sequence[0]) {
    return 0;
  }

  const newSeq = sequence.slice(1);
  const newLine = line.slice(1);

  if (line[0] === '.') {
    if (streak > 0) {
      if (streak === sequence[0]) {
        return memoCount(newLine, 0, newSeq);
      }

      return 0;
    }

    return memoCount(newLine, 0, sequence);
  }

  if (line[0] === '#') {
    return memoCount(newLine, streak + 1, sequence);
  }

  if (line[0] === '?') {
    const a = memoCount(line.replace('?', '.'), streak, sequence);
    const b = memoCount(line.replace('?', '#'), streak, sequence);

    return a + b;
  }

  throw new Error('unknown case');
};

const memoCount = memoize(countOnLine, (line, streak, sequence) => {
  return line + '_' + streak + '_' + sequence.join('-');
});

const main = (input: string) => {
  const s1 = input.split('\n').map((v) => {
    const ss = v.split(' ');
    const line = ss[0];
    const sequence = ss[1].split(',').map((n) => Number(n));
    return {
      line,
      sequence,
      line2: line + '?' + line + '?' + line + '?' + line + '?' + line,
      sequence2: [
        ...sequence,
        ...sequence,
        ...sequence,
        ...sequence,
        ...sequence,
      ],
    };
  });

  const inputParsed = {
    lines: s1,
  };

  type IF = (v: typeof inputParsed) => any;

  const first: IF = ({ lines }) => {
    let cnt = 0;

    for (const l of lines) {
      const possible = memoCount(l.line, 0, l.sequence);
      cnt += possible;
    }

    return cnt;
  };
  const second: IF = ({ lines }) => {
    let cnt = 0;

    for (const l of lines) {
      const possible = memoCount(l.line2, 0, l.sequence2);
      cnt += possible;
    }

    return cnt;
  };

  const f = first(inputParsed);
  console.log(f);

  const s = second(inputParsed);
  console.log(s);
};

export default main;
