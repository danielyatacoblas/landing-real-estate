'use client';
import { useEffect, useRef, useState } from 'react';
import type { Map as MlMap, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { LISTINGS, WORKPLACES } from '@/lib/listings';

type Props = {
  workplaceId: string;
  minutes: Record<string, number>;
  maxMin: number;
  visible: Set<string>;
  active: string | null;
  onHover: (id: string | null) => void;
  onOpen: (id: string) => void;
};

const STYLE = 'https://tiles.openfreemap.org/styles/positron';
const usdK = (n: number) => `$${Math.round(n / 1000)}k`;

export default function MapView({ workplaceId, minutes, maxMin, visible, active, onHover, onOpen }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const map = useRef<MlMap | null>(null);
  const pins = useRef(new Map<string, HTMLButtonElement>());
  const work = useRef<Marker | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const handlers = useRef({ onHover, onOpen });
  handlers.current = { onHover, onOpen };

  // MapLibre pesa ~800 kB: se descarga solo cuando el mapa está por entrar en pantalla.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let cancelled = false;
    const io = new IntersectionObserver(async ([e]) => {
      if (!e.isIntersecting || map.current) return;
      io.disconnect();
      try {
        const mod = await import('maplibre-gl');
        const ml = ((mod as unknown as { default?: typeof mod }).default ?? mod) as typeof mod;
        if (cancelled) return;
        const m = new ml.Map({
          container: el, style: STYLE, center: [-77.03, -12.1], zoom: 11.4, minZoom: 10, maxZoom: 16,
          attributionControl: { compact: true }, cooperativeGestures: true,
        });
        m.addControl(new ml.NavigationControl({ showCompass: false }), 'top-right');
        m.on('load', () => {
          m.addSource('route', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
          m.addLayer({ id: 'route', type: 'line', source: 'route', paint: { 'line-color': '#e8541c', 'line-width': 3, 'line-dasharray': [1.5, 1.5] } });
          LISTINGS.forEach((l) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'pin';
            b.addEventListener('pointerenter', () => handlers.current.onHover(l.id));
            b.addEventListener('pointerleave', () => handlers.current.onHover(null));
            b.addEventListener('focus', () => handlers.current.onHover(l.id));
            b.addEventListener('click', () => handlers.current.onOpen(l.id));
            pins.current.set(l.id, b);
            new ml.Marker({ element: b, anchor: 'bottom' }).setLngLat([l.pos[1], l.pos[0]]).addTo(m);
          });
          const w = document.createElement('div');
          w.className = 'work';
          work.current = new ml.Marker({ element: w, anchor: 'center' }).setLngLat([-77.03, -12.095]).addTo(m);
          setReady(true);
        });
        m.on('error', (ev) => { if (!m.loaded() && String(ev.error?.message || '').includes('style')) setFailed(true); });
        map.current = m;
      } catch { setFailed(true); }
    }, { rootMargin: '400px' });
    io.observe(el);
    return () => { cancelled = true; io.disconnect(); map.current?.remove(); map.current = null; pins.current.clear(); };
  }, []);

  // Pines: texto, atenuado y estado activo según filtros.
  useEffect(() => {
    if (!ready) return;
    LISTINGS.forEach((l) => {
      const b = pins.current.get(l.id);
      if (!b) return;
      const min = minutes[l.id];
      const inside = visible.has(l.id);
      b.innerHTML = `<b>${usdK(l.price)}</b><span>${min} min</span>`;
      b.setAttribute('aria-label', `${l.title}, ${l.district}, ${usdK(l.price)}, ${min} minutos al trabajo`);
      if (!inside) b.dataset.out = '1'; else delete b.dataset.out;
      if (active === l.id) b.dataset.active = '1'; else delete b.dataset.active;
      b.tabIndex = inside ? 0 : -1;
    });
  }, [ready, minutes, visible, active, maxMin]);

  useEffect(() => {
    if (!ready || !map.current) return;
    const w = WORKPLACES.find((x) => x.id === workplaceId)!;
    work.current?.setLngLat([w.pos[1], w.pos[0]]);
    const el = work.current?.getElement();
    if (el) el.innerHTML = `<span>${w.short}</span>`;
    const l = LISTINGS.find((x) => x.id === active);
    const src = map.current.getSource('route') as { setData: (d: unknown) => void } | undefined;
    src?.setData({
      type: 'FeatureCollection',
      features: l ? [{ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [[w.pos[1], w.pos[0]], [l.pos[1], l.pos[0]]] } }] : [],
    });
  }, [ready, workplaceId, active]);

  return (
    <div className="map" ref={box} role="region" aria-label="Mapa de departamentos en Lima">
      {!ready && <p className="map__state">{failed ? 'No pudimos cargar el mapa. La lista de la izquierda tiene los mismos departamentos.' : 'Cargando mapa de Lima…'}</p>}
    </div>
  );
}
