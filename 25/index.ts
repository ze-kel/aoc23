import 'regenerator-runtime/runtime';
import { mincut } from '@graph-algorithm/minimum-cut';
// runtime is required for mincut to work

const main = async (input: string) => {
  console.time('preprocess');

  const s1 = input.split('\n');

  const edges: string[][] = [];

  s1.forEach((line) => {
    const [from, ...to] = line.replace(':', '').split(' ');

    for (const tt of to) {
      edges.push([from, tt]);
    }
  });

  const inputParsed = {
    edges,
  };

  type IF = (v: typeof inputParsed) => any;

  const first: IF = ({ edges }) => {
    const mc = mincut(edges);

    const cuts = [...mc];
    const cutsStrings = cuts.map((v) => v.join('-'));

    const cuttted = edges.filter((v) => {
      if (cutsStrings.includes(v.join('-'))) return false;
      if (cutsStrings.includes([...v].reverse().join('-'))) return false;
      return true;
    });

    const gr1 = new Set();
    const gr2 = new Set();

    gr1.add(cuts[0][0]);
    gr2.add(cuts[0][1]);

    let cont = true;

    while (cont) {
      const totalBefore = gr1.size + gr2.size;

      for (const [a, b] of cuttted) {
        if (gr1.has(a) || gr1.has(b)) {
          gr1.add(a);
          gr1.add(b);
        }

        if (gr2.has(a) || gr2.has(b)) {
          gr2.add(a);
          gr2.add(b);
        }
      }

      if (gr1.size + gr2.size === totalBefore) {
        cont = false;
      }
    }
    return gr1.size * gr2.size;
  };

  console.timeEnd('preprocess');

  console.time('first');
  const f = first(inputParsed);
  console.timeEnd('first');
  console.log(f);
};

export default main;
