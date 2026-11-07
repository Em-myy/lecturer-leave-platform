"use client";

import { DEPARTMENTS } from "@/utils/helper";
import { createClient } from "@/utils/supabase/client";
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
  const [loading, setLoading] = useState<boolean>(false);

  const handleFormChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSignIn = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

      if (signInError) {
        console.log(signInError);
        return;
      }

      if (data.user) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile role:", profileError.message);
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
        console.log(signUpError);
        return;
      }

      console.log("Please check your mail to verify your account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <h1>Sign In</h1>
        <form onSubmit={handleSignIn}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              required
              placeholder="abc@gmail.com"
              onChange={handleFormChange}
            />
          </div>

          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              required
              placeholder="......"
              onChange={handleFormChange}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>

      <div>
        <h1>Sign Up</h1>
        <form onSubmit={handleSignUp}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="fullname"
              placeholder="Famuyiwa Emmanuel"
              required
              onChange={handleFormChange}
            />
          </div>

          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              required
              placeholder="abc@gmail.com"
              onChange={handleFormChange}
            />
          </div>

          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              required
              placeholder="......"
              onChange={handleFormChange}
            />
          </div>

          <div>
            <label>Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleFormChange}
              required
            >
              <option value="" disabled>
                Select a department
              </option>
              {DEPARTMENTS.map((dept) => (
                <option value={dept} key={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <button type="submit">{loading ? "Signing Up..." : "Sign Up"}</button>
        </form>
      </div>
    </div>
  );
}
