
-- 1) Drop the overly-permissive SELECT policy that exposed PII
DROP POLICY IF EXISTS "Anyone can view slot availability" ON public.appointments;

-- 2) Tighten INSERT policy to lock status to 'pending'
DROP POLICY IF EXISTS "Anyone can create an appointment" ON public.appointments;

CREATE POLICY "Anyone can create an appointment"
ON public.appointments
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(name) >= 2 AND length(name) <= 100
  AND length(phone) >= 10 AND length(phone) <= 15
  AND age >= 1 AND age <= 120
  AND length(city) >= 2 AND length(city) <= 100
  AND length(problem) >= 2 AND length(problem) <= 100
  AND mode = ANY (ARRAY['Online'::text, 'Clinic Visit'::text])
  AND length(preferred_day) >= 1 AND length(preferred_day) <= 50
  AND length(preferred_slot) >= 1 AND length(preferred_slot) <= 50
  AND status = 'pending'
);

-- 3) Create a PII-free view for slot availability
CREATE OR REPLACE VIEW public.slot_availability
WITH (security_invoker = true)
AS
SELECT preferred_day, preferred_slot, mode
FROM public.appointments
WHERE status <> 'cancelled';

GRANT SELECT ON public.slot_availability TO anon, authenticated;
