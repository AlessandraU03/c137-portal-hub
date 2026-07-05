import type { Location } from '../domain/location.types';

export interface DecoratedLocation extends Location {
  badge: string;
  risk: string;
  status?: string;
  color: string;
  banner: string;
  desc: string;
  action?: string;
  warn?: string;
}

export function mapLocationToVM(loc: Location): DecoratedLocation {
  const name = loc.name.toLowerCase();
  const type = loc.type;

  let badge = `TIPO: ${type.toUpperCase()}`;
  let risk = 'RIESGO NO EVALUADO';
  let status: string | undefined = undefined;
  let color = 'border-outline-variant/30';
  let banner = 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=1200&q=80';
  let desc = 'Dimensión estable identificada en el escáner del Portal Gun. Firmas biológicas detectadas en este plano sectorial.';
  let action: string | undefined = 'ESCANEAR NÚCLEO';
  let warn: string | undefined = undefined;

  if (name.includes('earth') || name.includes('tierra')) {
    badge = 'ANCLA TOPOLÓGICA';
    risk = 'RIESGO MODERADO';
    status = 'Estado: Crónicamente Desordenado';
    color = 'border-primary/45';
    banner = 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=1200&q=80';
    action = undefined;
  } else if (name.includes('citadel') || name.includes('ciudadela')) {
    badge = 'ESPACIO EXTRADIMENSIONAL';
    risk = 'RIESGO MEDIO (BUROCRÁTICO)';
    color = 'border-tertiary/45';
    banner = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80';
    desc = 'El centro político y social para todos los Ricks y Mortys de la curva finita. Cuidado con sus pasos; la burocracia es fatal.';
    action = 'ANALIZAR NÚCLEO';
  } else if (name.includes('anatomy') || name.includes('anatomía')) {
    badge = 'MICROVERSO ORGÁNICO';
    risk = 'RIESGO CRÍTICO';
    color = 'border-secondary/45';
    banner = 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=80';
    desc = 'ANFITRIÓN: RUBEN (FALLECIDO) | ATRACCIÓN: PIRATAS DEL PÁNCREAS. Espacio Biológico Interno.';
    action = 'ANALIZAR NÚCLEO';
  } else if (name.includes('cronenberg')) {
    badge = 'NIVEL DE PELIGRO: CRÍTICO';
    risk = 'PELIGRO EXTREMO';
    color = 'border-error/45';
    banner = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
    desc = 'Un experimento fallido de la realidad. La cohesión biológica ha sido descartada permanentemente por pesadillas artísticas.';
    warn = 'DERIVA DIMENSIONAL DETECTADA';
    action = undefined;
  } else if (name.includes('gazorpazorp')) {
    badge = 'SISTEMA: ANDROMEDA 6';
    risk = 'RIESGO NO EVALUADO';
    color = 'border-primary/40';
    desc = 'Población: Agresiva | Atmósfera: Respirable (Mayormente).';
    action = 'VER MAPA';
  }

  return {
    ...loc,
    badge,
    risk,
    status,
    color,
    banner,
    desc,
    action,
    warn,
  };
}
