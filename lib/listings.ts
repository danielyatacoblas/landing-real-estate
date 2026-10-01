// Departamentos de demostración: ubicaciones aproximadas por distrito, precios ficticios.
import type { LatLng } from './commute.ts';

export type Listing = {
  id: string;
  title: string;
  district: string;
  pos: LatLng;
  price: number; // USD
  m2: number;
  beds: number;
  baths: number;
  floor: number;
  parking: boolean;
  ex: string;
  in: string;
  exAlt: string;
  inAlt: string;
  note: string;
};

export type Workplace = { id: string; name: string; short: string; pos: LatLng };

export const WORKPLACES: Workplace[] = [
  { id: 'san-isidro', name: 'Centro financiero de San Isidro', short: 'San Isidro', pos: [-12.095, -77.03] },
  { id: 'miraflores', name: 'Óvalo de Miraflores', short: 'Miraflores', pos: [-12.1195, -77.029] },
  { id: 'surco', name: 'Monterrico, Surco', short: 'Monterrico', pos: [-12.086, -76.976] },
  { id: 'centro', name: 'Plaza San Martín, Cercado', short: 'Centro de Lima', pos: [-12.0517, -77.0347] },
  { id: 'callao', name: 'Aeropuerto Jorge Chávez', short: 'Aeropuerto', pos: [-12.0219, -77.1143] },
];

export const LISTINGS: Listing[] = [
  { id: 'malecon', title: 'Frente al malecón', district: 'Miraflores', pos: [-12.127, -77.037], price: 420000, m2: 145, beds: 3, baths: 3, floor: 11, parking: true,
    ex: '/img/ex-2.jpg', in: '/img/in-1.jpg', exAlt: 'Edificio de ladrillo y concreto con balcones de vidrio.', inAlt: 'Sala amplia con ventanales y vista al mar.', note: 'Vista al mar desde la sala y el dormitorio principal.' },
  { id: 'golf', title: 'Junto al Golf', district: 'San Isidro', pos: [-12.101, -77.043], price: 470000, m2: 160, beds: 3, baths: 3, floor: 6, parking: true,
    ex: '/img/ex-1.jpg', in: '/img/in-6.jpg', exAlt: 'Fachada de concreto con balcones metálicos.', inAlt: 'Sala comedor con muro verde y lámparas colgantes.', note: 'A cuatro cuadras del centro financiero.' },
  { id: 'bajada', title: 'Bajada de los Baños', district: 'Barranco', pos: [-12.146, -77.021], price: 255000, m2: 92, beds: 2, baths: 2, floor: 4, parking: false,
    ex: '/img/ex-5.jpg', in: '/img/in-4.jpg', exAlt: 'Edificio con balcones de colores y plantas.', inAlt: 'Sala con ventanas grandes, plantas y sofá verde.', note: 'Se llega caminando a la playa.' },
  { id: 'higuereta', title: 'Parque Higuereta', district: 'Santiago de Surco', pos: [-12.13, -76.999], price: 215000, m2: 110, beds: 3, baths: 2, floor: 8, parking: true,
    ex: '/img/ex-3.jpg', in: '/img/in-7.jpg', exAlt: 'Balcones de vidrio vistos desde abajo contra el cielo.', inAlt: 'Comedor junto a la cocina abierta con cortinas.', note: 'Frente a parque, cerca de la Vía Expresa Sur.' },
  { id: 'campo-marte', title: 'Cerca al Campo de Marte', district: 'Jesús María', pos: [-12.079, -77.047], price: 158000, m2: 78, beds: 2, baths: 2, floor: 9, parking: true,
    ex: '/img/ex-6.jpg', in: '/img/in-5.jpg', exAlt: 'Fachada amarilla con balcones de madera.', inAlt: 'Sala clara con sofá gris y cuadros.', note: 'Corredor Rojo a dos cuadras.' },
  { id: 'costanera', title: 'Costanera', district: 'Magdalena del Mar', pos: [-12.092, -77.07], price: 175000, m2: 85, beds: 2, baths: 2, floor: 12, parking: true,
    ex: '/img/ex-4.jpg', in: '/img/in-2.jpg', exAlt: 'Torre con balcones de vidrio y paneles naranjas.', inAlt: 'Sala con sofá azul y repisas.', note: 'Piso alto con vista parcial al mar.' },
  { id: 'san-borja', title: 'Parque de la Felicidad', district: 'San Borja', pos: [-12.105, -77.0], price: 265000, m2: 120, beds: 3, baths: 2, floor: 5, parking: true,
    ex: '/img/ex-1.jpg', in: '/img/in-8.jpg', exAlt: 'Fachada de concreto con balcones.', inAlt: 'Cocina moderna con barra y comedor.', note: 'Ciclovía en la puerta y Línea 1 cerca.' },
  { id: 'lince', title: 'Arenales', district: 'Lince', pos: [-12.085, -77.036], price: 112000, m2: 52, beds: 1, baths: 1, floor: 7, parking: false,
    ex: '/img/ex-5.jpg', in: '/img/in-9.jpg', exAlt: 'Edificio con balcones de colores.', inAlt: 'Sofá blanco junto a una ventana con cortinas.', note: 'Ideal para vivir solo y caminar al trabajo.' },
  { id: 'pueblo-libre', title: 'Plaza Bolívar', district: 'Pueblo Libre', pos: [-12.076, -77.063], price: 168000, m2: 88, beds: 2, baths: 2, floor: 3, parking: true,
    ex: '/img/ex-2.jpg', in: '/img/in-3.jpg', exAlt: 'Edificio de ladrillo con balcones.', inAlt: 'Sala con muro de ladrillo y ventana grande.', note: 'Barrio tranquilo con mercado y colegios.' },
  { id: 'molina', title: 'Rinconada', district: 'La Molina', pos: [-12.08, -76.942], price: 289000, m2: 150, beds: 3, baths: 3, floor: 2, parking: true,
    ex: '/img/ex-3.jpg', in: '/img/in-6.jpg', exAlt: 'Balcones de vidrio contra el cielo.', inAlt: 'Sala comedor amplia con muro verde.', note: 'Más sol que la costa: casi sin garúa en invierno.' },
  { id: 'chorrillos', title: 'Villa Marina', district: 'Chorrillos', pos: [-12.169, -77.023], price: 139000, m2: 80, beds: 2, baths: 2, floor: 6, parking: true,
    ex: '/img/ex-6.jpg', in: '/img/in-7.jpg', exAlt: 'Fachada amarilla con balcones.', inAlt: 'Comedor con cocina abierta.', note: 'El precio por m² más bajo de la lista.' },
  { id: 'san-miguel', title: 'Parque Media Luna', district: 'San Miguel', pos: [-12.078, -77.09], price: 145000, m2: 75, beds: 2, baths: 2, floor: 10, parking: true,
    ex: '/img/ex-4.jpg', in: '/img/in-4.jpg', exAlt: 'Torre con balcones de vidrio.', inAlt: 'Sala con plantas y ventanas grandes.', note: 'Cerca del aeropuerto por la Costa Verde.' },
];
