const CARDS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

const COMBS = {
  fiveok: 1,
  fourok: 2,
  fullhouse: 3,
  threeok: 4,
  twopair: 5,
  onepair: 6,
  highk: 7,
};

const getCombination = (cards: string) => {
  const counts = {};
  for (const item of cards.split('')) {
    counts[item] = counts[item] ? counts[item] + 1 : 1;
  }
  const values = Object.values(counts);
  if (values.length === 1) {
    return COMBS.fiveok;
  }
  if (values.length === 2) {
    return values.some((v) => v === 2) ? COMBS.fullhouse : COMBS.fourok;
  }
  if (values.length === 3) {
    return values.some((v) => v === 3) ? COMBS.threeok : COMBS.twopair;
  }
  return values.length === 4 ? COMBS.onepair : COMBS.highk;
};

const sortCards = (
  a: string,
  b: string,
  gc: typeof getCombination,
  cards: string[]
) => {
  const combA = gc(a);
  const combB = gc(b);

  if (combA !== combB) {
    return combB - combA;
  }

  const splitA = a.split('');
  const splitB = b.split('');
  for (let i = 0; i < a.split('').length; i++) {
    if (splitA[i] !== splitB[i]) {
      return cards.indexOf(splitB[i]) - cards.indexOf(splitA[i]);
    }
  }

  throw new Error('zerosort');
};

const CARD2 = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'];

const getCombinationJ = (cards: string) => {
  const variants = CARD2.map((v) => cards.replace(/[J]/g, v));
  const values = variants.map(getCombination);

  return Math.min(...values);
};

const main = (input: string) => {
  const s1 = input.split('\n');

  const inputParsed = {
    lines: s1.map((v) => {
      const s = v.split(' ');

      return { cards: s[0], bid: Number(s[1]) };
    }),
  };

  type IF = (v: typeof inputParsed) => any;

  const first: IF = (inp) => {
    const sorted = inp.lines.sort((a, b) =>
      sortCards(a.cards, b.cards, getCombination, CARDS)
    );

    return sorted.reduce((a, b, index) => {
      return a + b.bid * (index + 1);
    }, 0);
  };
  const second: IF = (inp) => {
    const sorted = inp.lines.sort((a, b) =>
      sortCards(a.cards, b.cards, getCombinationJ, CARD2)
    );

    return sorted.reduce((a, b, index) => {
      return a + b.bid * (index + 1);
    }, 0);
  };

  const f = first(inputParsed);
  console.log(f);

  const s = second(inputParsed);
  console.log(s);
};

export default main;
