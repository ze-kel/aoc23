export const getNumbersFromString = (i: string): number[] => {
  const arr = i.match(/-?(\d+)/gm)?.map((v) => Number(v));
  if (!arr) return [];
  return arr;
};
