CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  age INTEGER NOT NULL,
  city TEXT NOT NULL,
  problem TEXT NOT NULL,
  mode TEXT NOT NULL,
  preferred_day TEXT NOT NULL,
  preferred_slot TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create an appointment"
  ON public.appointments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(name) BETWEEN 2 AND 100
    AND length(phone) BETWEEN 10 AND 15
    AND age BETWEEN 1 AND 120
    AND length(city) BETWEEN 2 AND 100
    AND length(problem) BETWEEN 2 AND 100
    AND mode IN ('Online','Clinic Visit')
    AND length(preferred_day) BETWEEN 1 AND 50
    AND length(preferred_slot) BETWEEN 1 AND 50
  );