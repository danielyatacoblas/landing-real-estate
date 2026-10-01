'use client';
import { useEffect, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { LISTINGS, WORKPLACES } from '@/lib/listings';
import { commuteMin, type Mode } from '@/lib/commute';
import { gsap, reduced } from '@/lib/motion';

const MapView = dynamic(() => import('./MapView'), { ssr: false, loading: () => <div className="map"><p className="map__state">Cargando mapa de Lima…</p></div> });

export type Filters = { work: string; mode: Mode; maxMin: number; budget: number; beds: number };
const BUDGETS = [150000, 250000, 350000, 500000];
const usd = (n: number) => `US$ ${n.toLocaleString('en-US')}`;

export default function Finder({ f, setF, active, setActive, onOpen }: {
  f: Filters; setF: (f: Filters) => void; active: string | null; setActive: (id: string | null) => void; onOpen: (id: string) => void;
}) {
  const work = WORKPLACES.find((w) => w.id === f.work)!;
  const minutes = useMemo(() => Object.fromEntries(LISTINGS.map((l) => [l.id, commuteMin(l.pos, work.pos, f.mode)])), [work, f.mode]);
  const fits = (id: string) => {
    const l = LISTINGS.find((x) => x.id === id)!;
    return minutes[id] <= f.maxMin && l.price <= f.budget && l.beds >= f.beds;
  };
  const sorted = useMemo(() => [...LISTINGS].sort((a, b) => minutes[a.id] - minutes[b.id]), [minutes]);
  const visible = useMemo(() => new Set(LISTINGS.filter((l) => fits(l.id)).map((l) => l.id)), [minutes, f]); // eslint-disable-line react-hooks/exhaustive-deps
  const list = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!list.current || reduced()) return;
    gsap.fromTo(list.current.querySelectorAll('.home[data-in]'), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.04, ease: 'expo.out' });
  }, [f]);

  useEffect(() => {
    if (!active) return;
    const el = list.current?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (el && matchMedia('(min-width: 1000px)').matches) el.scrollIntoView({ block: 'nearest', behavior: reduced() ? 'auto' : 'smooth' });
  }, [active]);

  return (
    <section className="finder" id="buscar" aria-labelledby="finder-title">
      <div className="finder__head">
        <h2 id="finder-title">
          <span className="tnum">{visible.size}</span> de {LISTINGS.length} depas a {f.maxMin} min o menos de {work.short}
        </h2>
        <form className="filters" onSubmit={(e) => e.preventDefault()} aria-label="Filtros">
          <label className="ctl">
            <span>Trabajo en</span>
            <select value={f.work} onChange={(e) => setF({ ...f, work: e.target.value })}>
              {WORKPLACES.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </label>
          <fieldset className="ctl">
            <legend>Salgo en</legend>
            <div className="seg" role="radiogroup" aria-label="Hora de salida">
              {(['punta', 'valle', 'bici'] as const).map((m) => (
                <button key={m} type="button" role="radio" aria-checked={f.mode === m} onClick={() => setF({ ...f, mode: m })}>
                  {m === 'punta' ? 'Hora punta' : m === 'valle' ? 'Hora valle' : 'Bicicleta'}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="ctl ctl--range">
            <span>Máximo <b className="tnum">{f.maxMin} min</b></span>
            <input type="range" min={15} max={75} step={5} value={f.maxMin} onChange={(e) => setF({ ...f, maxMin: Number(e.target.value) })} />
          </label>
          <label className="ctl">
            <span>Presupuesto</span>
            <select value={f.budget} onChange={(e) => setF({ ...f, budget: Number(e.target.value) })}>
              {BUDGETS.map((b) => <option key={b} value={b}>Hasta {usd(b)}</option>)}
            </select>
          </label>
          <fieldset className="ctl">
            <legend>Dormitorios</legend>
            <div className="seg" role="radiogroup" aria-label="Dormitorios mínimos">
              {[1, 2, 3].map((n) => (
                <button key={n} type="button" role="radio" aria-checked={f.beds === n} onClick={() => setF({ ...f, beds: n })}>{n}+</button>
              ))}
            </div>
          </fieldset>
        </form>
      </div>

      <div className="finder__split">
        <ul className="homes" ref={list} onPointerLeave={() => setActive(null)}>
          {sorted.map((l) => {
            const ok = visible.has(l.id);
            const min = minutes[l.id];
            return (
              <li key={l.id} className="home" data-id={l.id} data-in={ok ? '' : undefined} data-active={active === l.id ? '' : undefined}>
                <button type="button" className="home__btn" onPointerEnter={() => setActive(l.id)} onFocus={() => setActive(l.id)} onClick={() => onOpen(l.id)} aria-describedby={`why-${l.id}`}>
                  <span className="home__img"><Image src={l.in} alt={l.inAlt} fill sizes="(max-width: 1000px) 40vw, 200px" quality={65} /></span>
                  <span className="home__body">
                    <span className="home__time" data-ok={min <= f.maxMin ? '' : undefined}>
                      <b className="tnum">{min}</b> min a {work.short}
                    </span>
                    <span className="home__title">{l.title}</span>
                    <span className="home__meta">{l.district} · {l.m2} m² · {l.beds} dorm.</span>
                    <span className="home__price tnum">{usd(l.price)}</span>
                    <span className="home__why" id={`why-${l.id}`}>
                      {ok ? l.note : min > f.maxMin ? `Fuera de tu tiempo por ${min - f.maxMin} min` : l.price > f.budget ? 'Supera tu presupuesto' : 'Tiene menos dormitorios'}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <MapView workplaceId={f.work} minutes={minutes} maxMin={f.maxMin} visible={visible} active={active} onHover={setActive} onOpen={onOpen} />
      </div>
      <p className="note">Tiempos estimados con distancia, trama de calles y velocidad media por horario; no reemplazan a un navegador en tiempo real. Departamentos y precios de demostración.</p>
    </section>
  );
}
