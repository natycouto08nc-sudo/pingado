import type { Cafe, PerfilSensorial } from './types';

export function calcularCompatibilidade(cafe: Cafe, perfil: PerfilSensorial): number {
  const atributos: Array<keyof Pick<PerfilSensorial, 'acidez' | 'docura' | 'corpo' | 'amargor' | 'intensidade'>> = [
    'acidez', 'docura', 'corpo', 'amargor', 'intensidade',
  ];

  let totalDiff = 0;
  let count = 0;

  for (const attr of atributos) {
    const cafeVal = cafe[attr as keyof Cafe] as number | null;
    if (cafeVal != null) {
      const diff = Math.abs(cafeVal - perfil[attr]);
      totalDiff += diff;
      count++;
    }
  }

  if (count === 0) return 70;

  const maxDiff = count * 4;
  const similarity = 1 - totalDiff / maxDiff;

  let bonus = 0;
  if (cafe.notas_sensoriais && perfil.preferencias.length > 0) {
    const matches = cafe.notas_sensoriais.filter(nota =>
      perfil.preferencias.some(pref =>
        nota.toLowerCase().includes(pref.toLowerCase()) ||
        pref.toLowerCase().includes(nota.toLowerCase())
      )
    ).length;
    bonus = (matches / Math.max(perfil.preferencias.length, 1)) * 15;
  }

  return Math.min(100, Math.round(similarity * 85 + bonus));
}

export function getCompatibilidadeLabel(score: number): string {
  if (score >= 90) return 'Excelente';
  if (score >= 75) return 'Muito bom';
  if (score >= 60) return 'Bom';
  return 'Regular';
}

export function getCompatibilidadeColor(score: number): string {
  if (score >= 90) return 'text-green-600 bg-green-50';
  if (score >= 75) return 'text-orange-600 bg-orange-50';
  if (score >= 60) return 'text-yellow-600 bg-yellow-50';
  return 'text-gray-600 bg-gray-50';
}
