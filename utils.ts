export const getNumbersFromString = (i: string): number[] => {
  const arr = i.match(/-?(\d+)/gm)?.map((v) => Number(v));
  if (!arr) return [];
  return arr;
};

const gcd = (a, b) => (a ? gcd(b % a, a) : b);

export const lcm = (a, b) => (a * b) / gcd(a, b);

export type ICoord = { x: number; y: number };
export type ICoord3d = { x: number; y: number; z: number };

const getNear = (y: number, x: number) => {
  return [
    [y + 1, x],
    [y - 1, x],
    [y, x - 1],
    [y, x + 1],
  ];
};
