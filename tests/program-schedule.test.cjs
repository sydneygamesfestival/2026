const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { test } = require('node:test');
const { runInNewContext } = require('node:vm');

const script = readFileSync(resolve(__dirname, '../assets/js/program-schedule.js'), 'utf8');

async function loadSchedule(rows) {
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
    window: { location: { search: '' } },
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
      'data-day="' + scenario.key + '" aria-pressed="true"'));
    assert.ok(elements.get('#schedule-day-select').innerHTML.includes(
      'value="' + scenario.key + '" selected'));
    assert.ok(elements.get('#schedule-cards').innerHTML.includes(scenario.event));
  });
}
