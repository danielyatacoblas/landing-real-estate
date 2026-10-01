'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, reduced } from '@/lib/motion';
import { WORKPLACES } from '@/lib/listings';
import Finder, { type Filters } from './Finder';
import Detail from './Detail';

export default function Home() {
  const [f, setF] = useState<Filters>({ work: 'san-isidro', mode: 'punta', maxMin: 30, budget: 350000, beds: 2 });
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const hero = useRef<HTMLElement>(null);
  const method = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reduced()) return;
    const lenis = new Lenis({ duration: 1.05 });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const ctx = gsap.context(() => {
      gsap.from('.hero__h > span', { yPercent: 105, duration: 1.2, ease: 'expo.out', stagger: 0.08, delay: 0.1 });
      gsap.from('.ask', { y: 30, opacity: 0, duration: 1, ease: 'expo.out', delay: 0.5 });
      gsap.to('.hero__bg img', { scale: 1.1, yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      // Las estelas de los autos: el texto del método avanza en horizontal con el scroll.
      gsap.fromTo('.method__trail', { xPercent: 0 }, { xPercent: -40, ease: 'none', scrollTrigger: { trigger: method.current, scrub: true } });
    });
    return () => { ctx.revert(); gsap.ticker.remove(tick); lenis.destroy(); };
  }, []);

  function go() {
    document.getElementById('buscar')?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' });
  }

  return (
    <>
      <a href="#buscar" className="skip">Saltar al buscador</a>
      <header className="hd">
        <a href="#top" className="hd__mark" aria-label="Cerca, inicio">cerca<span aria-hidden="true">.</span></a>
        <nav className="hd__nav" aria-label="Principal"><a href="#buscar">Buscar</a><a href="#metodo">Cómo medimos</a><a href="#zonas">Zonas</a></nav>
      </header>

      <main>
        <section className="hero" id="top" ref={hero} aria-labelledby="hero-title">
          <div className="hero__bg"><Image src="/img/hero.jpg" alt="Costa Verde de Lima al atardecer con estelas de luz de los autos." fill priority sizes="100vw" quality={80} /></div>
          <h1 id="hero-title" className="hero__h">
            <span>Elige tu depa por</span>
            <span>los minutos al trabajo,</span>
            <span>no por el distrito.</span>
          </h1>
          <form className="ask" onSubmit={(e) => { e.preventDefault(); go(); }} aria-label="Empieza tu búsqueda">
            <label>
              <span>Trabajo en</span>
              <select value={f.work} onChange={(e) => setF({ ...f, work: e.target.value })}>
                {WORKPLACES.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </label>
            <label>
              <span>Quiero llegar en</span>
              <select value={f.maxMin} onChange={(e) => setF({ ...f, maxMin: Number(e.target.value) })}>
                {[20, 30, 45, 60].map((m) => <option key={m} value={m}>{m} minutos o menos</option>)}
              </select>
            </label>
            <button type="submit" className="btn btn--accent">Ver depas</button>
          </form>
        </section>

        <Finder f={f} setF={setF} active={active} setActive={setActive} onOpen={setOpen} />

        <section className="method" id="metodo" ref={method} aria-labelledby="method-title">
          <div className="method__img"><Image src="/img/trafico.jpg" alt="Tráfico en la Bajada Armendáriz con edificios sobre el acantilado." fill sizes="(max-width: 900px) 100vw, 40vw" quality={75} /></div>
          <div className="method__body">
            <h2 id="method-title">Cómo calculamos los minutos</h2>
            <p>Medimos la distancia entre el depa y tu trabajo, la multiplicamos por 1,35 porque las calles de Lima nunca van en línea recta, y la dividimos por la velocidad real de cada horario: 14 km/h en hora punta, 24 km/h en hora valle y 13 km/h en bicicleta.</p>
            <p>Sumamos 6 minutos para salir, estacionar o esperar el bus. No es un navegador en tiempo real; es una forma honesta de comparar zonas antes de ir a ver un depa.</p>
            <p className="method__trail" aria-hidden="true">14 km/h · 24 km/h · 13 km/h · × 1,35 · + 6 min · 14 km/h · 24 km/h · 13 km/h</p>
          </div>
        </section>

        <section className="zones" id="zonas" aria-labelledby="zones-title">
          <h2 id="zones-title">La misma ciudad, tres maneras de vivirla</h2>
          <ul>
            <li><div className="zones__img"><Image src="/img/acantilado.jpg" alt="Edificios al borde del acantilado de Miraflores al atardecer." fill sizes="(max-width: 900px) 100vw, 33vw" quality={72} /></div><h3>Frente al mar</h3><p>Miraflores, Barranco y Magdalena. Garúa en invierno, malecón todo el año.</p></li>
            <li><div className="zones__img"><Image src="/img/skyline.jpg" alt="Vista aérea de edificios residenciales y un puente en Lima." fill sizes="(max-width: 900px) 100vw, 33vw" quality={72} /></div><h3>Cerca de todo</h3><p>San Isidro, Lince y Jesús María. Caminas al trabajo y al Corredor Rojo.</p></li>
            <li><div className="zones__img"><Image src="/img/costa.jpg" alt="Costa de Lima con edificios y el mar bajo un cielo gris." fill sizes="(max-width: 900px) 100vw, 33vw" quality={72} /></div><h3>Más metros por dólar</h3><p>Surco, San Miguel y Chorrillos. Más espacio si aceptas unos minutos más.</p></li>
          </ul>
        </section>
      </main>

      <footer className="ft">
        <p className="ft__big">cerca<span>.</span></p>
        <div className="ft__row">
          <p>Cerca es una inmobiliaria ficticia creada para portafolio. Departamentos, precios y tiempos son de demostración. Mapa: OpenFreeMap, © OpenMapTiles, © colaboradores de OpenStreetMap. Fotos: <a href="https://www.pexels.com" rel="noopener">Pexels</a>.</p>
          <a className="badge" href="https://github.com/danielyatacoblas" rel="noopener">Diseñado y desarrollado por Daniel Yataco</a>
        </div>
      </footer>

      <Detail id={open} onClose={() => setOpen(null)} />
    </>
  );
}
