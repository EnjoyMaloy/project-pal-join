import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

interface Article {
  id: string;
  title: string;
  content: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchArticles();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) {
      toast.error("Ошибка загрузки статей");
    } else {
      setArticles(data || []);
    }
    setLoading(false);
  };

  const deleteArticle = async (id: string) => {
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) {
      toast.error("Ошибка удаления");
    } else {
      setArticles((prev) => prev.filter((a) => a.id !== id));
      toast.success("Статья удалена");
    }
  };

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h1 className="text-h2 text-foreground mb-4">Статьи</h1>
        <p className="text-body-14 text-muted-foreground mb-6">
          Войдите, чтобы создавать и управлять статьями
        </p>
        <Link to="/auth">
          <Button className="bg-primary hover:bg-violet-dark">Войти</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-h2 text-foreground">Мои статьи</h1>
        <Button
          onClick={() => navigate("/articles/new")}
          className="bg-primary hover:bg-violet-dark text-btn-medium"
        >
          <Plus className="w-4 h-4 mr-1" />
          Новая статья
        </Button>
      </div>

      {loading ? (
        <p className="text-body-14 text-muted-foreground">Загрузка...</p>
      ) : articles.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-12 text-center">
          <p className="text-body-14 text-muted-foreground mb-4">У вас пока нет статей</p>
          <Button
            onClick={() => navigate("/articles/new")}
            className="bg-primary hover:bg-violet-dark text-btn-medium"
          >
            Создать первую статью
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-card rounded-xl border border-border p-4 flex items-center justify-between hover:bg-violet-super-light transition-colors"
            >
              <div className="min-w-0 flex-1">
                <h3 className="text-subh-16-medium text-foreground truncate">
                  {article.title || "Без названия"}
                </h3>
                <p className="text-caption-12 text-muted-foreground mt-1">
                  {new Date(article.updated_at).toLocaleDateString("ru-RU")} ·{" "}
                  {article.published ? "Опубликована" : "Черновик"}
                </p>
              </div>
              <div className="flex items-center gap-1 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/articles/${article.id}`)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteArticle(article.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Articles;
