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

interface Article {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

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
    title: "Настройка TON Wallet",
    author: "Anna Petrova",
    avatar: avatarAnna,
    borderColor: "#C9A87C",
    views: 1842,
    gradient: "linear-gradient(135deg, #E8EAF6 0%, #C5CAE9 100%)",
    isDbArticle: false,
  },
  {
    id: "static-2",
    title: "Безопасность в Web3",
    author: "Dmitry Volkov",
    avatar: avatarDmitry,
    borderColor: "#7B9EBF",
    views: 3104,
    gradient: "linear-gradient(180deg, #FFCDD2 0%, #C62828 100%)",
    image: img3dSecurity,
    isDbArticle: false,
  },
  {
    id: "static-3",
    title: "Анализ NFT проектов",
    author: "Alex Kim",
    avatar: avatarAlex,
    borderColor: "#6B7B8D",
    views: 956,
    gradient: "linear-gradient(180deg, #B2EBF2 0%, #00695C 100%)",
    image: img3dNft,
    isDbArticle: false,
  },
];

const CardVariant1 = ({ card, wrapperProps, Wrapper }: { card: CardData; wrapperProps: any; Wrapper: any }) => (
  <Wrapper {...wrapperProps} className="flex flex-col gap-3 w-full group cursor-pointer">
    <div
      className="relative w-full aspect-[328/181] rounded-[10px] overflow-hidden group-hover:opacity-90 transition-opacity"
      style={{ background: card.gradient }}
    >
      <div className="absolute top-1 right-1 flex items-center gap-1">
        <button onClick={(e: React.MouseEvent) => { e.preventDefault(); navigator.clipboard.writeText(`${window.location.origin}/instructions/${card.id}`); toast.success("Ссылка скопирована"); }} className="w-[38px] h-[38px] rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors">
          <LinkIcon className="w-[14px] h-[14px] text-foreground" strokeWidth={1.5} />
        </button>
        <button onClick={(e: React.MouseEvent) => e.preventDefault()} className="w-[38px] h-[38px] rounded-full bg-white flex items-center justify-center">
          <Bookmark className="w-[14px] h-[14px] text-foreground" strokeWidth={1.5} />
        </button>
      </div>
    </div>
    <div className="flex items-center gap-3 px-2 py-[5px] rounded-md w-fit" style={{ background: "#F7F7F8" }}>
      <div className="flex items-center gap-2">
        <img src={card.avatar} alt={card.author} className="w-5 h-5 rounded-full object-cover" style={{ border: `1.5px solid ${card.borderColor}` }} loading="lazy" width={20} height={20} />
        <span className="text-[14px] font-normal leading-none" style={{ color: "#464646" }}>{card.author}</span>
      </div>
      <div className="flex items-center gap-1">
        <Eye className="w-[14px] h-[14px]" style={{ color: "#464646" }} strokeWidth={1.25} />
        <span className="text-[14px] font-normal leading-none" style={{ color: "#464646" }}>{card.views}</span>
      </div>
    </div>
    <p className="text-[20px] font-normal leading-[90%] group-hover:text-primary transition-colors" style={{ color: "#000000" }}>{card.title}</p>
  </Wrapper>
);

const CardVariant2 = ({ card, wrapperProps, Wrapper }: { card: CardData; wrapperProps: any; Wrapper: any }) => (
  <Wrapper {...wrapperProps} className="flex flex-col w-full group cursor-pointer rounded-xl overflow-hidden" style={{ background: card.gradient }}>
    <div className="relative w-full aspect-[328/181] group-hover:opacity-90 transition-opacity">
      <div className="absolute top-1 right-1 flex items-center gap-1">
        <button onClick={(e: React.MouseEvent) => { e.preventDefault(); navigator.clipboard.writeText(`${window.location.origin}/instructions/${card.id}`); toast.success("Ссылка скопирована"); }} className="w-[38px] h-[38px] rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors">
          <LinkIcon className="w-[14px] h-[14px] text-foreground" strokeWidth={1.5} />
        </button>
        <button onClick={(e: React.MouseEvent) => e.preventDefault()} className="w-[38px] h-[38px] rounded-full bg-white flex items-center justify-center">
          <Bookmark className="w-[14px] h-[14px] text-foreground" strokeWidth={1.5} />
        </button>
      </div>
    </div>
    <div className="flex flex-col gap-3 px-4 pb-4">
      <div className="flex items-center gap-3 px-2 py-[5px] rounded-md w-fit" style={{ background: "rgba(255,255,255,0.6)" }}>
        <div className="flex items-center gap-2">
          <img src={card.avatar} alt={card.author} className="w-5 h-5 rounded-full object-cover" style={{ border: `1.5px solid ${card.borderColor}` }} loading="lazy" width={20} height={20} />
          <span className="text-[14px] font-normal leading-none" style={{ color: "#464646" }}>{card.author}</span>
        </div>
        <div className="flex items-center gap-1">
          <Eye className="w-[14px] h-[14px]" style={{ color: "#464646" }} strokeWidth={1.25} />
          <span className="text-[14px] font-normal leading-none" style={{ color: "#464646" }}>{card.views}</span>
        </div>
      </div>
      <p className="text-[20px] font-normal leading-[90%] group-hover:text-primary transition-colors" style={{ color: "#000000" }}>{card.title}</p>
    </div>
  </Wrapper>
);

const CardVariant3 = ({ card, wrapperProps, Wrapper }: { card: CardData; wrapperProps: any; Wrapper: any }) => (
  <Wrapper {...wrapperProps} className="flex flex-col w-full group cursor-pointer rounded-xl overflow-hidden" style={{ background: card.gradient }}>
    <div className="relative w-full aspect-[328/181] group-hover:opacity-90 transition-opacity flex items-center justify-center">
      {card.image && (
        <img src={card.image} alt="" className="w-full h-full object-cover" loading="lazy" />
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
      <p className="text-[20px] font-normal leading-[90%] text-center text-white group-hover:opacity-80 transition-opacity">{card.title}</p>
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

const InstructionCard = ({ card, index }: { card: CardData; index: number }) => {
  const Wrapper = card.isDbArticle ? Link : "div";
  const wrapperProps = card.isDbArticle ? { to: `/instructions/${card.id}` } : {};

  if (index === 0) return <CardVariant1 card={card} wrapperProps={wrapperProps} Wrapper={Wrapper} />;
  if (index === 1) return <CardVariant2 card={card} wrapperProps={wrapperProps} Wrapper={Wrapper} />;
  return <CardVariant3 card={card} wrapperProps={wrapperProps} Wrapper={Wrapper} />;
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
          gradient: "linear-gradient(135deg, #FFF8E1 0%, #FFE082 100%)",
          isDbArticle: true,
        }));
        setCards([...dbCards, ...STATIC_CARDS]);
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, index) => (
              <InstructionCard key={card.id} card={card} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Instructions;
