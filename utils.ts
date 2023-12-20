export const getNumbersFromString = (i: string): number[] => {
  const arr = i.match(/-?(\d+)/gm)?.map((v) => Number(v));
  if (!arr) return [];
  return arr;
};

const gcd = (a, b) => (a ? gcd(b % a, a) : b);

export const lcm = (a, b) => (a * b) / gcd(a, b);
