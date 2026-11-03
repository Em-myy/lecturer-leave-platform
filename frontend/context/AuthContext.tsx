"use client";

import { signOut, useSession } from "@/lib/auth-client";
import { ProfileType } from "@/utils/helper";
import { User } from "better-auth";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextValue {
  loading: boolean;
  profile: ProfileType | null;
  handleSignOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<ProfileType | null>(null);

  useEffect(() => {
    const fetchProfile = () => {
      const { data, isPending } = useSession();

      if (isPending) {
        setLoading(false);
      }

      setProfile(data && data.user);
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleSignOut = () => {
    signOut();
    router.replace("/");
  };

  return (
    <AuthContext.Provider value={{ loading, profile, handleSignOut }}>
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
