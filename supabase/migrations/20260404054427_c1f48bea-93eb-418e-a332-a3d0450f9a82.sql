
CREATE TABLE public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published articles"
ON public.articles
FOR SELECT
USING (published = true);

CREATE POLICY "Authors can view their own articles"
ON public.articles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create articles"
ON public.articles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authors can update their own articles"
ON public.articles
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Authors can delete their own articles"
ON public.articles
FOR DELETE
USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_articles_updated_at
BEFORE UPDATE ON public.articles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
