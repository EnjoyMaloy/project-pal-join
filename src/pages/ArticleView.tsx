import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Article {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

const ArticleView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("articles")
      .select("id, title, content, created_at")
      .eq("id", id)
      .eq("published", true)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          navigate("/instructions");
        } else {
          setArticle(data);
        }
        setLoading(false);
      });
  }, [id, navigate]);

  if (loading) return null;
  if (!article) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate("/instructions")}
        className="text-body-14 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Назад к инструкциям
      </Button>

      <h1 className="text-h1 text-foreground mb-2">{article.title}</h1>
      <p className="text-caption-12 text-muted-foreground mb-8">
        {new Date(article.created_at).toLocaleDateString("ru-RU")}
      </p>

      <article
        className="prose prose-neutral max-w-none text-body-14 text-foreground/80 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </div>
  );
};

export default ArticleView;
