
-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS perfis (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT,
  email TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'produtor', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE perfis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_perfil" ON perfis FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "insert_own_perfil" ON perfis FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "update_own_perfil" ON perfis FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "delete_own_perfil" ON perfis FOR DELETE TO authenticated USING (auth.uid() = id);

-- Sensorial profiles
CREATE TABLE IF NOT EXISTS perfis_sensoriais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  acidez INTEGER NOT NULL DEFAULT 3 CHECK (acidez BETWEEN 1 AND 5),
  docura INTEGER NOT NULL DEFAULT 3 CHECK (docura BETWEEN 1 AND 5),
  corpo INTEGER NOT NULL DEFAULT 3 CHECK (corpo BETWEEN 1 AND 5),
  amargor INTEGER NOT NULL DEFAULT 3 CHECK (amargor BETWEEN 1 AND 5),
  intensidade INTEGER NOT NULL DEFAULT 3 CHECK (intensidade BETWEEN 1 AND 5),
  preferencias TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE perfis_sensoriais ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_perfil_sensorial" ON perfis_sensoriais FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_perfil_sensorial" ON perfis_sensoriais FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_perfil_sensorial" ON perfis_sensoriais FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_perfil_sensorial" ON perfis_sensoriais FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Producers
CREATE TABLE IF NOT EXISTS produtores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  regiao TEXT NOT NULL,
  estado TEXT,
  descricao TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE produtores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_produtores" ON produtores FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_produtores" ON produtores FOR INSERT TO authenticated WITH CHECK (false);
CREATE POLICY "update_produtores" ON produtores FOR UPDATE TO authenticated USING (false) WITH CHECK (false);
CREATE POLICY "delete_produtores" ON produtores FOR DELETE TO authenticated USING (false);

-- Coffees catalog
CREATE TABLE IF NOT EXISTS cafes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produtor_id UUID REFERENCES produtores(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  descricao TEXT,
  regiao TEXT,
  score_sca NUMERIC(4,1),
  acidez INTEGER CHECK (acidez BETWEEN 1 AND 5),
  docura INTEGER CHECK (docura BETWEEN 1 AND 5),
  corpo INTEGER CHECK (corpo BETWEEN 1 AND 5),
  amargor INTEGER CHECK (amargor BETWEEN 1 AND 5),
  intensidade INTEGER CHECK (intensidade BETWEEN 1 AND 5),
  notas_sensoriais TEXT[],
  imagem_url TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  preco NUMERIC(8,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE cafes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_cafes" ON cafes FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_cafes" ON cafes FOR INSERT TO authenticated WITH CHECK (false);
CREATE POLICY "update_cafes" ON cafes FOR UPDATE TO authenticated USING (false) WITH CHECK (false);
CREATE POLICY "delete_cafes" ON cafes FOR DELETE TO authenticated USING (false);

-- Favorites
CREATE TABLE IF NOT EXISTS favoritos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cafe_id UUID NOT NULL REFERENCES cafes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, cafe_id)
);

ALTER TABLE favoritos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_favoritos" ON favoritos FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_favoritos" ON favoritos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_favoritos" ON favoritos FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_favoritos" ON favoritos FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Subscriptions
CREATE TABLE IF NOT EXISTS assinaturas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plano TEXT NOT NULL DEFAULT 'basico' CHECK (plano IN ('basico', 'premium', 'plus')),
  status TEXT NOT NULL DEFAULT 'ativa' CHECK (status IN ('ativa', 'pausada', 'cancelada')),
  proxima_entrega DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE assinaturas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_assinatura" ON assinaturas FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_assinatura" ON assinaturas FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_assinatura" ON assinaturas FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_assinatura" ON assinaturas FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Boxes
CREATE TABLE IF NOT EXISTS caixas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assinatura_id UUID REFERENCES assinaturas(id) ON DELETE SET NULL,
  mes_referencia TEXT,
  status TEXT NOT NULL DEFAULT 'preparando' CHECK (status IN ('preparando', 'enviada', 'entregue')),
  justificativa TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE caixas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_caixas" ON caixas FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_caixas" ON caixas FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_caixas" ON caixas FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_caixas" ON caixas FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Coffees in boxes
CREATE TABLE IF NOT EXISTS caixa_cafes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caixa_id UUID NOT NULL REFERENCES caixas(id) ON DELETE CASCADE,
  cafe_id UUID NOT NULL REFERENCES cafes(id) ON DELETE CASCADE,
  score_compatibilidade INTEGER,
  justificativa TEXT
);

ALTER TABLE caixa_cafes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_caixa_cafes" ON caixa_cafes FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM caixas WHERE caixas.id = caixa_cafes.caixa_id AND caixas.user_id = auth.uid()));
CREATE POLICY "insert_own_caixa_cafes" ON caixa_cafes FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM caixas WHERE caixas.id = caixa_cafes.caixa_id AND caixas.user_id = auth.uid()));
CREATE POLICY "update_own_caixa_cafes" ON caixa_cafes FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM caixas WHERE caixas.id = caixa_cafes.caixa_id AND caixas.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM caixas WHERE caixas.id = caixa_cafes.caixa_id AND caixas.user_id = auth.uid()));
CREATE POLICY "delete_own_caixa_cafes" ON caixa_cafes FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM caixas WHERE caixas.id = caixa_cafes.caixa_id AND caixas.user_id = auth.uid()));

-- Seed producers and coffees
INSERT INTO produtores (nome, regiao, estado, descricao) VALUES
  ('Fazenda Santa Inês', 'Mantiqueira de Minas', 'MG', 'Uma das fazendas mais premiadas do Brasil, com cafés de altitude excepcionais.'),
  ('Sítio Bom Jesus', 'Chapada Diamantina', 'BA', 'Produção orgânica certificada com terroir único do semiárido baiano.'),
  ('Fazenda Ambiental Fortaleza', 'Mogiana', 'SP', 'Pioneira em práticas sustentáveis e cafés naturais de alta qualidade.'),
  ('Carmo Coffees', 'Sul de Minas', 'MG', 'Especializada em microlotes de processamento especial.'),
  ('Daterra Coffee', 'Cerrado Mineiro', 'MG', 'Referência mundial em sustentabilidade e rastreabilidade.');

INSERT INTO cafes (produtor_id, nome, descricao, regiao, score_sca, acidez, docura, corpo, amargor, intensidade, notas_sensoriais, ativo, preco)
SELECT
  p.id,
  c.nome,
  c.descricao,
  c.regiao,
  c.score_sca,
  c.acidez,
  c.docura,
  c.corpo,
  c.amargor,
  c.intensidade,
  c.notas_sensoriais::TEXT[],
  true,
  c.preco
FROM (VALUES
  ('Fazenda Santa Inês', 'Yellow Bourbon Natural', 'Um café lendário, vencedor de múltiplos campeonatos. Notas intensas de frutas tropicais e mel.', 'Mantiqueira de Minas', 90.5, 2, 5, 3, 1, 3, ARRAY['Frutas Tropicais','Mel','Caramelo','Chocolate ao Leite'], 98.00),
  ('Sítio Bom Jesus', 'Catuaí Honey', 'Processamento honey que realça a doçura natural do grão com notas de frutas vermelhas.', 'Chapada Diamantina', 87.0, 4, 4, 2, 2, 3, ARRAY['Frutas Vermelhas','Ameixa','Mel','Floral'], 79.00),
  ('Fazenda Ambiental Fortaleza', 'Bourbon Amarelo Cereja Natural', 'Café natural de altitude com perfil frutal marcante e acidez equilibrada.', 'Mogiana', 88.5, 3, 4, 3, 2, 3, ARRAY['Caramelo','Laranja','Baunilha','Castanhas'], 85.00),
  ('Carmo Coffees', 'Microlote Geisha', 'Um Geisha excepcional com notas florais delicadas e acidez brilhante.', 'Sul de Minas', 92.0, 5, 3, 2, 1, 2, ARRAY['Floral','Jasmim','Frutas Cítricas','Pêssego'], 145.00),
  ('Daterra Coffee', 'Sweet Collection', 'Blend cuidadosamente selecionado para um perfil equilibrado e versátil.', 'Cerrado Mineiro', 86.0, 2, 4, 4, 3, 4, ARRAY['Chocolate','Caramelo','Castanhas','Especiarias'], 72.00),
  ('Fazenda Santa Inês', 'Mundo Novo Natural', 'Corpo intenso e notas de chocolate amargo, ideal para espresso.', 'Mantiqueira de Minas', 85.5, 2, 3, 5, 4, 5, ARRAY['Chocolate Amargo','Tabaco','Especiarias','Castanhas'], 76.00),
  ('Sítio Bom Jesus', 'Typica Fermentado', 'Fermentação controlada que cria notas únicas e complexas.', 'Chapada Diamantina', 89.0, 4, 3, 3, 2, 3, ARRAY['Frutas Vermelhas','Vinho','Floral','Mel'], 110.00),
  ('Carmo Coffees', 'Catuaí Pulped Natural', 'Equilíbrio perfeito entre corpo e acidez com notas de frutas vermelhas.', 'Sul de Minas', 87.5, 3, 4, 3, 2, 3, ARRAY['Frutas Vermelhas','Caramelo','Mel','Chocolate ao Leite'], 88.00)
) AS c(produtor_nome, nome, descricao, regiao, score_sca, acidez, docura, corpo, amargor, intensidade, notas_sensoriais, preco)
JOIN produtores p ON p.nome = c.produtor_nome;

-- Function to auto-create perfil on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.perfis (id, email, nome)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
