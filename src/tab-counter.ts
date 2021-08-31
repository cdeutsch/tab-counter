import '@jxa/global-type';
import { run } from '@jxa/run';
import os from 'os';

export interface BrowserTabCounts {
  who: string;
  browser: string;
  tabCount: number;
  windowCount: number;
  tabCounts: number[];
  sampleTime: number;
}

export async function countTabs(browserName: string, sampleTime: number): Promise<BrowserTabCounts> {
  const who = process.env.WHO || os.hostname();

  return await run(
    (browserName: string, who: string, sampleTime: number) => {
      const App = Application(`/Applications/${browserName}.app`);

      if (App.running()) {
        let tabCounts: number[] = [];

        for (let ii in App.windows) {
          tabCounts.push(App.windows[ii].tabs.length);
        }

        tabCounts.sort((a, b) => b - a);

        const tabCount = tabCounts.reduce((accum, count) => {
          return accum + count;
        }, 0);

        const browserTabCounts: BrowserTabCounts = {
          browser: browserName,
          tabCount: tabCount,
          windowCount: tabCounts.length,
          tabCounts: tabCounts,
          sampleTime: sampleTime,
          who: who,
        };

        console.log('▶▶▶', JSON.stringify(browserTabCounts));

        return browserTabCounts;
      }
    },
    browserName,
    who,
    sampleTime
  );
}
