import { supabase } from "@/integrations/supabase/client";

export { supabase };

// Helper types
export type CatStatus = 'no_campus' | 'em_tratamento' | 'adotado' | 'falecido' | 'desconhecido';
export type CatSex = 'macho' | 'femea' | 'desconhecido';

// Auth helpers
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUp = async (email: string, password: string, nome: string, campus: string) => {
  const redirectUrl = `${window.location.origin}/`;
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
      data: {
        nome,
        campus,
      },
    },
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Storage helpers
export const uploadCatPhoto = async (file: File, catId: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${catId}/${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('cat-photos')
    .upload(fileName, file);

  if (error) return { data: null, error };

  const { data: { publicUrl } } = supabase.storage
    .from('cat-photos')
    .getPublicUrl(fileName);

  return { data: publicUrl, error: null };
};

export const deleteCatPhoto = async (photoUrl: string) => {
  const fileName = photoUrl.split('/cat-photos/')[1];
  if (!fileName) return { error: new Error('Invalid photo URL') };

  const { error } = await supabase.storage
    .from('cat-photos')
    .remove([fileName]);

  return { error };
};
