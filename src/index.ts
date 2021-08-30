require('dotenv').config();

import clear from 'clear';
import { program } from 'commander';
import figlet from 'figlet';
import { magenta } from 'kleur';
import PrettyError from 'pretty-error';

const pe = new PrettyError();

async function main() {
  try {
    clear();

    console.log(magenta(figlet.textSync('snipe', { horizontalLayout: 'full' })));

    program.version('0.0.1').description('Monitor a url for changes').parse(process.argv);

    // if (!process.argv.slice(2).length) {
    //   program.outputHelp();

    //   return;
    // }

    console.log('HI');
  } catch (e) {
    console.error(pe.render(e));
  }
}

main();
