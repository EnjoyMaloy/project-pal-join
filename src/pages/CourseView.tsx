import { useState } from "react";
import { usePurchaseStore } from "@/hooks/usePurchaseStore";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Star, ChevronDown, ChevronRight, Users, Gamepad2, Lock } from "lucide-react";
import PremiumStarIcon from "@/components/icons/PremiumStarIcon";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import PaymentModal from "@/components/PaymentModal";

interface CourseData {
  id: string;
  titleRu: string;
  titleEn: string;
  descriptionRu: string;
  descriptionEn: string;
  categoryRu: string;
  categoryEn: string;
  rating: number;
  reviewCount: number;
  students: number;
  price: number | null;
  image: string;
  updatedAt: string;
  languages: string;
  authorName: string;
  authorRating: number;
  courseTypeRu: string;
  courseTypeEn: string;
  modules: { titleRu: string; titleEn: string; lessons: { titleRu: string; titleEn: string }[] }[];
  reviews: { username: string; color: string; rating: number; timeRu: string; timeEn: string; textRu: string; textEn: string }[];
}

const coursesData: Record<string, CourseData> = {
  "1": {
    id: "1",
    titleRu: "Быстрый старт в Telegram Gifts",
    titleEn: "Quick Start with Telegram Gifts",
    descriptionRu: "Узнайте, как использовать Telegram Gifts для создания уникальных цифровых подарков, коллекций и заработка на NFT-подарках в экосистеме Telegram.",
    descriptionEn: "Learn how to use Telegram Gifts to create unique digital gifts, collections, and earn from NFT gifts in the Telegram ecosystem.",
    categoryRu: "Web3 и DeFi",
    categoryEn: "Web3 & DeFi",
    rating: 4.9,
    reviewCount: 85,
    students: 371,
    price: null,
    image: "https://images.unsplash.com/photo-1621504450181-5d356f61d307?w=800&h=500&fit=crop",
    updatedAt: "10.04.26",
    languages: "English, Русский",
    authorName: "OpenCore Club",
    authorRating: 4.8,
    courseTypeRu: "Геймифицированный",
    courseTypeEn: "Gamified",
    modules: [
      {
        titleRu: "Введение в Telegram Gifts",
        titleEn: "Introduction to Telegram Gifts",
        lessons: [
          { titleRu: "Что такое Telegram Gifts", titleEn: "What are Telegram Gifts" },
          { titleRu: "Создание первого подарка", titleEn: "Creating Your First Gift" },
          { titleRu: "Монетизация подарков", titleEn: "Monetizing Gifts" },
        ],
      },
    ],
    reviews: [
      {
        username: "crypto_fan",
        color: "#4CAF50",
        rating: 5,
        timeRu: "2 месяца назад",
        timeEn: "2 months ago",
        textRu: "Отличный бесплатный курс для начинающих! Всё понятно объясняется, быстро разобрался с Telegram Gifts.",
        textEn: "Great free course for beginners! Everything is explained clearly, I quickly figured out Telegram Gifts.",
      },
    ],
  },
  "2": {
    id: "2",
    titleRu: "Анализ проектов",
    titleEn: "Project Analysis",
    descriptionRu: "Научимся анализировать потенциальные проекты для инвестиций: читать whitepaper, проверять токеномику и оценивать команду. Курс даст понятные инструменты для выбора перспективных проектов и защиты от скама.",
    descriptionEn: "Learn to analyze potential investment projects: read whitepapers, verify tokenomics, and evaluate teams. This course provides clear tools for selecting promising projects and protecting against scams.",
    categoryRu: "Инвестиции",
    categoryEn: "Investments",
    rating: 4.9,
    reviewCount: 1010,
    students: 35419,
    price: 49,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
    updatedAt: "07.04.26",
    languages: "English, Русский",
    authorName: "OpenCore Club",
    authorRating: 4.8,
    courseTypeRu: "Геймифицированный",
    courseTypeEn: "Gamified",
    modules: [
      {
        titleRu: "Анализ проектов",
        titleEn: "Project Analysis",
        lessons: [
          { titleRu: "Введение в анализ", titleEn: "Introduction to Analysis" },
          { titleRu: "Чтение Whitepaper", titleEn: "Reading Whitepapers" },
          { titleRu: "Токеномика", titleEn: "Tokenomics" },
        ],
      },
    ],
    reviews: [
      {
        username: "elijah_andikan",
        color: "#3DD6D0",
        rating: 5,
        timeRu: "5 месяцев назад",
        timeEn: "5 months ago",
        textRu: "I 100% recommend this course. I am a newbie in crypto and I usually see how KOLs and people recommend projects, usually on twitter and often times I wonder how they go about selecting a project. Well this course solved that curiosity.",
        textEn: "I 100% recommend this course. I am a newbie in crypto and I usually see how KOLs and people recommend projects, usually on twitter and often times I wonder how they go about selecting a project. Well this course solved that curiosity.",
      },
      {
        username: "patr1ckk",
        color: "#FF6B6B",
        rating: 5,
        timeRu: "5 месяцев назад",
        timeEn: "5 months ago",
        textRu: "Курс отличный, но в приложении допиливать надо. Тягучее в зависания (лаги). Чтобы пройти урок в каждом блоке приходится перезаходить в блок.",
        textEn: "Great course, but the app needs some polish. It lags sometimes. You have to re-enter each block to complete a lesson.",
      },
    ],
  },
  "3": {
    id: "3",
    titleRu: "Как создать систему достижения финансовых целей?",
    titleEn: "How to Build a Financial Goals System?",
    descriptionRu: "Построим персональную систему достижения финансовых целей: от постановки до реализации.",
    descriptionEn: "Build a personal system for achieving financial goals: from goal-setting to execution.",
    categoryRu: "Инвестиции",
    categoryEn: "Investments",
    rating: 4.8,
    reviewCount: 420,
    students: 4168,
    price: 29,
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=500&fit=crop",
    updatedAt: "01.03.26",
    languages: "English, Русский",
    authorName: "OpenCore Club",
    authorRating: 4.8,
    courseTypeRu: "Геймифицированный",
    courseTypeEn: "Gamified",
    modules: [
      {
        titleRu: "Основы финансового планирования",
        titleEn: "Financial Planning Basics",
        lessons: [
          { titleRu: "Постановка целей", titleEn: "Setting Goals" },
          { titleRu: "Бюджетирование", titleEn: "Budgeting" },
        ],
      },
    ],
    reviews: [],
  },
  "5": {
    id: "5",
    titleRu: "Основы блокчейна: архитектура доверия",
    titleEn: "Blockchain Basics: Trust Architecture",
    descriptionRu: "Разберёмся в устройстве блокчейна, консенсусных механизмах и архитектуре децентрализованного доверия.",
    descriptionEn: "Understand blockchain architecture, consensus mechanisms, and decentralized trust.",
    categoryRu: "Основы крипты",
    categoryEn: "Crypto Basics",
    rating: 4.8,
    reviewCount: 890,
    students: 11301,
    price: 39,
    image: "https://images.unsplash.com/photo-1644143379190-08a5f055de1d?w=800&h=500&fit=crop",
    updatedAt: "15.02.26",
    languages: "English, Русский",
    authorName: "OpenCore Club",
    authorRating: 4.8,
    courseTypeRu: "Геймифицированный",
    courseTypeEn: "Gamified",
    modules: [
      {
        titleRu: "Введение в блокчейн",
        titleEn: "Introduction to Blockchain",
        lessons: [
          { titleRu: "Что такое блокчейн", titleEn: "What is Blockchain" },
          { titleRu: "Консенсусные механизмы", titleEn: "Consensus Mechanisms" },
        ],
      },
    ],
    reviews: [],
  },
  "4": {
    id: "4",
    titleRu: "Погружение в DeFi",
    titleEn: "Diving into DeFi",
    descriptionRu: "Полное погружение в мир децентрализованных финансов: от базовых концепций до продвинутых стратегий yield farming, ликвидности и управления рисками в DeFi-протоколах.",
    descriptionEn: "A deep dive into decentralized finance: from basic concepts to advanced yield farming strategies, liquidity provision, and risk management in DeFi protocols.",
    categoryRu: "Web3 и DeFi",
    categoryEn: "Web3 & DeFi",
    rating: 4.8,
    reviewCount: 2450,
    students: 33898,
    price: null,
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=500&fit=crop",
    updatedAt: "20.03.26",
    languages: "English, Русский",
    authorName: "OpenCore Club",
    authorRating: 4.8,
    courseTypeRu: "Геймифицированный",
    courseTypeEn: "Gamified",
    modules: [
      {
        titleRu: "Основы DeFi",
        titleEn: "DeFi Basics",
        lessons: [
          { titleRu: "Что такое DeFi", titleEn: "What is DeFi" },
          { titleRu: "DEX и AMM", titleEn: "DEX and AMM" },
          { titleRu: "Yield Farming", titleEn: "Yield Farming" },
        ],
      },
      {
        titleRu: "Продвинутые стратегии",
        titleEn: "Advanced Strategies",
        lessons: [
          { titleRu: "Управление рисками", titleEn: "Risk Management" },
          { titleRu: "Ликвидность", titleEn: "Liquidity Provision" },
        ],
      },
    ],
    reviews: [
      {
        username: "defi_master",
        color: "#2196F3",
        rating: 5,
        timeRu: "3 месяца назад",
        timeEn: "3 months ago",
        textRu: "Один из лучших бесплатных курсов по DeFi. Очень подробно разбираются все ключевые концепции.",
        textEn: "One of the best free DeFi courses. All key concepts are covered in great detail.",
      },
    ],
  },
  "6": {
    id: "6",
    titleRu: "Тестовый курс с триалом",
    titleEn: "Trial Test Course",
    descriptionRu: "Этот курс с триалом — пройдите первые 2 урока бесплатно, чтобы оценить материал. Доступ к остальным урокам открывается после оплаты.",
    descriptionEn: "This course has a trial — complete the first 2 lessons for free to evaluate the material. Access to remaining lessons opens after payment.",
    categoryRu: "Основы крипты",
    categoryEn: "Crypto Basics",
    rating: 4.7,
    reviewCount: 312,
    students: 1024,
    price: 49,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=500&fit=crop",
    updatedAt: "01.06.26",
    languages: "English, Русский",
    authorName: "OpenCore Club",
    authorRating: 4.8,
    courseTypeRu: "Геймифицированный",
    courseTypeEn: "Gamified",
    modules: [
      {
        titleRu: "Триал модуль",
        titleEn: "Trial Module",
        lessons: [
          { titleRu: "Знакомство", titleEn: "Introduction" },
          { titleRu: "Основные концепции", titleEn: "Core Concepts" },
          { titleRu: "Практика (Премиум)", titleEn: "Practice (Premium)" },
          { titleRu: "Продвинутые темы", titleEn: "Advanced Topics" },
        ],
      },
    ],
    reviews: [],
  },
};

const CourseView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [paymentOpen, setPaymentOpen] = useState(false);
  const store = usePurchaseStore();

  const course = id ? coursesData[id] : null;

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-[16px]">
          {lang === "ru" ? "Курс не найден" : "Course not found"}
        </p>
      </div>
    );
  }

  const title = lang === "ru" ? course.titleRu : course.titleEn;
  const description = lang === "ru" ? course.descriptionRu : course.descriptionEn;
  const category = lang === "ru" ? course.categoryRu : course.categoryEn;
  const courseType = lang === "ru" ? course.courseTypeRu : course.courseTypeEn;
  const isFree = course.price === null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[14px] mb-6">
          <button onClick={() => navigate("/catalog")} className="text-muted-foreground hover:text-foreground transition-colors">
            {lang === "ru" ? "Библиотека" : "Library"}
          </button>
          <span className="text-muted-foreground">/</span>
          <span className="text-primary font-medium">
            {lang === "ru" ? `Курс «${title}»` : `Course "${title}"`}
          </span>
        </nav>

        {/* Mobile course image */}
        <div className="lg:hidden rounded-2xl overflow-hidden bg-pink-100 mb-5">
          <img src={course.image} alt={title} className="w-full aspect-[4/3] object-cover" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <h1 className="text-[28px] font-bold text-foreground">{title}</h1>
              {course.price !== null && (
                <span className="inline-flex items-center justify-center gap-[3px] rounded-full px-3 py-1 text-[13px] font-medium text-[hsl(280,92%,21%)] border border-[rgba(146,76,254,0.1)] bg-[rgba(217,192,255,0.5)] dark:text-[#E8DCFB] dark:border-[rgba(232,220,251,0.2)] dark:bg-[rgba(146,76,254,0.25)]">
                  <PremiumStarIcon className="w-3.5 h-3.5" fill="currentColor" />
                  {lang === "ru" ? "Премиум" : "Premium"}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-[15px] text-muted-foreground leading-relaxed mb-5">
              {description}
            </p>

            {/* Meta info */}
            <div className="flex items-center gap-6 text-[14px] text-muted-foreground mb-3 flex-wrap">
              <span>{lang === "ru" ? "Последнее обновление:" : "Last updated:"} {course.updatedAt}</span>
              <span>{lang === "ru" ? "Языки курса:" : "Course languages:"} {course.languages}</span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mb-8">
              <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
              <span className="text-[15px] font-semibold text-foreground">{course.rating}</span>
              <span className="text-[14px] text-muted-foreground">
                ({course.reviewCount.toLocaleString()} {lang === "ru" ? "отзывов" : "reviews"})
              </span>
            </div>

            {/* Price & CTA */}
            <div className="flex items-center gap-6 mb-10 flex-wrap">
              <div>
                <p className="text-[14px] text-muted-foreground mb-0.5">{lang === "ru" ? "Цена:" : "Price:"}</p>
                <p className="text-[36px] font-medium leading-[32px] text-foreground">
                  {isFree
                    ? (lang === "ru" ? "Бесплатно" : "Free")
                    : (<><span className="text-[16px] font-normal text-muted-foreground">{lang === "ru" ? "от " : "from "}</span>$6<span className="text-[16px] font-normal text-muted-foreground">{lang === "ru" ? "/мес" : "/mo"}</span></>)
                  }
                </p>
              </div>
              {(() => {
                const isPurchased = store.purchasedCourses.includes(course.id);
                const hasSubscription = store.subscription?.active;
                const isOwned = isPurchased || hasSubscription || isFree;
                const isTrial = course.id === "6";
                return (
                  <Button
                    onClick={() => (isOwned || isTrial) ? navigate(`/course/${course.id}/lessons`) : setPaymentOpen(true)}
                    className="h-12 px-8 rounded-xl text-[18px] leading-[18px] font-medium gap-2 [&_svg]:size-5"
                  >
                    {!isOwned && !isTrial && course.price && <PremiumStarIcon fill="currentColor" />}
                    {isOwned
                      ? (lang === "ru" ? "Начать обучение" : "Start learning")
                      : isTrial
                        ? (lang === "ru" ? "Начать бесплатно" : "Start free")
                        : (lang === "ru" ? "Открыть доступ" : "Get access")
                    }
                  </Button>
                );
              })()}
            </div>

            {/* Modules */}
            <Accordion type="single" collapsible className="mb-10">
              {course.modules.map((mod, idx) => (
                <AccordionItem key={idx} value={`module-${idx}`} className="border rounded-xl px-5 mb-3">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="text-left">
                      <span className="text-[13px] text-muted-foreground block">
                        {lang === "ru" ? `Модуль ${idx + 1}` : `Module ${idx + 1}`}
                      </span>
                      <span className="text-[16px] font-medium text-foreground">
                        {lang === "ru" ? mod.titleRu : mod.titleEn}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {mod.lessons.map((lesson, li) => (
                        <li key={li} className="text-[14px] text-muted-foreground pl-2">
                          {li + 1}. {lang === "ru" ? lesson.titleRu : lesson.titleEn}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Reviews */}
            {course.reviews.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-[20px] font-bold text-foreground">
                    {lang === "ru" ? `Отзывы (${course.reviewCount})` : `Reviews (${course.reviewCount})`}
                  </h2>
                  <button className="text-[14px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors">
                    {lang === "ru" ? "Показать все" : "Show all"}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.reviews.map((review, ri) => (
                    <div key={ri} className="border border-border rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback style={{ backgroundColor: review.color }} className="text-white text-[14px] font-bold">
                            {review.username[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-[15px] font-semibold text-foreground">{review.username}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star key={i} className="w-3 h-3 text-orange-400 fill-orange-400" />
                              ))}
                            </div>
                            <span className="text-[12px] text-muted-foreground">
                              {lang === "ru" ? review.timeRu : review.timeEn}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-[14px] text-foreground leading-relaxed line-clamp-5">
                        {lang === "ru" ? review.textRu : review.textEn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-[340px] flex-shrink-0 space-y-5">
            {/* Course image - desktop only */}
            <div className="hidden lg:block rounded-2xl overflow-hidden bg-pink-100">
              <img
                src={course.image}
                alt={title}
                className="w-full aspect-[4/3] object-cover"
              />
            </div>


            {/* Categories */}
            <div className="text-center">
              <h3 className="text-[18px] font-bold text-foreground mb-3">
                {lang === "ru" ? "Категории" : "Categories"}
              </h3>
              <span className="inline-block border border-border rounded-lg px-4 py-2 text-[14px] text-foreground">
                {category}
              </span>
            </div>

            {/* Course type & students */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 border border-border rounded-xl p-4 overflow-hidden">
                <Gamepad2 className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[12px] text-muted-foreground truncate">{lang === "ru" ? "Тип курса" : "Course type"}</p>
                  <p className="text-[13px] font-medium text-foreground truncate">{courseType}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 border border-border rounded-xl p-4 overflow-hidden">
                <Users className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[12px] text-muted-foreground truncate">{lang === "ru" ? "Прошли курс" : "Completed"}</p>
                  <p className="text-[13px] font-medium text-foreground truncate">{course.students.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Author */}
            <div className="border border-border rounded-xl p-5">
              <p className="text-[14px] text-muted-foreground mb-3">{lang === "ru" ? "Авторы курса" : "Course authors"}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-[16px]">
                    A
                  </div>
                  <span className="text-[15px] font-medium text-foreground">{course.authorName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                  <span className="text-[14px] font-medium text-foreground">{course.authorRating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PaymentModal
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        courseId={course.id}
        courseTitleRu={course.titleRu}
        courseTitleEn={course.titleEn}
        courseImage={course.image}
        courseDescRu={course.descriptionRu}
        courseDescEn={course.descriptionEn}
      />
    </div>
  );
};

export default CourseView;
