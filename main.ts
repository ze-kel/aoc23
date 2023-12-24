import fs from 'node:fs';

const w = process.argv[2];

const isCustomFile = process.argv[3];

if (!w) {
  console.log('\n\n');
  console.log('Use npm run main %week%. Like "npm run main 01"');
  console.log('\n\n');
}

async function main() {
  try {
    const file = fs.readFileSync(
      `./${w}/${isCustomFile ? isCustomFile : 'input'}.txt`
    );
    const text = file.toString();

    const runner = await import(`./${w}/index.ts`);
    await runner.default(text);
  } catch (err) {
    console.log(err);
  }
}

main();
