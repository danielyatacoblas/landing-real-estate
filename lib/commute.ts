// Estimación de viaje en Lima: distancia en línea recta corregida por la trama de calles y una velocidad
// media según la hora. No reemplaza a un navegador en tiempo real; sirve para comparar zonas.
export type LatLng = [number, number]; // [lat, lng]

export const ROAD_FACTOR = 1.35; // las calles nunca van en línea recta
export const SPEED: Record<Mode, number> = { punta: 14, valle: 24, bici: 13 }; // km/h promedio
export const ACCESS_MIN: Record<Mode, number> = { punta: 6, valle: 6, bici: 2 }; // caminar, estacionar, esperar
export type Mode = 'punta' | 'valle' | 'bici';

export function haversineKm(a: LatLng, b: LatLng) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function commuteMin(from: LatLng, to: LatLng, mode: Mode = 'punta') {
  const km = haversineKm(from, to) * ROAD_FACTOR;
  return Math.round((km / SPEED[mode]) * 60 + ACCESS_MIN[mode]);
}

/** Cuota mensual de hipoteca (sistema francés) con TEA. */
export function mortgage(price: number, downPct: number, years: number, tea: number) {
  const principal = price * (1 - downPct / 100);
  const i = Math.pow(1 + tea / 100, 1 / 12) - 1;
  const n = years * 12;
  return Math.round(i === 0 ? principal / n : (principal * i) / (1 - Math.pow(1 + i, -n)));
}
