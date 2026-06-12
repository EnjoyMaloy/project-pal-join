import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ChevronDown, LayoutGrid } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sparkles, Bitcoin, ShieldCheck, BarChart3, PieChart, Snowflake, Wrench } from "lucide-react";
import { usePurchaseStore } from "@/hooks/usePurchaseStore";
import CourseCard from "@/components/CourseCard";
import Footer from "@/components/Footer";

interface CategoryItem {
  id: string;
  labelRu: string;
  labelEn: string;
  countRu: string;
  countEn: string;
  countColor: string;
  icon: React.ElementType;
  iconColor: string;
  bg: string;
}

const categories: CategoryItem[] = [
  { id: "ai", labelRu: "AI-навыки", labelEn: "AI Skills", countRu: "Скоро", countEn: "Soon", countColor: "hsl(var(--cat-ai))", icon: Sparkles, iconColor: "hsl(var(--cat-ai-icon))", bg: "hsl(var(--cat-ai-bg))" },
  { id: "crypto", labelRu: "Основы\nкрипты", labelEn: "Crypto\nBasics", countRu: "2 курса", countEn: "2 courses", countColor: "hsl(var(--cat-crypto))", icon: Bitcoin, iconColor: "hsl(var(--cat-crypto))", bg: "hsl(var(--cat-crypto-bg))" },
  { id: "security", labelRu: "Безопасность", labelEn: "Security", countRu: "1 курс", countEn: "1 course", countColor: "hsl(var(--cat-security))", icon: ShieldCheck, iconColor: "hsl(var(--cat-security))", bg: "hsl(var(--cat-security-bg))" },
  { id: "trading", labelRu: "Трейдинг", labelEn: "Trading", countRu: "3 курса", countEn: "3 courses", countColor: "hsl(var(--cat-ai))", icon: BarChart3, iconColor: "hsl(var(--cat-trading-icon))", bg: "hsl(var(--cat-trading-bg))" },
  { id: "invest", labelRu: "Инвестиции", labelEn: "Investments", countRu: "4 курса", countEn: "4 courses", countColor: "hsl(var(--cat-invest))", icon: PieChart, iconColor: "hsl(var(--cat-invest))", bg: "hsl(var(--cat-invest-bg))" },
  { id: "web3", labelRu: "Web3 и DeFi", labelEn: "Web3 & DeFi", countRu: "4 курса", countEn: "4 courses", countColor: "hsl(var(--cat-web3))", icon: Snowflake, iconColor: "hsl(var(--cat-web3))", bg: "hsl(var(--cat-web3-bg))" },
  { id: "tools", labelRu: "Инструменты", labelEn: "Tools", countRu: "1 курс", countEn: "1 course", countColor: "hsl(var(--cat-tools))", icon: Wrench, iconColor: "hsl(var(--cat-tools))", bg: "hsl(var(--cat-tools-bg))" },
];

interface CourseData {
  id: string;
  titleRu: string;
  titleEn: string;
  categoryId: string;
  rating: number;
  students: number;
  image: string;
  premium?: boolean;
  price?: number;
  isNew?: boolean;
  trending?: boolean;
}

const courses: CourseData[] = [
  { id: "1", titleRu: "1 курс — Бесплатный", titleEn: "1 — Free course", categoryId: "web3", rating: 4.9, students: 371, image: "https://images.unsplash.com/photo-1621504450181-5d356f61d307?w=400&h=300&fit=crop", isNew: true },
  { id: "2", titleRu: "2 курс — В подписке без триала", titleEn: "2 — Subscription, no trial", categoryId: "invest", rating: 4.9, students: 35419, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop", premium: true, price: 49, trending: true },
  { id: "6", titleRu: "3 курс — В подписке с триалом", titleEn: "3 — Subscription with trial", categoryId: "crypto", rating: 4.7, students: 1024, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop", premium: true, price: 49, isNew: true },
  { id: "7", titleRu: "4 курс — Платный без триала", titleEn: "4 — Paid, no trial", categoryId: "tools", rating: 4.6, students: 512, image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop", premium: true, price: 79, isNew: true },
  { id: "8", titleRu: "5 курс — Платный с триалом", titleEn: "5 — Paid with trial", categoryId: "tools", rating: 4.7, students: 640, image: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=400&h=300&fit=crop", premium: true, price: 89, isNew: true },
];

const Catalog = () => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "popular">("newest");
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const store = usePurchaseStore();

  const filteredCourses = courses.filter((c) => {
    const matchesCategory = !selectedCategory || c.categoryId === selectedCategory;
    const matchesSearch = !searchQuery || c.titleRu.toLowerCase().includes(searchQuery.toLowerCase()) || c.titleEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) =>
    sortBy === "popular" ? b.students - a.students : 0
  );

  const getCategoryLabel = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    if (!cat) return "";
    return lang === "ru" ? cat.labelRu : cat.labelEn;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-10">
        {/* Subtitle */}
        <p className="text-[16px] text-muted-foreground mb-8">
          {t("catalog.subtitle")}
        </p>

        {/* Category cards row */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const label = lang === "ru" ? cat.labelRu : cat.labelEn;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                className={`flex-shrink-0 flex flex-col justify-between rounded-2xl p-4 transition-all ${
                  selectedCategory === cat.id ? "ring-2 ring-primary ring-offset-2 scale-[1.03]" : "hover:scale-[1.03]"
                }`}
                style={{
                  background: cat.bg,
                  width: 160,
                  height: 160,
                }}
              >
                <Icon style={{ color: cat.iconColor }} className="w-7 h-7" />
                <div className="text-left">
                  <span className="text-[16px] font-medium leading-[1.2] text-foreground block whitespace-pre-line">
                    {label}
                  </span>
                  <span className="text-[14px] font-medium mt-1 block" style={{ color: cat.countColor }}>
                    {lang === "ru" ? cat.countRu : cat.countEn}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Filters row */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          {/* Categories dropdown */}
          <div className="relative">
            <button
              onClick={() => setCatDropdownOpen(!catDropdownOpen)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-background text-[14px] font-medium text-foreground hover:bg-muted transition-colors"
            >
              <LayoutGrid className="w-4 h-4" />
              {t("catalog.categories")}
              <ChevronDown className={`w-4 h-4 transition-transform ${catDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {catDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-20 min-w-[180px] py-1">
                <button
                  onClick={() => { setSelectedCategory(null); setCatDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-[14px] hover:bg-muted transition-colors ${!selectedCategory ? "text-primary font-medium" : "text-foreground"}`}
                >
                  {t("instructions.allTopics")}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); setCatDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-[14px] hover:bg-muted transition-colors ${selectedCategory === cat.id ? "text-primary font-medium" : "text-foreground"}`}
                  >
                    {lang === "ru" ? cat.labelRu : cat.labelEn}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="inline-flex items-center gap-1 text-[14px] text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("instructions.sort")} {sortBy === "newest" ? t("instructions.newest") : t("instructions.popular")}
              <ChevronDown className={`w-4 h-4 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
            </button>
            {sortOpen && (
              <div className="absolute top-full right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-20 min-w-[200px] py-1">
                <button
                  onClick={() => { setSortBy("newest"); setSortOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-[14px] hover:bg-muted transition-colors ${sortBy === "newest" ? "text-primary font-medium" : "text-foreground"}`}
                >
                  {t("instructions.newest")}
                </button>
                <button
                  onClick={() => { setSortBy("popular"); setSortOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-[14px] hover:bg-muted transition-colors ${sortBy === "popular" ? "text-primary font-medium" : "text-foreground"}`}
                >
                  {t("instructions.popular")}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Course cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {sortedCourses.map((course) => {
            const isPurchased = store.purchasedCourses.includes(course.id);
            const hasSubscription = store.subscription?.active;
            const isOwned = isPurchased || (course.premium && hasSubscription) || false;

            return (
              <CourseCard
                key={course.id}
                id={course.id}
                titleRu={course.titleRu}
                titleEn={course.titleEn}
                categoryLabel={getCategoryLabel(course.categoryId)}
                rating={course.rating}
                students={course.students}
                image={course.image}
                premium={course.premium}
                price={course.price}
                isNew={course.isNew}
                trending={course.trending}
                isOwned={isOwned}
              />
            );
          })}
        </div>

        {sortedCourses.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-[16px]">
            {t("instructions.notFound")}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Catalog;
