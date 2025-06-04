
CREATE OR REPLACE FUNCTION public.get_activities()
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  date date,
  location text,
  image_url text,
  uploaded_by uuid,
  uploader_name text,
  created_at timestamp with time zone
)
LANGUAGE sql
STABLE
AS $$
  SELECT 
    a.id,
    a.title,
    a.description,
    a.date,
    a.location,
    a.image_url,
    a.uploaded_by,
    a.uploader_name,
    a.created_at
  FROM public.activities a
  ORDER BY a.created_at DESC;
$$;
