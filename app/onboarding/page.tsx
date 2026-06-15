'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Coffee, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';

const PREFERENCIAS = [
  'Chocolate', 'Caramelo', 'Castanhas', 'Floral',
  'Frutas Vermelhas', 'Frutas Cítricas', 'Mel', 'Especiarias',
];

const ATRIBUTOS = [
  { key: 'acidez', label: 'Acidez', low: 'Muito baixa', high: 'Muito alta', desc: 'Quão ácido você prefere seu café?' },
  { key: 'docura', label: 'Doçura', low: 'Muito seco', high: 'Muito doce', desc: 'Qual nível de doçura você aprecia?' },
  { key: 'corpo', label: 'Corpo', low: 'Muito leve', high: 'Muito encorpado', desc: 'Como você prefere a textura e o peso do café na boca?' },
  { key: 'amargor', label: 'Amargor', low: 'Sem amargor', high: 'Muito amargo', desc: 'Você aprecia o amargor característico do café?' },
  { key: 'intensidade', label: 'Intensidade', low: 'Muito suave', high: 'Muito intenso', desc: 'Qual intensidade geral você prefere?' },
] as const;

type AtributoKey = 'acidez' | 'docura' | 'corpo' | 'amargor' | 'intensidade';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, refreshPerfilSensorial } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState(0);
  const [valores, setValores] = useState<Record<AtributoKey, number>>({
    acidez: 3, docura: 3, corpo: 3, amargor: 3, intensidade: 3,
  });
  const [preferencias, setPreferencias] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  const totalSteps = ATRIBUTOS.length + 1;
  const progress = ((step) / totalSteps) * 100;

  const togglePreferencia = (pref: string) => {
    setPreferencias(prev =>
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('perfis_sensoriais').upsert(
      {
        user_id: user.id,
        ...valores,
        preferencias,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );
    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
      setSaving(false);
      return;
    }
    await refreshPerfilSensorial();
    router.push('/dashboard');
  };

  const isLastStep = step === totalSteps - 1;
  const currentAtributo = step < ATRIBUTOS.length ? ATRIBUTOS[step] : null;

  return (
    <div className="min-h-screen bg-[#fdfcf0] flex flex-col">
      {/* Header */}
      <header className="px-6 py-5 flex items-center gap-3 border-b border-[#4a2c2a]/8">
        <div className="w-9 h-9 rounded-xl bg-[#f97316] flex items-center justify-center">
          <Coffee size={18} className="text-white" />
        </div>
        <span className="font-display text-xl font-bold text-[#4a2c2a]">Pingado</span>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          {/* Progress */}
          <div className="mb-10">
            <div className="flex items-center justify-between text-sm text-[#6b5b58] mb-3">
              <span>Perfil Sensorial</span>
              <span>{step + 1} de {totalSteps}</span>
            </div>
            <div className="h-2 bg-[#4a2c2a]/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#f97316] rounded-full transition-all duration-500"
                style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Atributo step */}
          {currentAtributo && (
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-50 text-[#f97316] text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-orange-100">
                {currentAtributo.label}
              </div>
              <h2 className="font-display text-3xl font-bold text-[#4a2c2a] mb-3">{currentAtributo.desc}</h2>
              <p className="text-[#6b5b58] mb-10">Escolha um valor de 1 a 5</p>

              <div className="grid grid-cols-5 gap-3 mb-6">
                {[1, 2, 3, 4, 5].map(val => (
                  <button
                    key={val}
                    onClick={() => setValores(prev => ({ ...prev, [currentAtributo.key]: val }))}
                    className={`
                      flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all
                      ${valores[currentAtributo.key] === val
                        ? 'border-[#f97316] bg-orange-50 shadow-lg shadow-orange-100'
                        : 'border-[#4a2c2a]/10 bg-white hover:border-[#f97316]/40'
                      }
                    `}
                  >
                    <span className={`text-2xl font-bold ${valores[currentAtributo.key] === val ? 'text-[#f97316]' : 'text-[#4a2c2a]'}`}>
                      {val}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-[#6b5b58]">
                <span>{currentAtributo.low}</span>
                <span>{currentAtributo.high}</span>
              </div>
            </div>
          )}

          {/* Preferencias step */}
          {isLastStep && (
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-50 text-[#f97316] text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-orange-100">
                Preferências
              </div>
              <h2 className="font-display text-3xl font-bold text-[#4a2c2a] mb-3">Quais notas você aprecia?</h2>
              <p className="text-[#6b5b58] mb-8">Selecione todas que você aprecia (opcional)</p>

              <div className="grid grid-cols-2 gap-3">
                {PREFERENCIAS.map(pref => {
                  const selected = preferencias.includes(pref);
                  return (
                    <button
                      key={pref}
                      onClick={() => togglePreferencia(pref)}
                      className={`
                        flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-sm font-medium transition-all text-left
                        ${selected
                          ? 'border-[#f97316] bg-orange-50 text-[#f97316]'
                          : 'border-[#4a2c2a]/10 bg-white text-[#4a2c2a] hover:border-[#f97316]/40'
                        }
                      `}
                    >
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${selected ? 'border-[#f97316] bg-[#f97316]' : 'border-[#4a2c2a]/20'}`}>
                        {selected && <Check size={11} className="text-white" />}
                      </div>
                      {pref}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10">
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-[#4a2c2a] hover:bg-[#4a2c2a]/5 transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
              Voltar
            </button>

            {isLastStep ? (
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-[#f97316] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#ea580c] transition-all shadow-lg shadow-orange-200 disabled:opacity-60"
              >
                {saving ? <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <>Finalizar perfil <Check size={18} /></>}
              </button>
            ) : (
              <button
                onClick={() => setStep(s => s + 1)}
                className="flex items-center gap-2 bg-[#f97316] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#ea580c] transition-all shadow-lg shadow-orange-200"
              >
                Próximo <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
