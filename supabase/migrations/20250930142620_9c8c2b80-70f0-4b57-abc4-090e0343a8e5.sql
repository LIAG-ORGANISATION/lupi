-- Create professional profiles table
CREATE TABLE public.professional_profiles (
  id UUID NOT NULL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  profession TEXT NOT NULL,
  zone TEXT NOT NULL,
  bio TEXT,
  phone TEXT,
  website TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create dog owner (guardian) profiles table
CREATE TABLE public.dog_owner_profiles (
  id UUID NOT NULL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create dogs table
CREATE TABLE public.dogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES public.dog_owner_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  breed TEXT,
  birth_date DATE,
  gender TEXT,
  weight NUMERIC,
  avatar_url TEXT,
  medical_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create dog professional access table
CREATE TABLE public.dog_professional_access (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dog_id UUID NOT NULL REFERENCES public.dogs(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  granted_at TIMESTAMP WITH TIME ZONE,
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(dog_id, professional_id)
);

-- Enable Row Level Security
ALTER TABLE public.professional_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dog_owner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dog_professional_access ENABLE ROW LEVEL SECURITY;

-- RLS Policies for professional_profiles
CREATE POLICY "Professionals can view all professional profiles"
  ON public.professional_profiles FOR SELECT
  USING (true);

CREATE POLICY "Professionals can update their own profile"
  ON public.professional_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Professionals can insert their own profile"
  ON public.professional_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for dog_owner_profiles
CREATE POLICY "Dog owners can view all dog owner profiles"
  ON public.dog_owner_profiles FOR SELECT
  USING (true);

CREATE POLICY "Dog owners can update their own profile"
  ON public.dog_owner_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Dog owners can insert their own profile"
  ON public.dog_owner_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for dogs
CREATE POLICY "Owners can view their own dogs"
  ON public.dogs FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Professionals can view dogs they have access to"
  ON public.dogs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.dog_professional_access
      WHERE dog_id = dogs.id
        AND professional_id = auth.uid()
        AND status = 'approved'
    )
  );

CREATE POLICY "Owners can insert their own dogs"
  ON public.dogs FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their own dogs"
  ON public.dogs FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their own dogs"
  ON public.dogs FOR DELETE
  USING (auth.uid() = owner_id);

-- RLS Policies for dog_professional_access
CREATE POLICY "Owners can view access requests for their dogs"
  ON public.dog_professional_access FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.dogs
      WHERE dogs.id = dog_professional_access.dog_id
        AND dogs.owner_id = auth.uid()
    )
  );

CREATE POLICY "Professionals can view their own access requests"
  ON public.dog_professional_access FOR SELECT
  USING (auth.uid() = professional_id);

CREATE POLICY "Professionals can create access requests"
  ON public.dog_professional_access FOR INSERT
  WITH CHECK (auth.uid() = professional_id);

CREATE POLICY "Owners can update access requests for their dogs"
  ON public.dog_professional_access FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.dogs
      WHERE dogs.id = dog_professional_access.dog_id
        AND dogs.owner_id = auth.uid()
    )
  );

CREATE POLICY "Professionals can update their own access requests"
  ON public.dog_professional_access FOR UPDATE
  USING (auth.uid() = professional_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_professional_profiles_updated_at
  BEFORE UPDATE ON public.professional_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dog_owner_profiles_updated_at
  BEFORE UPDATE ON public.dog_owner_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dogs_updated_at
  BEFORE UPDATE ON public.dogs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dog_professional_access_updated_at
  BEFORE UPDATE ON public.dog_professional_access
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create triggers to auto-create profiles on user signup
CREATE OR REPLACE FUNCTION public.handle_new_professional()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.professional_profiles (id, full_name, email, profession, zone)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email,
    NEW.raw_user_meta_data->>'profession',
    NEW.raw_user_meta_data->>'zone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.handle_new_guardian()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.dog_owner_profiles (id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to route new users based on their role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.raw_user_meta_data->>'role' = 'professional' THEN
    PERFORM public.handle_new_professional();
  ELSIF NEW.raw_user_meta_data->>'role' = 'guardian' THEN
    PERFORM public.handle_new_guardian();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();