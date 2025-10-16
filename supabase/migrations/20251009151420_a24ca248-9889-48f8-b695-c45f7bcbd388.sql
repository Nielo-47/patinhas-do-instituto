-- Create the protetor_atividade_historico table with data_referencia
CREATE TABLE IF NOT EXISTS public.protetor_atividade_historico (
  id BIGSERIAL PRIMARY KEY,
  protetor_id UUID NOT NULL REFERENCES public.protetores(id) ON DELETE CASCADE,
  data_referencia DATE NOT NULL,
  gatos_cadastrados_mes INTEGER NOT NULL DEFAULT 0,
  gatos_editados_mes INTEGER NOT NULL DEFAULT 0,
  novos_protetores_cadastrados_mes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(protetor_id, data_referencia)
);

-- Enable RLS
ALTER TABLE public.protetor_atividade_historico ENABLE ROW LEVEL SECURITY;

-- Create policies for the table
CREATE POLICY "Histórico de atividade é visível por todos"
  ON public.protetor_atividade_historico
  FOR SELECT
  USING (true);

CREATE POLICY "Apenas o protetor pode inserir seu histórico"
  ON public.protetor_atividade_historico
  FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM public.protetores WHERE id = protetor_id));

-- Create index for better performance
CREATE INDEX idx_protetor_atividade_data ON public.protetor_atividade_historico(protetor_id, data_referencia DESC);