import { cloneDeep } from 'lodash-es';

type Block = {
  x: [number, number];
  y: [number, number];
  z: [number, number];
};

const isRangesOverlap = (a: [number, number], b: [number, number]) => {
  return Math.max(a[0], b[0]) <= Math.min(a[1], b[1]);
};

const isASuppotingB = (a: Block, b: Block) => {
  if (isRangesOverlap(a.x, b.x) && isRangesOverlap(a.y, b.y)) {
    const aCeiling = Math.max(...a.z);
    const bFloor = Math.min(...b.z);

    return aCeiling + 1 === bFloor;
  }

  return false;
};

const isBlockOverlap = (a: Block, b: Block) => {
  return (
    isRangesOverlap(a.x, b.x) &&
    isRangesOverlap(a.y, b.y) &&
    isRangesOverlap(a.z, b.z)
  );
};

const fallDown = (blocks: Block[]) => {
  let moved = true;

  const movedIndexes = new Set<number>();

  while (moved) {
    moved = false;

    for (let i = 0; i < blocks.length; i++) {
      const a = blocks[i];
      const movedA = cloneDeep(a);

      movedA.z = a.z.map((v) => v - 1) as [number, number];
      if (Math.min(...movedA.z) < 1) continue;

      let canMove = true;
      for (let y = 0; y < blocks.length; y++) {
        if (y === i) {
          continue;
        }

        const b = blocks[y];

        if (isBlockOverlap(movedA, b)) {
          canMove = false;
          break;
        }
      }

      if (canMove) {
        blocks[i] = movedA;
        moved = true;
        movedIndexes.add(i);
      }
    }
  }

  return movedIndexes.size;
};

const main = (input: string) => {
  console.time('preprocess');
  const s1 = input.split('\n').map((v) => {
    const [start, end] = v.split('~').map((v) => v.split(',').map(Number));

    return {
      x: [start[0], end[0]],
      y: [start[1], end[1]],
      z: [start[2], end[2]],
    } as Block;
  });

  fallDown(s1);

  const inputParsed = {
    blocks: s1,
  };

  type IF = (v: typeof inputParsed) => any;

  const first: IF = ({ blocks }) => {
    const supports: Set<number>[] = [];
    const supportedBy: Set<number>[] = [];

    for (let i = 0; i < blocks.length; i++) {
      const a = blocks[i];

      for (let y = 0; y < blocks.length; y++) {
        const b = blocks[y];

        if (isASuppotingB(a, b)) {
          if (!supports[i]) {
            supports[i] = new Set();
          }

          if (!supportedBy[y]) {
            supportedBy[y] = new Set();
          }

          supports[i].add(y);
          supportedBy[y].add(i);
        }
      }
    }

    const canDis: number[] = [];

    for (let i = 0; i < blocks.length; i++) {
      // if block doesnt support any it can be disintegrated
      if (!supports[i]) {
        canDis.push(i);
        continue;
      }

      // wheter any of supported are unique
      const wouldFall = [...supports[i]].map((sI) => {
        return supportedBy[sI].size === 1;
      });

      if (!wouldFall.some((v) => v)) {
        canDis.push(i);
      }
    }

    return canDis.length;
  };

  const second: IF = ({ blocks }) => {
    let counter = 0;

    for (let i = 0; i < blocks.length; i++) {
      const copy = cloneDeep(blocks);
      copy.splice(i, 1);

      const fallen = fallDown(copy);
      console.log('WORKING ON P2:', i, '/', blocks.length);

      counter += fallen;
    }

    return counter;
  };

  console.timeEnd('preprocess');

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
