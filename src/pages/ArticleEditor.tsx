import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import RichTextEditor from "@/components/RichTextEditor";
import type { User } from "@supabase/supabase-js";

const ArticleEditor = () => {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (!u) navigate("/auth");
    });
  }, [navigate]);

  useEffect(() => {
    if (!isNew && user) {
      supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single()
        .then(({ data, error }) => {
          if (error || !data) {
            toast.error("Статья не найдена");
            navigate("/articles");
          } else {
            setTitle(data.title);
            setContent(data.content);
            setPublished(data.published);
            setLoaded(true);
          }
        });
    } else {
      setLoaded(true);
    }
  }, [id, isNew, user, navigate]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      if (isNew) {
        const { error } = await supabase.from("articles").insert({
          user_id: user.id,
          title,
          content,
          published,
        });
        if (error) throw error;
        toast.success("Статья создана");
        navigate("/articles");
      } else {
        const { error } = await supabase
          .from("articles")
          .update({ title, content, published })
          .eq("id", id);
        if (error) throw error;
        toast.success("Статья сохранена");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (!loaded) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/articles")}
          className="text-body-14"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Назад
        </Button>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-body-14 text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="rounded border-border"
            />
            Опубликовать
          </label>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary hover:bg-violet-dark text-btn-medium"
          >
            <Save className="w-4 h-4 mr-1" />
            {saving ? "Сохранение..." : "Сохранить"}
          </Button>
        </div>
      </div>

      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Заголовок статьи"
        className="text-h2 border-none shadow-none px-0 mb-4 focus-visible:ring-0 placeholder:text-muted-foreground/50"
      />

      <RichTextEditor
        content={content}
        onChange={setContent}
        placeholder="Начните писать статью..."
      />
    </div>
  );
};

export default ArticleEditor;
