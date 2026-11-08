"use client";

import { DEPARTMENTS } from "@/utils/helper";
import { createClient } from "@/utils/supabase/client";
import {
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface FormType {
  fullname: string;
  email: string;
  password: string;
  department: string;
}

export default function Home() {
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState<FormType>({
    fullname: "",
    email: "",
    password: "",
    department: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSignIn, setIsSignIn] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleFormChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setErrorMsg(null);
  };

  const handleSignInChange = () => {
    setIsSignIn(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    setFormData({
      fullname: "",
      email: "",
      password: "",
      department: "",
    });
  };

  const handleRegisterChange = () => {
    setIsSignIn(false);
    setErrorMsg(null);
    setSuccessMsg(null);

    setFormData({
      fullname: "",
      email: "",
      password: "",
      department: "",
    });
  };

  const handleSignIn = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

      if (signInError) {
        setErrorMsg(signInError.message);
        return;
      }

      if (data.user) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        if (profileError) {
          setErrorMsg(
            "Account profile not found. Please contact administration.",
          );
          return;
        }

        if (profileData.role === "lecturer") {
          router.replace("/lecturer/home");
        } else if (profileData.role === "hod") {
          router.replace("/hod/home");
        } else {
          router.replace("/");
        }

        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/dashboard`,
          data: {
            fullname: formData.fullname,
            department: formData.department,
          },
        },
      });

      if (signUpError) {
        setErrorMsg(signUpError.message);
        return;
      }

      setSuccessMsg(
        "Registration successful! Please check your email to verify your account.",
      );
      setFormData({ fullname: "", email: "", password: "", department: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-slate-900 px-8 py-10 text-center text-white">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4 shadow-inner">
            <GraduationCap className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-wide">
            LASU University Portal
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Faculty Leave Management System
          </p>
        </div>

        <div className="p-8">
          <div className="flex bg-slate-100 p-1 rounded-lg mb-8">
            <button
              onClick={handleSignInChange}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                isSignIn
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={handleRegisterChange}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                !isSignIn
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Register Faculty
            </button>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-6 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm rounded">
              {successMsg}
            </div>
          )}

          {isSignIn ? (
            <form
              onSubmit={handleSignIn}
              className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Official Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleFormChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm transition-colors bg-slate-50 focus:bg-white outline-none"
                    placeholder="name@university.edu"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleFormChange}
                    className="block w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm transition-colors bg-slate-50 focus:bg-white outline-none"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2"
              >
                {loading ? "Authenticating..." : "Access Portal"}
                {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleSignUp}
              className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="fullname"
                    required
                    value={formData.fullname}
                    onChange={handleFormChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm transition-colors bg-slate-50 focus:bg-white outline-none"
                    placeholder="Dr. Famuyiwa Emmanuel"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Official Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleFormChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm transition-colors bg-slate-50 focus:bg-white outline-none"
                    placeholder="name@university.edu"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleFormChange}
                    className="block w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm transition-colors bg-slate-50 focus:bg-white outline-none"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Department
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-slate-400" />
                  </div>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleFormChange}
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm transition-colors bg-slate-50 focus:bg-white outline-none appearance-none"
                  >
                    <option value="" disabled>
                      Select Department
                    </option>
                    {DEPARTMENTS.map((dept) => (
                      <option value={dept} key={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-4"
              >
                {loading ? "Registering..." : "Complete Registration"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
