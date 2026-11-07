"use client";

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type RoleType = "lecturer" | "hod" | null;

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  fullname: string;
  role: RoleType;
  department: string;
  handleSignOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [fullname, setFullname] = useState<string>("");
  const [role, setRole] = useState<RoleType>(null);
  const [department, setDepartment] = useState<string>("");

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async (currentUser: User | null) => {
      if (currentUser) {
        setUser(currentUser);

        const { data: profile } = await supabase
          .from("profiles")
          .select("fullname, role, department")
          .eq("id", currentUser?.id)
          .single();

        if (profile) {
          setFullname(profile.fullname || "");
          setRole(profile.role as RoleType);
          setDepartment(profile.department || "");
        }
      } else {
        setUser(null);
        setFullname("");
        setRole(null);
        setDepartment("");
      }

      setLoading(false);
    };

    const initializeAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      await fetchUser(user);
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, fullname, role, department, handleSignOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("Auth context must be used with the Auth Provider");
  }

  return context;
};
