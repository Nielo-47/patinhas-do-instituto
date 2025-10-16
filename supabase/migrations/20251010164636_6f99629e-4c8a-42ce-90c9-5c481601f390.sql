-- Criar enum para roles de usuário
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Criar tabela de roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (id, role)
);

-- Habilitar RLS na tabela user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Função de segurança para verificar roles
CREATE OR REPLACE FUNCTION public.has_role(_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE id = _id
      AND role = _role
  )
$$;

-- Política RLS para user_roles (todos podem ver, mas só o próprio usuário pode inserir)
CREATE POLICY "Users can view all roles"
ON public.user_roles
FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own role"
ON public.user_roles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Adicionar campo forma_de_contato à tabela protetores
ALTER TABLE public.protetores
ADD COLUMN forma_de_contato TEXT;