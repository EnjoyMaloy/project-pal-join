import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Lock, ChevronLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import PaymentModal from "@/components/PaymentModal";
import lessonTrophy from "@/assets/lesson-trophy.png";
import { usePurchaseStore } from "@/hooks/usePurchaseStore";

interface LessonNode {
  id: number;
  titleRu: string;
  titleEn: string;
  completed: boolean;
  locked: boolean;
  current?: boolean;
}

interface CourseMapData {
  titleRu: string;
  titleEn: string;
  descriptionRu: string;
  descriptionEn: string;
  progress: number;
  lessons: LessonNode[];
}

const courseMaps: Record<string, CourseMapData> = {
  "1": {
    titleRu: "Быстрый старт в Telegram Gifts",
    titleEn: "Quick Start with Telegram Gifts",
    descriptionRu: "Узнайте, как использовать Telegram Gifts для создания уникальных цифровых подарков.",
    descriptionEn: "Learn how to use Telegram Gifts to create unique digital gifts.",
    progress: 20,
    lessons: [
      { id: 1, titleRu: "Что такое Telegram Gifts", titleEn: "What are Telegram Gifts", completed: true, locked: false },
      { id: 2, titleRu: "Создание подарка", titleEn: "Creating a Gift", completed: false, locked: false, current: true },
      { id: 3, titleRu: "Коллекции NFT", titleEn: "NFT Collections", completed: false, locked: true },
      { id: 4, titleRu: "Монетизация", titleEn: "Monetization", completed: false, locked: true },
      { id: 5, titleRu: "Стратегии продвижения", titleEn: "Promotion Strategies", completed: false, locked: true },
    ],
  },
  "2": {
    titleRu: "Анализ проектов",
    titleEn: "Project Analysis",
    descriptionRu: "Научимся анализировать потенциальные проекты для инвестиций: читать whitepaper, проверять токеномику и оценивать команду.",
    descriptionEn: "Learn to analyze potential investment projects: read whitepapers, verify tokenomics, and evaluate teams.",
    progress: 26,
    lessons: [
      { id: 1, titleRu: "Введение в анализ", titleEn: "Introduction to Analysis", completed: true, locked: false },
      { id: 2, titleRu: "Чтение Whitepaper", titleEn: "Reading Whitepapers", completed: true, locked: false },
      { id: 3, titleRu: "Токеномика", titleEn: "Tokenomics", completed: false, locked: false, current: true },
      { id: 4, titleRu: "Оценка команды", titleEn: "Team Evaluation", completed: false, locked: true },
      { id: 5, titleRu: "Аудит смарт-контрактов", titleEn: "Smart Contract Auditing", completed: false, locked: true },
      { id: 6, titleRu: "Анализ конкурентов", titleEn: "Competitor Analysis", completed: false, locked: true },
      { id: 7, titleRu: "Итоговый проект", titleEn: "Final Project", completed: false, locked: true },
    ],
  },
  "3": {
    titleRu: "Как создать систему достижения финансовых целей?",
    titleEn: "How to Build a Financial Goals System?",
    descriptionRu: "Построим персональную систему достижения финансовых целей.",
    descriptionEn: "Build a personal system for achieving financial goals.",
    progress: 0,
    lessons: [
      { id: 1, titleRu: "Постановка целей", titleEn: "Setting Goals", completed: false, locked: false, current: true },
      { id: 2, titleRu: "Бюджетирование", titleEn: "Budgeting", completed: false, locked: true },
      { id: 3, titleRu: "Инвестиционный план", titleEn: "Investment Plan", completed: false, locked: true },
      { id: 4, titleRu: "Автоматизация", titleEn: "Automation", completed: false, locked: true },
    ],
  },
  "4": {
    titleRu: "Погружение в DeFi",
    titleEn: "Diving into DeFi",
    descriptionRu: "Полное погружение в мир децентрализованных финансов.",
    descriptionEn: "A deep dive into decentralized finance.",
    progress: 0,
    lessons: [
      { id: 1, titleRu: "Что такое DeFi", titleEn: "What is DeFi", completed: false, locked: false, current: true },
      { id: 2, titleRu: "DEX и AMM", titleEn: "DEX and AMM", completed: false, locked: true },
      { id: 3, titleRu: "Yield Farming", titleEn: "Yield Farming", completed: false, locked: true },
      { id: 4, titleRu: "Управление рисками", titleEn: "Risk Management", completed: false, locked: true },
      { id: 5, titleRu: "Ликвидность", titleEn: "Liquidity Provision", completed: false, locked: true },
    ],
  },
  "5": {
    titleRu: "Основы блокчейна: архитектура доверия",
    titleEn: "Blockchain Basics: Trust Architecture",
    descriptionRu: "Разберёмся в устройстве блокчейна и механизмах доверия.",
    descriptionEn: "Understand blockchain architecture and trust mechanisms.",
    progress: 0,
    lessons: [
      { id: 1, titleRu: "Что такое блокчейн", titleEn: "What is Blockchain", completed: false, locked: false, current: true },
      { id: 2, titleRu: "Консенсусные механизмы", titleEn: "Consensus Mechanisms", completed: false, locked: true },
      { id: 3, titleRu: "Криптография", titleEn: "Cryptography", completed: false, locked: true },
      { id: 4, titleRu: "Смарт-контракты", titleEn: "Smart Contracts", completed: false, locked: true },
    ],
  },
};

// Zigzag path positions for the map
const getNodePosition = (index: number, total: number) => {
  const isEven = index % 2 === 0;
  const xOffset = isEven ? 0 : 80;
  return { x: xOffset, y: index * 120 };
};

const CourseLessons = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const store = usePurchaseStore();
  const { purchasedCourses } = store;
  const [paymentOpen, setPaymentOpen] = useState(false);

  const courseMapRaw = id ? courseMaps[id] : null;
  const isOwned = id ? purchasedCourses.includes(id) : false;

  // Check if store was reset (no purchases, no subscription, no transactions)
  const isReset = purchasedCourses.length === 0 && !store.subscription && store.transactions.length === 0;

  // Dynamic lesson state: if reset, all lessons start fresh
  const courseMap = courseMapRaw ? {
    ...courseMapRaw,
    progress: isReset ? 0 : courseMapRaw.progress,
    lessons: courseMapRaw.lessons.map((lesson, idx) => {
      if (isReset) {
        return {
          ...lesson,
          completed: false,
          current: idx === 0,
          locked: idx > 0,
        };
      }
      return lesson;
    }),
  } : null;

  if (!courseMap) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-[16px]">
          {lang === "ru" ? "Курс не найден" : "Course not found"}
        </p>
      </div>
    );
  }

  const title = lang === "ru" ? courseMap.titleRu : courseMap.titleEn;
  const description = lang === "ru" ? courseMap.descriptionRu : courseMap.descriptionEn;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Back button */}
        <button
          onClick={() => navigate(`/course/${id}`)}
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-[14px] mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          {lang === "ru" ? "Назад" : "Back"}
        </button>

        {/* Title & description */}
        <h1 className="text-[28px] font-bold text-foreground mb-3">{title}</h1>
        <p className="text-[15px] text-muted-foreground leading-relaxed mb-8">{description}</p>

        {/* Progress card */}
        <div className="border border-border rounded-xl p-4 mb-10 inline-block min-w-[220px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[14px] text-foreground">{lang === "ru" ? "Пройдено" : "Completed"}</span>
            <span className="text-[14px] font-medium text-foreground">{courseMap.progress}%</span>
          </div>
          <Progress value={courseMap.progress} className="h-1.5 [&>div]:bg-[#FF6B6B]" />
        </div>

        {/* Lesson map */}
        <div className="relative flex flex-col items-center pb-20">
          {/* Background gradient */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <div className="w-full h-full bg-gradient-to-b from-[hsl(var(--violet-light)/0.3)] to-[hsl(var(--violet-light)/0.1)]" 
                 style={{ background: "linear-gradient(180deg, rgba(217, 192, 255, 0.3) 0%, rgba(217, 192, 255, 0.05) 100%)" }} />
          </div>

          <div className="relative w-full max-w-[300px] py-10">
            {courseMap.lessons.map((lesson, index) => {
              const pos = getNodePosition(index, courseMap.lessons.length);
              const lessonTitle = lang === "ru" ? lesson.titleRu : lesson.titleEn;
              const isLast = index === courseMap.lessons.length - 1;

              return (
                <div key={lesson.id} className="relative">
                  {/* Connecting line to next node */}
                  {!isLast && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-[56px] w-0.5 h-[64px]"
                      style={{
                        background: lesson.completed
                          ? "hsl(var(--primary))"
                          : "repeating-linear-gradient(to bottom, hsl(var(--border)) 0px, hsl(var(--border)) 6px, transparent 6px, transparent 12px)",
                      }}
                    />
                  )}

                  {/* Node */}
                  <div
                    className="flex flex-col items-center mb-[64px] relative"
                    style={{ marginLeft: `${pos.x}px` }}
                  >
                    <button
                      disabled={lesson.locked}
                      onClick={() => {
                        if (!lesson.locked && !lesson.completed && !isOwned) {
                          setPaymentOpen(true);
                        }
                      }}
                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-md ${
                        lesson.completed
                          ? "bg-primary text-primary-foreground"
                          : lesson.current
                          ? "bg-accent text-accent-foreground ring-4 ring-primary/20 animate-pulse"
                          : lesson.locked
                          ? "bg-muted text-muted-foreground cursor-not-allowed"
                          : "bg-background border-2 border-border text-foreground hover:border-primary"
                      }`}
                    >
                      {lesson.locked ? (
                        <Lock className="w-5 h-5" />
                      ) : lesson.completed ? (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M4 10L8.5 14.5L16 5.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <span className="text-[16px] font-bold">{lesson.id}</span>
                      )}
                    </button>
                    <span className={`mt-2 text-[13px] text-center max-w-[120px] ${
                      lesson.locked ? "text-muted-foreground" : "text-foreground font-medium"
                    }`}>
                      {lesson.current ? (lang === "ru" ? "Начать" : "Start") : lessonTitle}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {courseMap && (
        <PaymentModal
          open={paymentOpen}
          onOpenChange={setPaymentOpen}
          courseTitleRu={courseMap.titleRu}
          courseTitleEn={courseMap.titleEn}
          courseId={id || "1"}
        />
      )}
    </div>
  );
};

export default CourseLessons;
