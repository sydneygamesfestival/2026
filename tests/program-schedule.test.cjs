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

    assert.match(
      programPage,
      new RegExp('class="program-week-event[^\"]*" href="#program-' + iso +
        '" data-schedule-date="' + iso + '"')
    );
  }
});

async function loadSchedule(rows, hash = '', headers = 'Event Name,Specific Date,Published') {
  const elements = new Map();
  const overviewCounts = [];
  for (let day = 12; day <= 18; day += 1) {
    for (let copy = 0; copy < 2; copy += 1) {
      overviewCounts.push({
        dataset: { scheduleCount: '2026-10-' + day },
        hidden: true,
        textContent: '',
      });
    }
  }
  const schedule = {
    dataset: { eventsUrl: '/events.csv', notifyUrl: '/mailing-list/' },
    querySelector(selector) {
      if (!elements.has(selector)) {
        elements.set(selector, {
          listeners: {},
          addEventListener(type, listener) { this.listeners[type] = listener; },
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
      querySelectorAll(selector) {
        return selector === '[data-schedule-count]' ? overviewCounts : [];
      },
    },
    window: { location: { search: '', hash }, addEventListener() {} },
    URLSearchParams,
    console: { error(...args) { errors.push(args); } },
    fetch: async () => ({
      ok: true,
      text: async () => [headers, ...rows].join('\n'),
    }),
  });
  await new Promise(setImmediate);
  assert.deepEqual(errors, []);
  elements.overviewCounts = overviewCounts;
  return elements;
}

test('game medium and audience filters work together', async () => {
  const elements = await loadSchedule([
    'Digital public,2026-10-12,Y,Screen (Digital),General Public',
    'Digital student,2026-10-12,Y,Screen (Digital),Students',
    'Tabletop student,2026-10-12,Y,Tabletop & Live Play (Non-Digital),Students',
    'Hybrid public,2026-10-12,Y,Hybrid,General Public',
    'Hybrid student,2026-10-12,Y,Hybrid,Students',
    'All student,2026-10-12,Y,All,Students',
    'Other public,2026-10-12,Y,Other,General Public',
  ], '', 'Event Name,Specific Date,Published,Medium of Games,Type of Audience');
  const cards = () => elements.get('#schedule-cards').innerHTML;
  const click = (selector, attribute, value) => {
    elements.get(selector).listeners.click({
      target: { closest: () => ({ dataset: { [attribute]: value } }) },
    });
  };

  assert.ok(elements.get('#schedule-medium-filters').innerHTML.includes('Screen (Digital)'));
  assert.ok(elements.get('#schedule-medium-filters').innerHTML.includes('Tabletop (Non-Digital)'));
  assert.ok(!elements.get('#schedule-medium-filters').innerHTML.includes('Tabletop & Live Play'));
  assert.ok(!elements.get('#schedule-medium-filters').innerHTML.includes('Multiple Kinds'));
  assert.ok(!elements.get('#schedule-medium-filters').innerHTML.includes('Other'));
  assert.ok(cards().includes('Tabletop student'));
  assert.ok(cards().includes('Tabletop &amp; Live Play (Non-Digital)'));
  assert.ok(cards().includes('Hybrid public'));
  assert.ok(cards().includes('<strong>All</strong>'));
  click('#schedule-medium-filters', 'gameMedium', 'digital');
  assert.ok(cards().includes('Digital public'));
  assert.ok(cards().includes('Digital student'));
  assert.ok(!cards().includes('Tabletop student'));
  assert.ok(cards().includes('Hybrid public'));
  assert.ok(cards().includes('Hybrid student'));
  assert.ok(cards().includes('All student'));
  assert.ok(!cards().includes('Other public'));

  click('#schedule-filters', 'audience', 'learners');
  assert.ok(!cards().includes('Digital public'));
  assert.ok(cards().includes('Digital student'));
  assert.ok(cards().includes('Hybrid student'));
  assert.ok(cards().includes('All student'));
  click('#schedule-medium-filters', 'gameMedium', 'tabletop');
  assert.ok(cards().includes('Digital student'));
  assert.ok(cards().includes('Tabletop student'));
  click('#schedule-medium-filters', 'gameMedium', 'digital');
  assert.ok(!cards().includes('Digital student'));
  assert.ok(cards().includes('Tabletop student'));
  assert.ok(cards().includes('Hybrid student'));
  assert.ok(cards().includes('All student'));
  click('#schedule-medium-filters', 'gameMedium', '');
  assert.ok(cards().includes('Digital student'));
  assert.ok(cards().includes('Tabletop student'));
  assert.ok(!cards().includes('Hybrid public'));
});

test('mixed legacy game types appear under both medium filters', async () => {
  const elements = await loadSchedule(
    ['Fallback hybrid,2026-10-12,Y,"PC video games, Board Games"'],
    '',
    'Event Name,Specific Date,Published,Type of Games'
  );
  const cards = () => elements.get('#schedule-cards').innerHTML;
  const filter = elements.get('#schedule-medium-filters');
  assert.ok(cards().includes('<strong>All</strong>'));
  for (const medium of ['digital', 'tabletop']) {
    filter.listeners.click({
      target: { closest: () => ({ dataset: { gameMedium: medium } }) },
    });
    assert.ok(cards().includes('Fallback hybrid'));
  }
});

test('shows each day’s published event count in the overview', async () => {
  const elements = await loadSchedule([
    'Monday event,2026-10-12,Y',
    'Tuesday morning,2026-10-13,Y',
    'Tuesday evening,2026-10-13,Y',
    'Hidden Wednesday event,2026-10-14,N',
  ]);
  const countFor = (iso) => elements.overviewCounts
    .filter((element) => element.dataset.scheduleCount === iso)
    .map((element) => element.textContent);

  assert.deepEqual(countFor('2026-10-12'), ['1 event', '1 event']);
  assert.deepEqual(countFor('2026-10-13'), ['2 events', '2 events']);
  assert.deepEqual(countFor('2026-10-14'), ['0 events', '0 events']);
  assert.ok(elements.overviewCounts.every((element) => element.hidden === false));
  assert.ok(elements.get('#schedule-days').innerHTML.includes(
    '12 Oct <span class="schedule-day-count">(1)</span>'));
  assert.ok(elements.get('#schedule-days').innerHTML.includes(
    '13 Oct <span class="schedule-day-count">(2)</span>'));
  assert.ok(elements.get('#schedule-day-select').innerHTML.includes(
    '13 Oct — Tue (2)'));
});

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
