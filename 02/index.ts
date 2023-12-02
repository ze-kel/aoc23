const main = (input: string) => {
  const lll = input
    .split('\n')
    .filter((v) => v.length)
    .map((line) => {
      const f = line.split(':');
      const gameId = f[0].split(' ')[1];

      const games = f[1].split(';').map((v) =>
        v.split(', ').map((v) => {
          const s = v.trim().split(' ');
          return { num: Number(s[0]), col: s[1] };
        })
      );

      return { gameId, games };
    });

  const first = (lines: typeof lll) => {
    const max = { red: 12, green: 13, blue: 14 };

    const possbile = lines.filter((gamepack) => {
      for (const g of gamepack.games) {
        for (const subgame of g) {
          if (subgame.num > max[subgame.col]) {
            return false;
          }
        }
      }
      return true;
    });

    return possbile.reduce((a, b) => a + Number(b.gameId), 0);
  };

  const second = (lines: typeof lll) => {
    const maxes = lines.map((v) => {
      const linemax = { red: 0, green: 0, blue: 0 };

      for (const g of v.games) {
        for (const subgame of g) {
          if (subgame.num > linemax[subgame.col]) {
            linemax[subgame.col] = subgame.num;
          }
        }
      }
      return linemax;
    });
    const powers = maxes.map((m) => m.red * m.green * m.blue);

    return powers.reduce((a, b) => a + b);
  };

  const f = first(lll);
  console.log(f);

  const s = second(lll);
  console.log(s);
};

export default main;
