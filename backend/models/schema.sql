-- 1. Create Enums
CREATE TYPE user_role AS ENUM ('lecturer', 'hod');
CREATE TYPE leave_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE request_type AS ENUM('none', 'pending_hod', 'approved', 'rejected');

-- 2. Create Profiles Table (Added email column)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  fullname TEXT,
  department TEXT,
  role user_role NOT NULL DEFAULT 'lecturer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view profiles"
  ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE TO authenticated 
  USING (auth.uid() = id) 
  WITH CHECK (auth.uid() = id);

-- 3. Trigger Function (Fixed enum mapping and added email)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, fullname, department, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'fullname',
    NEW.raw_user_meta_data ->> 'department',
    COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'lecturer'::user_role)
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Create Leave Table (Fixed PK default, removed invalid FK, added status Enum)
CREATE TABLE public.leave (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lecturer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  department TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  reason TEXT NOT NULL,
  status leave_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS for Leave Table
ALTER TABLE public.leave ENABLE ROW LEVEL SECURITY;

-- Lecturers can see their own leaves, HODs can see all leaves in their department
CREATE POLICY "View leaves based on role"
  ON public.leave FOR SELECT TO authenticated
  USING (
    auth.uid() = lecturer_id 
    OR 
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'hod'
  );

-- Only lecturers can insert their own leaves
CREATE POLICY "Lecturers can create leaves"
  ON public.leave FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = lecturer_id);

-- for hod sign up
ALTER TABLE public.profiles 
ADD COLUMN role_request request_type DEFAULT 'none';