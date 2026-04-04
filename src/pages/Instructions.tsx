import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star, Eye, Bookmark } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Article {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

const COLORS = ["#FFF8E1", "#E8EAF6", "#FFEBEE", "#FCE4EC", "#E0F7FA", "#F3E5F5", "#E8F5E9", "#FFF3E0"];

const InstructionCard = ({ article, index }: { article: Article; index: number }) => (
  <Link to={`/instructions/${article.id}`} className="flex flex-col gap-3 w-full group">
    {/* Image area */}
    <div
      className="relative w-full aspect-[328/181] rounded-[10px] overflow-hidden group-hover:opacity-90 transition-opacity"
      style={{ background: COLORS[index % COLORS.length] }}
    >
      <div className="absolute top-1 right-1">
        <button
          onClick={(e) => e.preventDefault()}
          className="w-[38px] h-[38px] rounded-full bg-white flex items-center justify-center"
        >
          <Bookmark className="w-[14px] h-[14px] text-foreground" strokeWidth={1.5} />
        </button>
      </div>
    </div>

    {/* Category chip */}
    <div className="flex items-center gap-1.5 px-2 py-[5px] rounded-md w-fit" style={{ background: "#F7F7F8" }}>
      <span className="grid grid-cols-2 gap-[1px] w-[10px] h-[10px]">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="w-full h-full rounded-[1px]" style={{ background: "#464646" }} />
        ))}
      </span>
      <span className="text-[14px] font-normal leading-none" style={{ color: "#464646" }}>
        Инструкция
      </span>
    </div>

    {/* Title */}
    <p className="text-[20px] font-normal leading-[90%] group-hover:text-primary transition-colors" style={{ color: "#000000" }}>
      {article.title || "Без названия"}
    </p>

    {/* Date + meta */}
    <div className="flex items-center gap-1.5">
      <span className="text-[14px] font-normal leading-none" style={{ color: "#8D8D8D" }}>
        {new Date(article.created_at).toLocaleDateString("ru-RU")}
      </span>
    </div>
  </Link>
);

const Instructions = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("articles")
      .select("id, title, content, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setArticles(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-h1 text-foreground mb-6">Инструкции</h1>

        {loading ? (
          <p className="text-body-14 text-muted-foreground">Загрузка...</p>
        ) : articles.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border p-12 text-center">
            <p className="text-body-14 text-muted-foreground">Пока нет опубликованных инструкций</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <InstructionCard key={article.id} article={article} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Instructions;
