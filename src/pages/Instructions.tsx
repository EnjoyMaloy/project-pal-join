import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Bookmark, LinkIcon, ChevronUp, ChevronDown, Check, Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import avatarSychev from "@/assets/avatar-sychev.jpg";
import avatarAnna from "@/assets/avatar-anna.jpg";
import avatarDmitry from "@/assets/avatar-dmitry.jpg";
import avatarAlex from "@/assets/avatar-alex.jpg";
import img3dSecurity from "@/assets/3d-security.png";
import img3dNft from "@/assets/3d-nft.png";
import img3dRocket from "@/assets/3d-rocket.png";
import img3dCoin from "@/assets/3d-coin.png";

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
}

const STATIC_CARDS: CardData[] = [
  {
    id: "static-1",
    title: "Безопасность в Web3",
    author: "Dmitry Volkov",
    avatar: avatarDmitry,
    borderColor: "#C62828",
    views: 3104,
    gradient: "linear-gradient(180deg, #FFCDD2 0%, #C62828 100%)",
    image: img3dSecurity,
    isDbArticle: false,
  },
  {
    id: "static-2",
    title: "Анализ NFT проектов",
    author: "Alex Kim",
    avatar: avatarAlex,
    borderColor: "#00695C",
    views: 956,
    gradient: "linear-gradient(180deg, #B2EBF2 0%, #00695C 100%)",
    image: img3dNft,
    isDbArticle: false,
  },
  {
    id: "static-3",
    title: "Запуск токена",
    author: "Anna Petrova",
    avatar: avatarAnna,
    borderColor: "#F57F17",
    views: 1842,
    gradient: "linear-gradient(180deg, #FFF9C4 0%, #F57F17 100%)",
    image: img3dCoin,
    isDbArticle: false,
  },
  {
    id: "static-4",
    title: "Настройка TON Wallet",
    author: "Sychev Pavel",
    avatar: avatarSychev,
    borderColor: "#6A1B9A",
    views: 2738,
    gradient: "linear-gradient(180deg, #E1BEE7 0%, #6A1B9A 100%)",
    image: img3dRocket,
    isDbArticle: false,
  },
];

const InstructionCard = ({ card }: { card: CardData }) => {
  const [bookmarked, setBookmarked] = useState(false);
  const Wrapper = card.isDbArticle ? Link : ("div" as any);
  const wrapperProps = card.isDbArticle ? { to: `/instructions/${card.id}` } : {};

  return (
    <Wrapper {...wrapperProps} className="flex flex-col w-[280px] min-w-[280px] group cursor-pointer rounded-xl overflow-hidden transition-transform duration-200 hover:-translate-y-1" style={{ background: card.gradient, boxShadow: `inset 0 0 0 2px ${card.borderColor}25` }}>
      <div className="relative w-full aspect-[328/181] group-hover:opacity-90 transition-opacity flex items-center justify-center">
        {card.image && (
          <img src={card.image} alt="" className="w-full h-full object-contain p-4" loading="lazy" />
        )}
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <button onClick={(e: React.MouseEvent) => { e.preventDefault(); navigator.clipboard.writeText(`${window.location.origin}/instructions/${card.id}`); toast.success("Ссылка скопирована"); }} className="w-[32px] h-[32px] rounded-full bg-white/60 flex items-center justify-center hover:bg-white/80 transition-colors">
            <LinkIcon className="w-[13px] h-[13px] text-foreground" strokeWidth={1.5} />
          </button>
          <button onClick={(e: React.MouseEvent) => { e.preventDefault(); setBookmarked(!bookmarked); }} className="w-[32px] h-[32px] rounded-full bg-white/60 flex items-center justify-center hover:bg-white/80 transition-colors">
            <Bookmark className={`w-[13px] h-[13px] transition-colors ${bookmarked ? 'text-foreground fill-foreground' : 'text-foreground'}`} strokeWidth={1.5} />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3 px-4 pb-4 items-center">
        <p className="text-[20px] font-normal leading-[90%] text-center text-white transition-transform duration-200 group-hover:-translate-y-1">{card.title}</p>
        <div className="flex items-center gap-3 px-2 py-[5px] rounded-md w-fit" style={{ background: "rgba(255,255,255,0.25)" }}>
          <div className="flex items-center gap-2">
            <img src={card.avatar} alt={card.author} className="w-5 h-5 rounded-full object-cover" style={{ border: `1.5px solid rgba(255,255,255,0.5)` }} loading="lazy" width={20} height={20} />
            <span className="text-[14px] font-normal leading-none text-white/90">{card.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-[14px] h-[14px] text-white/80" strokeWidth={1.25} />
            <span className="text-[14px] font-normal leading-none text-white/80">{card.views}</span>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

type SortOption = "newest" | "popular" | "rating";

const SORT_LABELS: Record<SortOption, string> = {
  newest: "Сначала новые",
  popular: "Популярные",
  rating: "Высокий рейтинг",
};

const Instructions = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortOption>("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [search, setSearch] = useState("");

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

  const filteredCards = cards.filter((card) =>
    card.title.toLowerCase().includes(search.toLowerCase())
  );

  const sortedCards = [...filteredCards].sort((a, b) => {
    if (sort === "popular") return b.views - a.views;
    return 0;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6">
          <div className="relative w-full mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Найти инструкцию..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-muted border-none text-body-14 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>
          <div className="flex items-center justify-between">
          <h1 className="text-h1 text-foreground">Инструкции</h1>

          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-background hover:bg-muted transition-colors"
            >
              <span className="text-body-14 text-muted-foreground">Сортировка:</span>
              <span className="text-body-14 font-medium text-foreground">{SORT_LABELS[sort]}</span>
              {sortOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>

            {sortOpen && (
              <div className="absolute right-0 top-full mt-2 bg-background border border-border rounded-xl shadow-lg py-2 min-w-[200px] z-50">
                {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => { setSort(key); setSortOpen(false); }}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-muted transition-colors"
                  >
                    <span className={`text-body-14 ${sort === key ? 'text-primary font-medium' : 'text-foreground'}`}>{label}</span>
                    {sort === key && <Check className="w-4 h-4 text-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>
          </div>
        </div>

        {loading ? (
          <p className="text-body-14 text-muted-foreground">Загрузка...</p>
        ) : (
          <div className="flex flex-wrap gap-6">
            {sortedCards.map((card) => (
              <InstructionCard key={card.id} card={card} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Instructions;
