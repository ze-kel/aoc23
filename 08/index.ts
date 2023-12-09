const main = (input: string) => {
  const s1 = input.split('\n\n');

  const inputParsed = {
    moves: s1[0].split(''),
    map: Object.fromEntries(
      s1[1].split('\n').map((v) => {
        const sp = v.split(' = ');

        const sp1 = sp[1].replace('(', '').replace(')', '').split(', ');

        return [sp[0], { L: sp1[0], R: sp1[1] }];
      })
    ),
  };

  type IF = (v: typeof inputParsed) => any;

  const first: IF = (inp) => {
    let pointer = 0;
    let place = 'AAA';
    let counter = 0;

    while (true) {
      const move = inp.moves[pointer];

      place = inp.map[place][move];

      pointer++;
      if (pointer > inp.moves.length - 1) {
        pointer = 0;
      }
      counter++;

      if (place === 'ZZZ') {
        break;
      }
    }

    return counter;
  };
  const second: IF = (inp) => {
    const places = Object.keys(inp.map).filter((v) => v.endsWith('A'));

    const solver = (place: string) => {
      let pointer = 0;
      let counter = 0;

      while (true) {
        const move = inp.moves[pointer];

        place = inp.map[place][move];

        pointer++;
        if (pointer > inp.moves.length - 1) {
          pointer = 0;
        }
        counter++;

        if (place.endsWith('Z')) {
          break;
        }
      }
      return counter;
    };

    const timesToZ = places.map(solver);

    const gcd = (a, b) => (a ? gcd(b % a, a) : b);

    const lcm = (a, b) => (a * b) / gcd(a, b);

    return timesToZ.reduce(lcm);
  };

  const f = first(inputParsed);
  console.log(f);

  const s = second(inputParsed);
  console.log(s);
};

export default main;
