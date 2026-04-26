"use client";

import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useMemo,
} from "react";
import { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Nullable } from "@/types";
import { Role } from "@/app/generated/prisma/enums";

type AuthContextType = {
  user: Nullable<User>;
  role: Nullable<Role>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
});

export const useAuth = () => useContext(AuthContext);

type Props = {
  children: ReactNode;
  initialUser: Nullable<User>;
  userRole: Nullable<Role>;
};

const AuthProvider = ({ children, initialUser, userRole }: Props) => {
  const [clientUser, setClientUser] = useState<Nullable<User> | undefined>(
    undefined,
  );
  const [clientRole, setClientRole] = useState<Nullable<Role> | undefined>(
    undefined,
  );
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setClientUser(session?.user ?? null);
      if (!session?.user) setClientRole(null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const user = clientUser !== undefined ? clientUser : initialUser;
  const role = clientRole !== undefined ? clientRole : (userRole ?? null);

  return (
    <AuthContext.Provider value={{ user, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
