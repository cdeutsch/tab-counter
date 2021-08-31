// cSpell:ignore xait
require('dotenv').config();

import axios from 'axios';
// import clear from 'clear';
import { program } from 'commander';
import figlet from 'figlet';
import { magenta } from 'kleur';
import PrettyError from 'pretty-error';

import { BrowserTabCounts, countTabs } from './tab-counter';
import { delay, formatDate } from './utils';

const pe = new PrettyError();

const SUPPORTED_BROWSERS = [
  'Brave Browser',
  'Safari',
  'Google Chrome',
  'Google Chrome Canary',
  'Microsoft Edge',
  'Microsoft Edge Beta',
  'Microsoft Edge Dev',
];

function myParseInt(value, dummyPrevious) {
  // parseInt takes a string and an optional radix
  return parseInt(value);
}

async function main() {
  try {
    // clear();

    console.log(magenta(figlet.textSync('Tab Counts', { horizontalLayout: 'full' })));

    program
      .version('1.0.1')
      .description('Send browser tab counts to Axiom')
      .option('-i, --interval <number>', 'Execute snipes every X minutes', myParseInt, 5)
      .option('-S, --schedule', 'Run infinitely using interval to re-run')
      .parse(process.argv);

    // if (!process.argv.slice(2).length) {
    //   program.outputHelp();

    //   return;
    // }

    const options = program.opts();
    const intervalMinutes: number = options.interval;

    async function run() {
      console.log(magenta(formatDate()), 'Counting...\n');

      const browserTabCounts: BrowserTabCounts[] = [];
      const sampleTime = Date.now();

      for (const browser of SUPPORTED_BROWSERS) {
        const tabCounts = await countTabs(browser, sampleTime);
        if (tabCounts) {
          browserTabCounts.push(tabCounts);
        }
      }

      console.log('🚀️', JSON.stringify(browserTabCounts));

      const totalTabs = browserTabCounts.reduce((accum, browserTabCount) => {
        return accum + browserTabCount.tabCount;
      }, 0);

      const totalWindows = browserTabCounts.reduce((accum, browserTabCount) => {
        return accum + browserTabCount.windowCount;
      }, 0);

      console.log(magenta('\nΣ'), 'tabs:', totalTabs, ' windows:', totalWindows);

      // return;

      // Send to Axiom.
      axios.post(
        'https://cloud-dev-axiomtestlabs-co-hjbfhzqlmh1g.curlhub.io/api/v1/datasets/browser-tabs/ingest',
        browserTabCounts,
        {
          headers: { Authorization: `Bearer xait-a657bdad-c3c4-46cf-b783-876e7935649e` },
        }
      );
    }

    if (options.schedule) {
      // Do this every X minutes.
      // tslint:disable-next-line: no-constant-condition
      while (true) {
        await run();
        console.log('\n⏳️\n');
        await delay(intervalMinutes * 60000); // Convert minutes to milliseconds.
      }
    }

    await run();
  } catch (e) {
    console.error(pe.render(e));
  }
}

main();
