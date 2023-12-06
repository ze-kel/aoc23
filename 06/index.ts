import { multiply } from 'lodash-es';
import { getNumbersFromString } from '../utils';

const main = (input: string) => {
  const s1 = input.split('\n');

  const inputParsed = {
    times: getNumbersFromString(s1[0]),
    distances: getNumbersFromString(s1[1]),
  };

  console.log(inputParsed);

  type IF = (v: typeof inputParsed) => any;

  const first: IF = (inp) => {
    const races = inp.times.map((time, i) => ({
      time,
      distance: inp.distances[i],
    }));

    const max = races.map((race) => {
      console.log(race);

      let counter = 0;

      for (let i = 0; i <= race.time; i++) {
        const timeLeft = race.time - i;
        const speed = i;
        if (timeLeft * speed > race.distance) {
          counter++;
        }
      }

      return counter;
    });

    return max.reduce(multiply);
  };
  const second: IF = (inp) => {
    const race = {
      time: Number(inp.times.join('')),
      distance: Number(inp.distances.join('')),
    };

    const isWinningAt = (time) => {
      const timeLeft = race.time - time;
      const speed = time;
      return timeLeft * speed > race.distance;
    };

    let fromOvershoot;
    let from;
    let toOvershoot;
    let to;

    let pointer = 0;

    const STEP = 100000;

    while (!fromOvershoot) {
      if (isWinningAt(pointer)) {
        fromOvershoot = pointer;
      } else {
        pointer += STEP;
      }
    }

    while (!from) {
      if (isWinningAt(pointer) && !isWinningAt(pointer - 1)) {
        from = pointer;
      } else {
        pointer--;
      }
    }

    while (!toOvershoot) {
      if (!isWinningAt(pointer)) {
        toOvershoot = pointer;
      } else {
        pointer += STEP;
      }
    }

    while (!to) {
      if (!isWinningAt(pointer) && isWinningAt(pointer - 1)) {
        to = pointer;
      } else {
        pointer--;
      }
    }

    return to - from;
  };

  const f = first(inputParsed);
  console.log(f);

  const s = second(inputParsed);
  console.log(s);
};

export default main;
