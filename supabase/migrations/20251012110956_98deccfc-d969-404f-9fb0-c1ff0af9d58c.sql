-- Criar tabela de pedidos de adoção
CREATE TABLE public.pedidos_adocao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gato_id UUID REFERENCES public.gatos(id) ON DELETE CASCADE NOT NULL,
  nome_candidato TEXT NOT NULL,
  contato_candidato TEXT NOT NULL,
  termo_compromisso_aceito BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'Pendente',
  data_pedido TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pedidos_adocao ENABLE ROW LEVEL SECURITY;

-- Policy: Qualquer pessoa pode criar um pedido de adoção (público)
CREATE POLICY "Qualquer pessoa pode criar pedido de adoção"
ON public.pedidos_adocao
FOR INSERT
WITH CHECK (true);

-- Policy: Apenas protetores autenticados podem visualizar pedidos
CREATE POLICY "Protetores podem visualizar pedidos de adoção"
ON public.pedidos_adocao
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Policy: Apenas protetores autenticados podem atualizar status
CREATE POLICY "Protetores podem atualizar status de pedidos"
ON public.pedidos_adocao
FOR UPDATE
USING (auth.uid() IS NOT NULL);