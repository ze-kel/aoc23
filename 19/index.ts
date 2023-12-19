import { add, cloneDeep, multiply } from 'lodash-es';

type WorkflowMap = Record<string, WorkflowPart[]>;

type Part = { x: number; a: number; m: number; s: number };

type Condition = {
  prop: keyof Part;
  sign: '<' | '>';
  number: number;
};

type WorkflowPart = {
  condition?: Condition;
  result: 'A' | 'R' | string;
};

const subProcess = (flows: WorkflowPart[], data: Part) => {
  for (const flow of flows) {
    if (!flow.condition) return flow.result;

    const compareA = data[flow.condition.prop];
    const compareB = flow.condition.number;

    if (flow.condition.sign === '<') {
      if (compareA < compareB) return flow.result;
    }
    if (flow.condition.sign === '>') {
      if (compareA > compareB) return flow.result;
    }
  }
  throw new Error('end of flows');
};

const process = (map: WorkflowMap, data: Part) => {
  let place = 'in';

  while (place !== 'R' && place !== 'A') {
    place = subProcess(map[place], data);
  }

  return place;
};

type RangeMap = {
  x: [number, number];
  m: [number, number];
  a: [number, number];
  s: [number, number];
};

const type2 = (map: WorkflowMap, place: string, ranges: RangeMap) => {
  if (place === 'A') {
    return Object.values(ranges)
      .map(([a, b]) => b - a + 1)
      .reduce(multiply);
  }

  if (place === 'R') return 0;

  let possibilities = 0;

  const steps = map[place];

  for (const step of steps) {
    const c = step.condition;

    if (!c) {
      possibilities += type2(map, step.result, cloneDeep(ranges));
      continue;
    }

    if (c.sign === '<') {
      const upd = cloneDeep(ranges);
      const edit = upd[c.prop];

      edit[1] = c.number - 1;
      possibilities += type2(map, step.result, upd);

      const edit2 = ranges[c.prop];
      edit2[0] = c.number;
    }

    if (c.sign === '>') {
      const upd = cloneDeep(ranges);
      const edit = upd[c.prop];

      edit[0] = c.number + 1;
      possibilities += type2(map, step.result, upd);

      const edit2 = ranges[c.prop];
      edit2[1] = Math.min(edit2[1], c.number);
    }
  }

  return possibilities;
};

const main = (input: string) => {
  const s1 = input.split('\n\n');

  const workflows: WorkflowMap = {};

  s1[0].split('\n').forEach((line) => {
    const ssss = line.match(/(.*){(.*)}/);
    if (!ssss) throw new Error('ne');

    const name = ssss[1];

    const steps = ssss[2].split(',').map((s) => {
      const s2 = s.split(':');

      if (s2.length === 2) {
        const m = s2[0].match(/(.*)(>|<)(.*)/);

        if (!m) throw new Error('aaa');

        return {
          condition: {
            prop: m[1],
            sign: m[2],
            number: Number(m[3]),
          },
          result: s2[1],
        } as WorkflowPart;
      }

      if (s2.length === 1) {
        return {
          result: s2[0],
        } as WorkflowPart;
      }

      throw new Error('bbb');
    });

    workflows[name] = steps;
  });

  const parts = s1[1].split('\n').map((line) => {
    const m = line.match(/{x=(.*),m=(.*),a=(.*),s=(.*)}/);
    if (!m) throw 'cxccc';
    return {
      x: Number(m[1]),
      m: Number(m[2]),
      a: Number(m[3]),
      s: Number(m[4]),
    };
  });

  const inputParsed = {
    workflows,
    parts,
  };

  type IF = (v: typeof inputParsed) => any;

  const first: IF = ({ workflows, parts }) => {
    const filtered = parts.filter((p) => process(workflows, p) === 'A');

    return filtered.map((v) => Object.values(v).reduce(add)).reduce(add);
  };

  const second: IF = ({ workflows, parts }) => {
    return type2(workflows, 'in', {
      x: [1, 4000],
      m: [1, 4000],
      s: [1, 4000],
      a: [1, 4000],
    });
  };

  console.time('first');
  const f = first(inputParsed);
  console.timeEnd('first');
  console.log(f);

  console.time('second');
  const s = second(inputParsed);
  console.timeEnd('second');
  console.log(s);
};

export default main;

//167409079868000
//167857992690850
