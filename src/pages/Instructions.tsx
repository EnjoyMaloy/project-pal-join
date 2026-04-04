import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Bookmark, LinkIcon } from "lucide-react";
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
    borderColor: "#B8C4D0",
    views: 2738,
    gradient: "linear-gradient(180deg, #E1BEE7 0%, #6A1B9A 100%)",
    image: img3dRocket,
    isDbArticle: false,
  },
];

const InstructionCard = ({ card }: { card: CardData }) => {
  const Wrapper = card.isDbArticle ? Link : ("div" as any);
  const wrapperProps = card.isDbArticle ? { to: `/instructions/${card.id}` } : {};

  return (
    <Wrapper {...wrapperProps} className="flex flex-col w-[280px] min-w-[280px] group cursor-pointer rounded-xl overflow-hidden transition-transform duration-200 hover:-translate-y-1" style={{ background: card.gradient, border: `2px solid ${card.borderColor}` }}>
      <div className="relative w-full aspect-[328/181] group-hover:opacity-90 transition-opacity flex items-center justify-center">
        {card.image && (
          <img src={card.image} alt="" className="w-full h-full object-contain p-4" loading="lazy" />
        )}
        <div className="absolute top-1 right-1 flex items-center gap-1">
          <button onClick={(e: React.MouseEvent) => { e.preventDefault(); navigator.clipboard.writeText(`${window.location.origin}/instructions/${card.id}`); toast.success("Ссылка скопирована"); }} className="w-[38px] h-[38px] rounded-full bg-white/60 flex items-center justify-center hover:bg-white/80 transition-colors">
            <LinkIcon className="w-[14px] h-[14px] text-foreground" strokeWidth={1.5} />
          </button>
          <button onClick={(e: React.MouseEvent) => e.preventDefault()} className="w-[38px] h-[38px] rounded-full bg-white/60 flex items-center justify-center">
            <Bookmark className="w-[14px] h-[14px] text-foreground" strokeWidth={1.5} />
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

const Instructions = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("articles")
      .select("id, title, content, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        const dbCards: CardData[] = (data || []).map((a) => ({
          id: a.id,
          title: a.title || "Без названия",
          author: "Sychev Pavel",
          avatar: avatarSychev,
          borderColor: "#B8C4D0",
          views: 2738,
          gradient: "linear-gradient(180deg, #FFF8E1 0%, #E65100 100%)",
          isDbArticle: true,
        }));
        setCards([...STATIC_CARDS]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-h1 text-foreground mb-6">Инструкции</h1>

        {loading ? (
          <p className="text-body-14 text-muted-foreground">Загрузка...</p>
        ) : (
          <div className="flex flex-wrap gap-6">
            {cards.map((card) => (
              <InstructionCard key={card.id} card={card} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Instructions;
