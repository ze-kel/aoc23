import { cloneDeep } from 'lodash-es';
import { lcm } from '../utils';

type PType = 'high' | 'low';

type Module = {
  name: string;
  type: 'broadcaster' | 'output' | 'flipflop' | 'conjunction' | 'rx';
  connections: string[];

  ffData: boolean;

  cjData: Record<string, PType>;
};

type QueueItem = {
  type: PType;
  to: string;
  from: string;
};

const processModule = (
  type: PType,
  module: Module,
  from: string
): QueueItem[] => {
  if (module.type === 'output') {
    return [];
  }

  if (module.type === 'broadcaster') {
    return module.connections.map((v) => {
      return { from: module.name, type, to: v };
    });
  }

  if (module.type === 'flipflop') {
    if (type === 'high') {
      return [];
    }

    module.ffData = !module.ffData;

    return module.connections.map((v) => {
      return { from: module.name, type: module.ffData ? 'high' : 'low', to: v };
    });
  }

  if (module.type === 'conjunction') {
    module.cjData[from] = type;

    const toSend = Object.values(module.cjData).some((v) => v === 'low')
      ? 'high'
      : 'low';

    return module.connections.map((v) => {
      return { from: module.name, type: toSend, to: v };
    });
  }

  return [];
};

const main = (input: string) => {
  const s1 = input.split('\n');

  const modules: Record<string, Module> = {};

  modules.output = {
    name: 'output',
    type: 'output',
    connections: [],
    ffData: false,
    cjData: {},
  };

  modules.rx = {
    name: 'rx',
    type: 'rx',
    connections: [],
    ffData: false,
    cjData: {},
  };

  s1.forEach((l) => {
    const ss = l.split(' -> ');
    const a = ss[0];
    const name = a.replace('%', '').replace('&', '');
    const conn = ss[1].trim().split(', ');

    let type;

    if (a.startsWith('%')) {
      type = 'flipflop';
    } else if (a.startsWith('&')) {
      type = 'conjunction';
    } else if (a === 'broadcaster') {
      type = 'broadcaster';
    }

    if (!type) {
      throw new Error('aa');
    }

    modules[name] = {
      name: name,
      type,
      connections: conn,
      ffData: false,
      cjData: {},
    };
  });

  const inverseConnected = {};

  Object.values(modules).forEach((m) => {
    for (const c of m.connections) {
      if (!inverseConnected[c]) {
        inverseConnected[c] = [];
      }
      inverseConnected[c].push(m.name);
    }
  });

  Object.keys(inverseConnected).forEach((key) => {
    if (modules[key]) {
      for (const v of inverseConnected[key]) {
        modules[key].cjData[v] = 'low';
      }
    }
  });

  const inputParsed = {
    modules,
    modules2: cloneDeep(modules),
  };

  type IF = (v: typeof inputParsed) => any;

  const first: IF = ({ modules }) => {
    let low = 0;
    let high = 0;

    const queue: QueueItem[] = [];

    for (let i = 0; i < 1000; i++) {
      queue.push({
        from: 'button',
        type: 'low',
        to: 'broadcaster',
      });

      while (queue.length) {
        const itm = queue.shift();
        if (!itm) {
          throw new Error('bbb');
        }

        if (itm.type === 'low') {
          low++;
        } else {
          high++;
        }

        const res = processModule(itm.type, modules[itm.to], itm.from);

        queue.push(...res);
      }
    }

    return high * low;
  };

  const second: IF = ({ modules2 }) => {
    const queue: QueueItem[] = [];

    // &hb is connected to rx
    // we need hb to send low, so it need to receive "highs" from js, zb, bs and rr
    const targets = { js: null, zb: null, bs: null, rr: null };

    for (let i = 1; i < 10000; i++) {
      queue.push({
        from: 'button',
        type: 'low',
        to: 'broadcaster',
      });

      while (queue.length) {
        const itm = queue.shift();
        if (!itm) {
          throw new Error('bbb');
        }

        if (
          itm.from in targets &&
          targets[itm.from] === null &&
          itm.type === 'high'
        ) {
          targets[itm.from] = i;
        }

        const res = processModule(itm.type, modules2[itm.to], itm.from);

        queue.push(...res);
      }
    }

    console.log(targets);

    // @ts-ignore
    return Object.values(targets).reduce(lcm);
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
