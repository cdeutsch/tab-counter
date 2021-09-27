require('dotenv').config();

import axios from 'axios';
import clear from 'clear';
import { program } from 'commander';
import figlet from 'figlet';
import { magenta, yellow, red } from 'kleur';

import { BrowserTabCounts, countTabs } from './tab-counter';
import { delay, formatDate } from './utils';

const SUPPORTED_BROWSERS = [
  'Brave Browser',
  'Safari',
  'Google Chrome',
  'Google Chrome Canary',
  'Microsoft Edge',
  'Microsoft Edge Beta',
  'Microsoft Edge Dev',
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function myParseInt(value, dummyPrevious) {
  // parseInt takes a string and an optional radix
  return parseInt(value);
}

async function main() {
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

    try {
      // Send to Axiom.
      await axios.post(
        `https://cloud.dev.axiomtestlabs.co/api/v1/datasets/${process.env.AXIOM_DATASET}/ingest`,
        browserTabCounts,
        {
          headers: { Authorization: `Bearer ${process.env.AXIOM_INGEST_TOKEN}` },
        }
      );
    } catch (err) {
      console.warn(yellow('\nFailed to send data to Axiom'), err);
    }
  }

  if (options.schedule) {
    // Do this every X minutes.
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        await run();
      } catch (e) {
        console.error(e);
      }
      console.log('\n⏳️\n');
      await delay(intervalMinutes * 60000); // Convert minutes to milliseconds.
    }
  }

  await run();
}

clear();

if (!process.env.AXIOM_INGEST_TOKEN) {
  console.log(red('AXIOM_INGEST_TOKEN needs to be added to the .env configuration.'));

  process.exit();
}
if (!process.env.AXIOM_DATASET) {
  console.log(red('AXIOM_DATASET needs to be added to the .env configuration.'));

  process.exit();
}

main();
