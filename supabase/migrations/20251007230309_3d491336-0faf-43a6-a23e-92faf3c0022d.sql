-- Create enums for cat status, sex, and other attributes
CREATE TYPE public.cat_status AS ENUM ('no_campus', 'em_tratamento', 'adotado', 'falecido', 'desconhecido');
CREATE TYPE public.cat_sex AS ENUM ('macho', 'femea', 'desconhecido');

-- Create protetores (caretakers) table
CREATE TABLE public.protetores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  campus TEXT NOT NULL,
  email TEXT NOT NULL,
  foto_url TEXT,
  data_cadastro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  gatos_cadastrados INTEGER NOT NULL DEFAULT 0,
  gatos_editados INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create gatos (cats) table
CREATE TABLE public.gatos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  sexo cat_sex NOT NULL DEFAULT 'desconhecido',
  status cat_status NOT NULL DEFAULT 'no_campus',
  castrado BOOLEAN NOT NULL DEFAULT false,
  vacinado BOOLEAN NOT NULL DEFAULT false,
  data_ultima_vacinacao DATE,
  local_encontrado TEXT,
  caracteristicas TEXT,
  fotos TEXT[], -- Array of photo URLs
  protetor_id UUID REFERENCES public.protetores(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.protetores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gatos ENABLE ROW LEVEL SECURITY;

-- Policies for protetores table
-- Everyone can view protetores
CREATE POLICY "Protetores are viewable by everyone"
  ON public.protetores FOR SELECT
  USING (true);

-- Only authenticated users can insert their own profile
CREATE POLICY "Users can insert their own protetor profile"
  ON public.protetores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Only authenticated users can update their own profile
CREATE POLICY "Users can update their own protetor profile"
  ON public.protetores FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies for gatos table
-- Everyone can view cats
CREATE POLICY "Gatos are viewable by everyone"
  ON public.gatos FOR SELECT
  USING (true);

-- Only authenticated users (protetores) can insert cats
CREATE POLICY "Authenticated users can insert gatos"
  ON public.gatos FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users can update cats
CREATE POLICY "Authenticated users can update gatos"
  ON public.gatos FOR UPDATE
  TO authenticated
  USING (true);

-- Only authenticated users can delete cats
CREATE POLICY "Authenticated users can delete gatos"
  ON public.gatos FOR DELETE
  TO authenticated
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_protetores_updated_at
  BEFORE UPDATE ON public.protetores
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_gatos_updated_at
  BEFORE UPDATE ON public.gatos
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Function to handle new user sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.protetores (user_id, nome, email, campus)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', 'Novo Protetor'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'campus', 'Não especificado')
  );
  RETURN NEW;
END;
$$;

-- Trigger to create protetor profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create storage bucket for cat photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('cat-photos', 'cat-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for cat photos
CREATE POLICY "Cat photos are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'cat-photos');

CREATE POLICY "Authenticated users can upload cat photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'cat-photos');

CREATE POLICY "Authenticated users can update cat photos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'cat-photos');

CREATE POLICY "Authenticated users can delete cat photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'cat-photos');