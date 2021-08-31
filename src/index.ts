require('dotenv').config();

import '@jxa/global-type';
import clear from 'clear';
import { program } from 'commander';
import figlet from 'figlet';
import { magenta } from 'kleur';
import PrettyError from 'pretty-error';
import { run } from '@jxa/run';

const pe = new PrettyError();

async function main() {
  try {
    clear();

    console.log(magenta(figlet.textSync('Tab Counts', { horizontalLayout: 'full' })));

    program.version('0.0.1').description('Send browser tab counts to Axiom').parse(process.argv);

    // if (!process.argv.slice(2).length) {
    //   program.outputHelp();

    //   return;
    // }

    const result = await run(() => {
      const Chrome = Application('/Applications/Google Chrome.app');

      let tabCounts = [];

      if (Chrome.running()) {
        for (let ii in Chrome.windows) {
          tabCounts.push(Chrome.windows[ii].tabs.length);
        }

        tabCounts.sort((a, b) => b - a);
      }

      const tabCount = tabCounts.reduce((accum, count) => {
        return accum + count;
      }, 0);

      const data = {
        tabCount: tabCount,
        windowCount: tabCounts.length,
        tabCounts: tabCounts,
      };

      console.log(JSON.stringify(data));

      return data;
    });

    console.log('HI', JSON.stringify(result));
  } catch (e) {
    console.error(pe.render(e));
  }
}

main();
