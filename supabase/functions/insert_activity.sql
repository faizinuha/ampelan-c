
CREATE OR REPLACE FUNCTION public.insert_activity(
  p_title text,
  p_description text,
  p_date text,
  p_location text,
  p_image_url text,
  p_uploaded_by uuid,
  p_uploader_name text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  activity_id uuid;
BEGIN
  INSERT INTO public.activities (
    title,
    description,
    date,
    location,
    image_url,
    uploaded_by,
    uploader_name
  )
  VALUES (
    p_title,
    p_description,
    p_date::date,
    p_location,
    p_image_url,
    p_uploaded_by,
    p_uploader_name
  )
  RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$;
