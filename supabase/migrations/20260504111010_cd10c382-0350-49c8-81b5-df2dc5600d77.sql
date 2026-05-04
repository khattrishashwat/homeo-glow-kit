-- Allow public to read slot availability (only minimal columns are visible via app code; column-level perms via RLS still expose row but app selects only safe cols)
CREATE POLICY "Anyone can view slot availability"
ON public.appointments
FOR SELECT
TO anon, authenticated
USING (status <> 'cancelled');

-- Prevent double-booking: same day + slot + mode cannot exist twice (excluding cancelled)
CREATE UNIQUE INDEX appointments_unique_active_slot
ON public.appointments (preferred_day, preferred_slot, mode)
WHERE status <> 'cancelled';