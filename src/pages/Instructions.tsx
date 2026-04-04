import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Eye, Bookmark, LinkIcon, ChevronUp, ChevronDown, Check, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import avatarSychev from "@/assets/avatar-sychev.jpg";
import avatarAnna from "@/assets/avatar-anna.jpg";
import avatarDmitry from "@/assets/avatar-dmitry.jpg";
import avatarAlex from "@/assets/avatar-alex.jpg";
import img3dSecurity from "@/assets/3d-security.png";
import img3dNft from "@/assets/3d-nft.png";
import img3dRocket from "@/assets/3d-rocket.png";
import img3dCoin from "@/assets/3d-coin.png";

type Category = "all" | "ai" | "crypto";

interface CardData {
  id: string;
  title: string;
  author: string;
  avatar: string;
  borderColor: string;
  views: number;
  gradient: string;
  image?: string;
  isDbArticle: boolean;
  category: Category;
}

const STATIC_CARDS: CardData[] = [
  {
    id: "static-1",
    title: "Как настроить Open Claw на сервере?",
    author: "Dmitry Volkov",
    avatar: avatarDmitry,
    borderColor: "#BF96FF",
    views: 3104,
    gradient: "linear-gradient(180deg, #E8DCFB 0%, #7B2FBE 100%)",
    image: img3dSecurity,
    isDbArticle: false,
    category: "crypto",
  },
  {
    id: "static-2",
    title: "Безопасность в Web3",
    author: "Dmitry Volkov",
    avatar: avatarDmitry,
    borderColor: "#BF96FF",
    views: 3104,
    gradient: "linear-gradient(180deg, #E8DCFB 0%, #7B2FBE 100%)",
    image: img3dSecurity,
    isDbArticle: false,
    category: "crypto",
  },
  {
    id: "static-3",
    title: "Безопасность в Web3",
    author: "Dmitry Volkov",
    avatar: avatarDmitry,
    borderColor: "#BF96FF",
    views: 3104,
    gradient: "linear-gradient(180deg, #E8DCFB 0%, #7B2FBE 100%)",
    image: img3dSecurity,
    isDbArticle: false,
    category: "crypto",
  },
  {
    id: "static-4",
    title: "Безопасность в Web3",
    author: "Dmitry Volkov",
    avatar: avatarDmitry,
    borderColor: "#BF96FF",
    views: 3104,
    gradient: "linear-gradient(180deg, #E8DCFB 0%, #7B2FBE 100%)",
    image: img3dSecurity,
    isDbArticle: false,
    category: "crypto",
  },
];

const InstructionCard = ({ card, bookmarked, onToggleBookmark }: { card: CardData; bookmarked: boolean; onToggleBookmark: (id: string) => void }) => {
  const { t } = useLanguage();

  return (
    <Link to={`/instructions/${card.id}`} className="flex flex-col w-full md:w-[280px] md:min-w-[280px] group cursor-pointer rounded-xl overflow-hidden transition-transform duration-200 hover:-translate-y-1" style={{ background: card.gradient, boxShadow: `inset 0 0 0 2px ${card.borderColor}25` }}>
      <div className="relative w-full aspect-[328/181] group-hover:opacity-90 transition-opacity flex items-center justify-center">
        {card.image && (
          <img src={card.image} alt="" className="w-full h-full object-contain" loading="lazy" />
        )}
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <button onClick={(e: React.MouseEvent) => { e.preventDefault(); navigator.clipboard.writeText(`${window.location.origin}/instructions/${card.id}`); toast.success(t("instructions.linkCopied")); }} className="w-[28px] h-[28px] rounded-full bg-white/60 flex items-center justify-center hover:bg-white/80 transition-colors">
            <LinkIcon className="w-[12px] h-[12px] text-foreground" strokeWidth={1.5} />
          </button>
          <button onClick={(e: React.MouseEvent) => { e.preventDefault(); onToggleBookmark(card.id); }} className="w-[28px] h-[28px] rounded-full bg-white/60 flex items-center justify-center hover:bg-white/80 transition-colors">
            <Bookmark className={`w-[12px] h-[12px] transition-colors ${bookmarked ? 'text-foreground fill-foreground' : 'text-foreground'}`} strokeWidth={1.5} />
          </button>
        </div>
      </div>
      <div className="flex flex-col flex-1 px-4 pb-4 items-center">
        <div className="flex-1 flex items-center">
          <p className="text-[18px] md:text-[21px] font-normal leading-[100%] text-center transition-transform duration-200 group-hover:-translate-y-1 text-violet-100">{card.title}</p>
        </div>
        <div className="mt-3 flex items-center gap-3 px-2 py-[5px] rounded-md w-fit" style={{ background: "rgba(255,255,255,0.25)" }}>
          <div className="flex items-center gap-2">
            <img src={card.avatar} alt={card.author} className="w-5 h-5 rounded-full object-cover" style={{ border: `1.5px solid rgba(255,255,255,0.5)` }} loading="lazy" width={20} height={20} />
            <span className="text-[14px] font-normal leading-none text-white/90">{card.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-[14px] h-[14px] text-white/80" strokeWidth={1.75} />
            <span className="text-[14px] font-normal leading-none text-white/80">{card.views}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

type SortOption = "newest" | "popular";

const Instructions = () => {
  const { t } = useLanguage();
  const SORT_LABELS: Record<SortOption, string> = {
    newest: t("instructions.newest"),
    popular: t("instructions.popular"),
  };

  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortOption>("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("q") || "";
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [showFavorites, setShowFavorites] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("instruction-bookmarks");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      localStorage.setItem("instruction-bookmarks", JSON.stringify([...next]));
      return next;
    });
  };

  useEffect(() => {
    supabase
      .from("articles")
      .select("id, title, content, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setCards([...STATIC_CARDS]);
        setLoading(false);
      });
  }, []);

  const filteredCards = cards
    .filter((card) => card.title.toLowerCase().includes(search.toLowerCase()))
    .filter((card) => !showFavorites || bookmarkedIds.has(card.id))
    .filter((card) => activeCategory === "all" || card.category === activeCategory);

  const sortedCards = [...filteredCards].sort((a, b) => {
    if (sort === "popular") return b.views - a.views;
    return 0;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-8">
        <div className="mb-6">
          {/* Desktop: single row | Mobile: stacked */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            {/* First row: tabs + mobile icons */}
            <div className="flex items-center justify-between md:justify-start gap-2 md:gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                  <button
                    onClick={() => setShowFavorites(false)}
                    className={`px-4 md:px-4 py-2 md:py-2 rounded-md text-[16px] md:text-[15px] transition-colors ${!showFavorites ? 'bg-background text-foreground shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    {t("instructions.all")}
                  </button>
                  <button
                    onClick={() => setShowFavorites(true)}
                    className={`px-4 md:px-4 py-2 md:py-2 rounded-md text-[16px] md:text-[15px] transition-colors flex items-center gap-1.5 ${showFavorites ? 'bg-background text-foreground shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <Bookmark className="w-4 h-4" strokeWidth={1.5} />
                    {t("instructions.favorites")}
                    {bookmarkedIds.size > 0 && (
                      <span className="text-caption-12 text-muted-foreground">{bookmarkedIds.size}</span>
                    )}
                  </button>
                </div>

                {/* Mobile: filter icon with dropdown */}
                <div className="relative md:hidden">
                  <button
                    onClick={() => { setFilterOpen(!filterOpen); setSortOpen(false); }}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${activeCategory !== "all" ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
                  >
                    <SlidersHorizontal className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                  {filterOpen && (
                    <div className="absolute right-0 top-full mt-2 bg-background border border-border rounded-2xl shadow-lg py-2 min-w-[200px] z-50">
                      {(["all", "ai", "crypto"] as Category[]).map((cat) => {
                        const label = cat === "all" ? t("instructions.all") : cat === "ai" ? t("instructions.aiSkills") : t("instructions.cryptoBasics");
                        return (
                          <button
                            key={cat}
                            onClick={() => { setActiveCategory(cat); setFilterOpen(false); }}
                            className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors rounded-xl mx-auto ${activeCategory === cat ? '' : 'hover:bg-primary hover:text-primary-foreground'}`}
                            style={{ width: 'calc(100% - 8px)', marginLeft: 4, marginRight: 4 }}
                          >
                            <span className={`text-body-14 font-medium ${activeCategory === cat ? 'text-primary' : ''}`}>{label}</span>
                            {activeCategory === cat && <Check className="w-4 h-4 text-primary" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile: sort icon (right side) */}
              <div className="relative md:hidden">
                <button
                  onClick={() => { setSortOpen(!sortOpen); setFilterOpen(false); }}
                  className="w-10 h-10 rounded-lg flex items-center justify-center bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowUpDown className="w-5 h-5" strokeWidth={1.5} />
                </button>
                {sortOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-background border border-border rounded-2xl shadow-lg py-2 min-w-[200px] z-50">
                    {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => { setSort(key); setSortOpen(false); }}
                        className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors rounded-xl mx-auto ${sort === key ? '' : 'hover:bg-primary hover:text-primary-foreground'}`}
                        style={{ width: 'calc(100% - 8px)', marginLeft: 4, marginRight: 4 }}
                      >
                        <span className={`text-body-14 font-medium ${sort === key ? 'text-primary' : ''}`}>{label}</span>
                        {sort === key && <Check className="w-4 h-4 text-primary" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Desktop: category buttons */}
              <div className="hidden md:flex items-center gap-2">
                {(["ai", "crypto"] as Category[]).map((cat) => {
                  const isActive = activeCategory === cat;
                  const label = cat === "ai" ? t("instructions.aiSkills") : t("instructions.cryptoBasics");
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(isActive ? "all" : cat)}
                      className={`px-6 py-2.5 rounded-lg text-[16px] font-medium transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
                    >
                      {label}
                    </button>
                  );
                })}
                {activeCategory !== "all" && (
                  <button
                    onClick={() => setActiveCategory("all")}
                    className="px-6 py-2.5 rounded-lg text-[16px] bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t("instructions.reset")}
                  </button>
                )}
              </div>
            </div>

            {/* Desktop: sort button */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-background hover:bg-muted transition-colors"
              >
                <span className="text-[16px] text-muted-foreground">{t("instructions.sort")}</span>
                <span className="text-[16px] font-medium text-foreground">{SORT_LABELS[sort]}</span>
                {sortOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full mt-2 bg-background border border-border rounded-2xl shadow-lg py-2 min-w-[200px] z-50">
                  {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => { setSort(key); setSortOpen(false); }}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors rounded-xl mx-auto ${sort === key ? '' : 'hover:bg-primary hover:text-primary-foreground'}`}
                      style={{ width: 'calc(100% - 8px)', marginLeft: 4, marginRight: 4 }}
                    >
                      <span className={`text-body-14 font-medium ${sort === key ? 'text-primary' : ''}`}>{label}</span>
                      {sort === key && <Check className="w-4 h-4 text-primary" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-body-14 text-muted-foreground">{t("instructions.loading")}</p>
        ) : sortedCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Bookmark className="w-10 h-10 text-muted-foreground/40 mb-3" />
            <p className="text-body-14 text-muted-foreground">
              {showFavorites ? t("instructions.noFavorites") : t("instructions.notFound")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap md:gap-6">
            {sortedCards.map((card) => (
              <InstructionCard key={card.id} card={card} bookmarked={bookmarkedIds.has(card.id)} onToggleBookmark={toggleBookmark} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Instructions;
