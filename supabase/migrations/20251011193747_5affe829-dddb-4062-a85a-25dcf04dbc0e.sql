-- Adicionar coluna is_admin na tabela protetores
ALTER TABLE public.protetores
ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT false;

-- Criar tabela carrossel_home para gerenciar slides do carrossel
CREATE TABLE public.carrossel_home (
  id BIGSERIAL PRIMARY KEY,
  imagem_url TEXT NOT NULL,
  descricao TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.carrossel_home ENABLE ROW LEVEL SECURITY;

-- Policy: Slides do carrossel são visíveis por todos
CREATE POLICY "Carrossel é visível por todos"
ON public.carrossel_home
FOR SELECT
USING (ativo = true);

-- Policy: Apenas admins podem inserir slides
CREATE POLICY "Apenas admins podem inserir slides"
ON public.carrossel_home
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.protetores
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

-- Policy: Apenas admins podem atualizar slides
CREATE POLICY "Apenas admins podem atualizar slides"
ON public.carrossel_home
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.protetores
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

-- Policy: Apenas admins podem deletar slides
CREATE POLICY "Apenas admins podem deletar slides"
ON public.carrossel_home
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.protetores
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_carrossel_updated_at
BEFORE UPDATE ON public.carrossel_home
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Criar índice para melhor performance
CREATE INDEX idx_carrossel_ordem ON public.carrossel_home(ordem) WHERE ativo = true;