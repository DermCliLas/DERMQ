import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { runInThisContext } from 'node:vm';
const require = createRequire(import.meta.url);
const ts = require('typescript');
const source = readFileSync(new URL('../src/lib/booking-date.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const exports = {};
runInThisContext(`(function(exports) { ${compiled}\n})`)(exports);
const { getNextBookingDays, dateInLima } = exports;

test('keeps the displayed date and selected date aligned after 7 PM in Lima', () => {
  const days = getNextBookingDays(2, new Date('2026-11-19T03:57:00Z'));
  assert.deepEqual(days[0], { date: '2026-11-19', label: '19 Nov', dayName: 'Jue' });
  assert.equal(dateInLima('2026-11-19T14:00:00Z'), days[0].date);
});

test('handles month/year rollover and Sundays using Lima dates', () => {
  const days = getNextBookingDays(5, new Date('2027-01-01T02:00:00Z'));
  assert.deepEqual(days.map(day => day.date), ['2027-01-01', '2027-01-02', '2027-01-04', '2027-01-05']);
  assert.equal(dateInLima('2027-01-01T02:00:00Z'), '2026-12-31');
  assert.equal(dateInLima('invalid'), null);
});
