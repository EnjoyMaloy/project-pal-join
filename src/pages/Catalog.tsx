import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ChevronDown, Star, Users, LayoutGrid, Crown, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sparkles, Bitcoin, ShieldCheck, BarChart3, PieChart, Snowflake, Wrench } from "lucide-react";
import { usePurchaseStore } from "@/hooks/usePurchaseStore";

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
  { id: "ai", labelRu: "AI-навыки", labelEn: "AI Skills", countRu: "Скоро", countEn: "Soon", countColor: "#00C48C", icon: Sparkles, iconColor: "#3DD6D0", bg: "#E0F7F6" },
  { id: "crypto", labelRu: "Основы\nкрипты", labelEn: "Crypto\nBasics", countRu: "2 курса", countEn: "2 courses", countColor: "#FF6B2C", icon: Bitcoin, iconColor: "#FF6B2C", bg: "#FFE4D6" },
  { id: "security", labelRu: "Безопасность", labelEn: "Security", countRu: "1 курс", countEn: "1 course", countColor: "#4285F4", icon: ShieldCheck, iconColor: "#4285F4", bg: "#DDE5F9" },
  { id: "trading", labelRu: "Трейдинг", labelEn: "Trading", countRu: "3 курса", countEn: "3 courses", countColor: "#00C48C", icon: BarChart3, iconColor: "#2EAD6D", bg: "#D9F2E6" },
  { id: "invest", labelRu: "Инвестиции", labelEn: "Investments", countRu: "4 курса", countEn: "4 courses", countColor: "#F5A623", icon: PieChart, iconColor: "#F5A623", bg: "#FFF6D9" },
  { id: "web3", labelRu: "Web3 и DeFi", labelEn: "Web3 & DeFi", countRu: "4 курса", countEn: "4 courses", countColor: "#924CFE", icon: Snowflake, iconColor: "#924CFE", bg: "#E8DCFB" },
  { id: "tools", labelRu: "Инструменты", labelEn: "Tools", countRu: "1 курс", countEn: "1 course", countColor: "#E91E8C", icon: Wrench, iconColor: "#E91E8C", bg: "#FCDCEE" },
];

interface CourseCard {
  id: string;
  titleRu: string;
  titleEn: string;
  categoryId: string;
  rating: number;
  students: number;
  image: string;
  premium?: boolean;
  price?: number;
}

const courses: CourseCard[] = [
  { id: "1", titleRu: "Быстрый старт в Telegram Gifts", titleEn: "Quick Start with Telegram Gifts", categoryId: "web3", rating: 4.9, students: 371, image: "https://images.unsplash.com/photo-1621504450181-5d356f61d307?w=400&h=300&fit=crop" },
  { id: "2", titleRu: "Анализ проектов", titleEn: "Project Analysis", categoryId: "invest", rating: 4.9, students: 35419, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop", premium: true, price: 49 },
  { id: "3", titleRu: "Как создать систему достижения финансовых целей?", titleEn: "How to Build a Financial Goals System?", categoryId: "invest", rating: 4.8, students: 4168, image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=300&fit=crop", premium: true, price: 29 },
  { id: "4", titleRu: "Погружение в DeFi", titleEn: "Diving into DeFi", categoryId: "web3", rating: 4.8, students: 33898, image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop" },
  { id: "5", titleRu: "Основы блокчейна: архитектура доверия", titleEn: "Blockchain Basics: Trust Architecture", categoryId: "crypto", rating: 4.8, students: 11301, image: "https://images.unsplash.com/photo-1644143379190-08a5f055de1d?w=400&h=300&fit=crop", premium: true, price: 39 },
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
          {sortedCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => course.premium ? navigate(`/course/${course.id}`) : undefined}
              className="group rounded-2xl overflow-hidden border border-border bg-background hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={course.image}
                  alt={lang === "ru" ? course.titleRu : course.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                {course.premium && (
                  <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-[hsl(var(--primary))] px-2.5 py-1 text-[12px] font-semibold text-primary-foreground">
                    <Crown className="w-3 h-3" />
                    Premium
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Category tag */}
                <div className="flex items-center gap-1.5 mb-2">
                  <LayoutGrid className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-[13px] text-muted-foreground">
                    {getCategoryLabel(course.categoryId)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-[16px] font-medium leading-[1.3] text-foreground mb-3 line-clamp-2">
                  {lang === "ru" ? course.titleRu : course.titleEn}
                </h3>

                {/* Rating, students, and price */}
                <div className="flex items-center gap-3 text-[14px]">
                  <span className="inline-flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                    <span className="font-medium text-foreground">{course.rating}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Users className="w-3.5 h-3.5" />
                    {course.students.toLocaleString()}
                  </span>
                  {course.premium && course.price && (
                    <span className="ml-auto font-semibold text-foreground">${course.price}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedCourses.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-[16px]">
            {t("instructions.notFound")}
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
