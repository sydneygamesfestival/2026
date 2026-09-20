const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { test } = require('node:test');
const { runInNewContext } = require('node:vm');

const script = readFileSync(resolve(__dirname, '../assets/js/countdown.js'), 'utf8');

function renderCountdown(now) {
  const elements = new Map();
  const timer = {
    attributes: {},
    setAttribute(name, value) { this.attributes[name] = value; },
  };
  const countdown = {
    dataset: {
      countdown: '2026-10-12T00:00:00+11:00',
      countdownEnd: '2026-10-19T00:00:00+11:00',
    },
    classes: new Set(),
    classList: { add(name) { countdown.classes.add(name); } },
    querySelector(selector) {
      if (selector === '[role="timer"]') return timer;
      if (!elements.has(selector)) elements.set(selector, {});
      return elements.get(selector);
    },
  };

  class FakeDate extends Date {
    static now() { return new Date(now).getTime(); }
  }

  runInNewContext(script, {
    document: { querySelector() { return countdown; } },
    window: { setInterval() {} },
    Date: FakeDate,
  });

  return { countdown, elements, timer };
}

test('renders the time remaining until the Sydney festival start', () => {
  const result = renderCountdown('2026-10-10T20:30:15+11:00');
  assert.equal(result.elements.get('[data-countdown-days]').textContent, '01');
  assert.equal(result.elements.get('[data-countdown-hours]').textContent, '03');
  assert.equal(result.elements.get('[data-countdown-minutes]').textContent, '29');
  assert.equal(result.elements.get('[data-countdown-seconds]').textContent, '45');
  assert.match(result.timer.attributes['aria-label'], /1 days, 3 hours, 29 minutes/);
});

test('shows the underway message during festival week', () => {
  const result = renderCountdown('2026-10-15T12:00:00+11:00');
  assert.ok(result.countdown.classes.has('is-complete'));
  assert.equal(
    result.elements.get('[data-countdown-message]').textContent,
    'Sydney Games Festival is underway'
  );
});

test('shows the wrapped message after festival week', () => {
  const result = renderCountdown('2026-10-20T12:00:00+11:00');
  assert.equal(
    result.elements.get('[data-countdown-message]').textContent,
    'Sydney Games Festival 2026 has wrapped'
  );
});
