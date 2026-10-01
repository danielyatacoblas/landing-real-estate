'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import Image from 'next/image';
import { LISTINGS, WORKPLACES } from '@/lib/listings';
import { commuteMin, mortgage } from '@/lib/commute';
import { sb } from '@/lib/supabase';

const usd = (n: number) => `US$ ${n.toLocaleString('en-US')}`;

export default function Detail({ id, onClose }: { id: string | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [down, setDown] = useState(20);
  const [years, setYears] = useState(20);
  const [err, setErr] = useState<{ name?: string; phone?: string }>({});
  const [sent, setSent] = useState(false);
  const l = LISTINGS.find((x) => x.id === id);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (id && !d.open) { setSent(false); setErr({}); d.showModal(); }
    if (!id && d.open) d.close();
  }, [id]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!l) return;
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get('name') || '').trim();
    const phone = String(fd.get('phone') || '').replace(/\s/g, '');
    const x: typeof err = {};
    if (name.length < 3) x.name = 'Escribe tu nombre y apellido.';
    if (!/^9\d{8}$/.test(phone)) x.phone = 'Usa un celular de 9 dígitos que empiece con 9.';
    setErr(x);
    if (Object.keys(x).length) return;
    await sb.leads(`${name} · ${phone}`, `cerca · visita · ${l.title} (${l.district}) · ${fd.get('when')}`);
    setSent(true);
  }

  return (
    <dialog ref={ref} className="detail" aria-labelledby="detail-title" onClose={onClose}>
      {l && (
        <div className="detail__grid">
          <div className="detail__media">
            <div className="detail__img"><Image src={l.in} alt={l.inAlt} fill sizes="(max-width: 900px) 100vw, 55vw" quality={78} loading="eager" /></div>
            <div className="detail__img detail__img--sm"><Image src={l.ex} alt={l.exAlt} fill sizes="(max-width: 900px) 100vw, 55vw" quality={70} loading="eager" /></div>
          </div>
          <div className="detail__body">
            <div className="detail__top">
              <h2 id="detail-title">{l.title}</h2>
              <button type="button" className="link" onClick={onClose}>Cerrar</button>
            </div>
            <p className="detail__sub">{l.district} · piso {l.floor} · {l.m2} m² · {l.beds} dorm. · {l.baths} baños{l.parking ? ' · estacionamiento' : ''}</p>
            <p className="detail__price tnum">{usd(l.price)} <span>{usd(Math.round(l.price / l.m2))} por m²</span></p>

            <table className="times">
              <caption>Minutos desde este depa</caption>
              <thead><tr><th scope="col">Destino</th><th scope="col">Hora punta</th><th scope="col">Hora valle</th></tr></thead>
              <tbody>
                {WORKPLACES.map((w) => (
                  <tr key={w.id}><th scope="row">{w.short}</th><td className="tnum">{commuteMin(l.pos, w.pos, 'punta')}</td><td className="tnum">{commuteMin(l.pos, w.pos, 'valle')}</td></tr>
                ))}
              </tbody>
            </table>

            <div className="loan">
              <p className="loan__q">Cuota hipotecaria estimada <b className="tnum">{usd(mortgage(l.price, down, years, 8.5))}</b> al mes</p>
              <label><span>Inicial <b className="tnum">{down} %</b></span><input type="range" min={10} max={50} step={5} value={down} onChange={(e) => setDown(Number(e.target.value))} /></label>
              <label><span>Plazo <b className="tnum">{years} años</b></span><input type="range" min={10} max={30} step={5} value={years} onChange={(e) => setYears(Number(e.target.value))} /></label>
              <p className="note">TEA referencial de 8,5 %. Sin seguros ni comisiones.</p>
            </div>

            {sent ? (
              <p className="sent" role="status">Listo. Un asesor te escribe hoy para confirmar la visita.</p>
            ) : (
              <form className="visit" onSubmit={submit} noValidate>
                <label className="ctl"><span>Nombre</span><input name="name" autoComplete="name" aria-invalid={!!err.name} aria-describedby="v-name" /><small id="v-name" className="err">{err.name}</small></label>
                <label className="ctl"><span>Celular</span><input name="phone" inputMode="numeric" autoComplete="tel-national" placeholder="9XX XXX XXX" aria-invalid={!!err.phone} aria-describedby="v-phone" /><small id="v-phone" className="err">{err.phone}</small></label>
                <label className="ctl"><span>¿Cuándo?</span><select name="when" defaultValue="Sábado en la mañana"><option>Entre semana después de las 6 p. m.</option><option>Sábado en la mañana</option><option>Sábado en la tarde</option></select></label>
                <button type="submit" className="btn btn--accent">Agendar visita</button>
              </form>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
