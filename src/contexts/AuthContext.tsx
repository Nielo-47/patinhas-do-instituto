import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isProtetor: boolean;
  protetorId: string | null;
  isProtetorAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isProtetor: false,
  protetorId: null,
  isProtetorAdmin: false,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [protetorId, setProtetorId] = useState<string | null>(null);
  const [isProtetorAdmin, setIsProtetorAdmin] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (event === "SIGNED_OUT") {
        setLoading(false);
        setProtetorId(null);
        setIsProtetorAdmin(false);
      }
    });

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
        // Get protetor ID and admin status
        const { data: protetorData } = await supabase
          .from("protetores")
          .select("id, is_admin")
          .eq("id", user.id)
          .maybeSingle();

        setProtetorId(protetorData?.id || null);
        setIsProtetorAdmin(protetorData?.is_admin || false);
      }, 0);
    } else {
      setProtetorId(null);
      setIsProtetorAdmin(false);
    }
  }, [user]);

  const isProtetor = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isProtetor,
        protetorId,
        isProtetorAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
