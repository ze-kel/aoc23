import fs from 'node:fs';

const w = process.argv[2];

const isMini = process.argv.includes('mini');

if (!w) {
  console.log('\n\n');
  console.log('Use npm run main %week%. Like "npm run main 01"');
  console.log('\n\n');
}

async function main() {
  try {
    const file = fs.readFileSync(`./${w}/${isMini ? 'mini' : 'input'}.txt`);
    const text = file.toString();

    const runner = await import(`./${w}/index.ts`);
    runner.default(text);
  } catch (err) {
    console.log(err);
  }
}

main();
