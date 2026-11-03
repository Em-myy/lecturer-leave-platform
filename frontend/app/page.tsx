"use client";

import { useAuth } from "@/context/AuthContext";
import { signIn, signUp } from "@/lib/auth-client";
import { DEPARTMENTS } from "@/utils/helper";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface FormType {
  name: string;
  email: string;
  password: string;
  department: string;
}

export default function Home() {
  const router = useRouter();
  const { profile } = useAuth();

  const [formData, setFormData] = useState<FormType>({
    name: "",
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
      const { data, error: signInError } = await signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        console.log(signInError);
        setLoading(false);
        return;
      }

      if (profile?.role === "lecturer") {
        router.replace("/lecturer/home");
      } else if (profile?.role === "hod") {
        router.replace("/hod/home");
      } else {
        router.replace("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data, error: signUpError } = await signUp.email({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        department: formData.department,
        callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/dashboard`,
      });

      if (signUpError) {
        console.log(signUpError);
        setLoading(false);
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

          <button type="submit">{loading ? "Signing In..." : "Sign In"}</button>
        </form>
      </div>

      <div>
        <h1>Sign Up</h1>
        <form onSubmit={handleSignUp}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
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
