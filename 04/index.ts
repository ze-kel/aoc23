const nregex = /(\d+)/gm;

const main = (input: string) => {
  const pre = input.split('\n').filter((v) => v.length);

  const lll = pre.map((l) => {
    const lr = l.split(':')[1].split('|');
    const left = lr[0].match(nregex)?.map((v) => Number(v));
    const right = lr[1].match(nregex)?.map((v) => Number(v));
    if (!left || !right) throw new Error('no lr');
    return { have: left, winning: right };
  });

  const first = (lines: typeof lll) => {
    const counted = lines.map((line) => {
      let matchValue = 0;

      const matchSet = new Set(line.winning);

      for (const n of line.have) {
        if (matchSet.has(n)) {
          if (!matchValue) {
            matchValue = 1;
          } else {
            matchValue = matchValue * 2;
          }
        }
      }

      return matchValue;
    });

    return counted.reduce((a, b) => a + b);
  };
  const second = (lines: typeof lll) => {
    const multipler = {};

    const counted = lines.map((line, lineIndex) => {
      let matches = 0;

      const matchSet = new Set(line.winning);

      for (const n of line.have) {
        if (matchSet.has(n)) {
          matches++;
        }
      }

      const m = multipler[lineIndex] ? multipler[lineIndex] : 1;

      if (matches > 0) {
        for (let i = 1; i < matches + 1; i++) {
          if (multipler[lineIndex + i]) {
            multipler[lineIndex + i] += m;
          } else {
            multipler[lineIndex + i] = m + 1;
          }
        }
      }

      return m;
    });

    return counted.reduce((a, b) => a + b);
  };
  const f = first(lll);
  console.log(f);

  const s = second(lll);
  console.log(s);
};

export default main;
