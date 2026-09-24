const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { test } = require('node:test');
const { runInNewContext } = require('node:vm');

const script = readFileSync(resolve(__dirname, '../assets/js/program-schedule.js'), 'utf8');
const programPage = readFileSync(resolve(__dirname, '../program.md'), 'utf8');

test('overview days and featured events link to detailed program dates', () => {
  for (let day = 12; day <= 18; day += 1) {
    const iso = '2026-10-' + day;
    assert.ok(programPage.includes(
      'class="program-week-day-link" href="#program-' + iso + '"'
    ));
    assert.ok(programPage.includes(
      'class="program-week-mobile-day" href="#program-' + iso + '"'
    ));

    if (day > 12) {
      assert.match(
        programPage,
        new RegExp('class="program-week-event[^\"]*" href="#program-' + iso +
          '" data-schedule-date="' + iso + '"')
      );
    }
  }
});

async function loadSchedule(rows, hash = '') {
  const elements = new Map();
  const schedule = {
    dataset: { eventsUrl: '/events.csv', notifyUrl: '/mailing-list/' },
    querySelector(selector) {
      if (!elements.has(selector)) {
        elements.set(selector, {
          addEventListener() {},
          querySelectorAll() { return []; },
        });
      }
      return elements.get(selector);
    },
  };
  const errors = [];
  runInNewContext(script, {
    document: {
      querySelector() { return schedule; },
      querySelectorAll() { return []; },
    },
    window: { location: { search: '', hash }, addEventListener() {} },
    URLSearchParams,
    console: { error(...args) { errors.push(args); } },
    fetch: async () => ({
      ok: true,
      text: async () => ['Event Name,Specific Date,Published', ...rows].join('\n'),
    }),
  });
  await new Promise(setImmediate);
  assert.deepEqual(errors, []);
  return elements;
}

test('opens a directly linked festival day', async () => {
  const elements = await loadSchedule(
    ['Festival event,2026-10-13,Y', 'Wednesday event,2026-10-14,Y'],
    '#program-2026-10-14'
  );
  assert.equal(elements.get('#schedule-day-title').textContent, 'Wednesday 14 October');
  assert.ok(elements.get('#schedule-days').innerHTML.includes(
    'href="#program-2026-10-14" data-day="2026-10-14" aria-current="date"'));
  assert.ok(elements.get('#schedule-cards').innerHTML.includes('Wednesday event'));
});

const cases = [
  {
    name: 'opens pre-festival events before festival-week events',
    rows: ['Festival event,2026-10-13,Y', 'Early event,2026-10-10,Y'],
    key: 'before', title: 'Before the festival', event: 'Early event',
  },
  {
    name: 'skips unpublished pre-festival events',
    rows: ['Early event,2026-10-10,N', 'Festival event,2026-10-13,Y'],
    key: '2026-10-13', title: 'Tuesday 13 October', event: 'Festival event',
  },
  {
    name: 'opens post-festival events when those are the only events',
    rows: ['Late event,2026-10-20,Y'],
    key: 'after', title: 'After the festival', event: 'Late event',
  },
  {
    name: 'falls back to the first festival day for an empty schedule',
    rows: [], key: '2026-10-12', title: 'Monday 12 October',
    event: 'No events have been announced',
  },
];

for (const scenario of cases) {
  test(scenario.name, async () => {
    const elements = await loadSchedule(scenario.rows);
    assert.equal(elements.get('#schedule-day-title').textContent, scenario.title);
    assert.ok(elements.get('#schedule-days').innerHTML.includes(
      'href="#program-' + scenario.key + '" data-day="' + scenario.key + '" aria-current="date"'));
    assert.ok(elements.get('#schedule-day-select').innerHTML.includes(
      'value="' + scenario.key + '" selected'));
    assert.ok(elements.get('#schedule-cards').innerHTML.includes(scenario.event));
  });
}
