import { Star, Users, Bookmark } from "lucide-react";

const instructionsData = [
  {
    id: 1,
    title: "Meme Coins from A to Z",
    category: "Meme Coins & NFTs",
    rating: 4.8,
    students: 2738,
    tags: ["NEW", "Trending"],
    bgColor: "#FFF8E1",
  },
  {
    id: 2,
    title: "Secrets of the TON Blockchain",
    category: "Telegram & TON",
    rating: 4.9,
    students: 2738,
    tags: ["Trending"],
    bgColor: "#E8EAF6",
  },
  {
    id: 3,
    title: "Scam in Web3: How to Protect Yourself",
    category: "Financial Security",
    rating: 4.7,
    students: 2738,
    tags: [],
    bgColor: "#FFEBEE",
  },
  {
    id: 4,
    title: "Project Analysis & Investments",
    category: "Investments",
    rating: 5,
    students: 2738,
    tags: ["NEW"],
    bgColor: "#FCE4EC",
  },
  {
    id: 5,
    title: "DeFi Basics for Beginners",
    category: "DeFi",
    rating: 4.6,
    students: 1520,
    tags: ["Trending"],
    bgColor: "#E0F7FA",
  },
  {
    id: 6,
    title: "NFT Trading Strategies",
    category: "Meme Coins & NFTs",
    rating: 4.4,
    students: 980,
    tags: [],
    bgColor: "#F3E5F5",
  },
];

const TagBadge = ({ tag }: { tag: string }) => {
  if (tag === "NEW") {
    return (
      <span
        className="inline-flex items-center justify-center px-2 py-1 rounded-full text-[14px] font-semibold text-white"
        style={{ background: "#F65C39" }}
      >
        NEW
      </span>
    );
  }
  if (tag === "Trending") {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[14px] font-medium"
        style={{
          background: "linear-gradient(0deg, rgba(217,192,255,0.5), rgba(217,192,255,0.5)), #FFFFFF",
          border: "1px solid rgba(146,76,254,0.1)",
          color: "#460466",
        }}
      >
        🔥 Trending
      </span>
    );
  }
  return null;
};

const InstructionCard = ({ item }: { item: (typeof instructionsData)[0] }) => (
  <div className="flex flex-col gap-3 w-full">
    {/* Image area */}
    <div
      className="relative w-full aspect-[328/181] rounded-[10px] overflow-hidden"
      style={{ background: item.bgColor }}
    >
      {/* Tags + Bookmark overlay */}
      <div className="absolute top-1 left-2 right-1 flex items-start justify-between">
        <div className="flex items-center gap-1.5 pt-1">
          {item.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
        <button className="w-[38px] h-[38px] rounded-full bg-white flex items-center justify-center flex-shrink-0">
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
      <span className="text-[14px] font-normal leading-none truncate max-w-[180px]" style={{ color: "#464646" }}>
        {item.category}
      </span>
    </div>

    {/* Title */}
    <p className="text-[20px] font-normal leading-[90%]" style={{ color: "#000000" }}>
      {item.title}
    </p>

    {/* Rating + Students */}
    <div className="flex items-center gap-1.5">
      {/* Rating */}
      <div className="flex items-center gap-1">
        <Star className="w-[14px] h-[14px]" fill="#FF7D60" stroke="none" />
        <span className="text-[14px] font-normal leading-none tracking-[0.01em]" style={{ color: "#232323" }}>
          {item.rating}
        </span>
      </div>

      {/* Students */}
      <div
        className="flex items-center gap-1.5 px-1.5 py-1 rounded-full"
        style={{ background: "#F7F7F8" }}
      >
        <Users className="w-[18px] h-[18px]" style={{ color: "#464646" }} strokeWidth={1.25} />
        <span className="text-[14px] font-normal leading-none" style={{ color: "#464646" }}>
          {item.students}
        </span>
      </div>
    </div>
  </div>
);

const Instructions = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-h1 text-foreground mb-6">Инструкции</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {instructionsData.map((item) => (
            <InstructionCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Instructions;
