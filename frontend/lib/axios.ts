import { createClient } from "@/utils/supabase/client";
import axios from "axios";

// Create a custom Axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to inject the Supabase JWT token before every request
apiClient.interceptors.request.use(
  async (config) => {
    const supabase = createClient();

    // Fetch the active session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default apiClient;
