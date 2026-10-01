import { test } from 'node:test';
import assert from 'node:assert/strict';
import { haversineKm, commuteMin, mortgage } from '../lib/commute.ts';
import { LISTINGS, WORKPLACES } from '../lib/listings.ts';

test('distancia conocida: Óvalo Gutiérrez a Plaza San Martín ≈ 6,4 km en línea recta', () => {
  const d = haversineKm([-12.1093, -77.0372], [-12.0517, -77.0347]);
  assert.ok(d > 6 && d < 7, String(d));
});

test('el mismo punto tarda solo el tiempo de acceso', () => {
  assert.equal(commuteMin([-12.1, -77.03], [-12.1, -77.03], 'punta'), 6);
});

test('en hora punta siempre se tarda más que en hora valle', () => {
  for (const l of LISTINGS) for (const w of WORKPLACES) {
    assert.ok(commuteMin(l.pos, w.pos, 'punta') >= commuteMin(l.pos, w.pos, 'valle'));
  }
});

test('un depa en San Isidro queda más cerca del centro financiero que uno en Chorrillos', () => {
  const cf = WORKPLACES.find((w) => w.id === 'san-isidro')!;
  const si = LISTINGS.find((l) => l.district === 'San Isidro')!;
  const ch = LISTINGS.find((l) => l.district === 'Chorrillos')!;
  assert.ok(commuteMin(si.pos, cf.pos) < commuteMin(ch.pos, cf.pos));
});

test('hipoteca: sin tasa es una división simple y con tasa paga más', () => {
  assert.equal(mortgage(240000, 0, 20, 0), 1000);
  assert.ok(mortgage(240000, 0, 20, 8) > 1000);
  assert.ok(mortgage(200000, 20, 20, 8.5) > 1350 && mortgage(200000, 20, 20, 8.5) < 1400, String(mortgage(200000, 20, 20, 8.5)));
});
