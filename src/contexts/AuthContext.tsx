import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isProtetor: boolean;
  isAdmin: boolean;
  protetorId: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isProtetor: false,
  isAdmin: false,
  protetorId: null,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [protetorId, setProtetorId] = useState<string | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (event === 'SIGNED_OUT') {
          setLoading(false);
          setIsAdmin(false);
          setProtetorId(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check admin role and protetor ID
  useEffect(() => {
    if (user) {
      // Check if user is admin
      setTimeout(async () => {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();
        
        setIsAdmin(!!roleData);

        // Get protetor ID
        const { data: protetorData } = await supabase
          .from('protetores')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();
        
        setProtetorId(protetorData?.id || null);
      }, 0);
    } else {
      setIsAdmin(false);
      setProtetorId(null);
    }
  }, [user]);

  const isProtetor = !!user;

  return (
    <AuthContext.Provider value={{ user, session, loading, isProtetor, isAdmin, protetorId }}>
      {children}
    </AuthContext.Provider>
  );
};
