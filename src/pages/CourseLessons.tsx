import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Progress } from "@/components/ui/progress";
import PaymentModal from "@/components/PaymentModal";
import { usePurchaseStore } from "@/hooks/usePurchaseStore";
import { Button } from "@/components/ui/button";

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
    progress: 9,
    lessons: [
      { id: 1, titleRu: "Что такое Telegram Gifts", titleEn: "What are Telegram Gifts", completed: true, locked: false },
      { id: 2, titleRu: "Создание подарка", titleEn: "Creating a Gift", completed: true, locked: false },
      { id: 3, titleRu: "Типы подарков", titleEn: "Gift Types", completed: true, locked: false },
      { id: 4, titleRu: "Коллекции NFT", titleEn: "NFT Collections", completed: false, locked: false, current: true },
      { id: 5, titleRu: "Маркетплейс", titleEn: "Marketplace", completed: false, locked: true },
      { id: 6, titleRu: "Монетизация", titleEn: "Monetization", completed: false, locked: true },
      { id: 7, titleRu: "Стратегии продвижения", titleEn: "Promotion Strategies", completed: false, locked: true },
      { id: 8, titleRu: "Итоговый проект", titleEn: "Final Project", completed: false, locked: true },
    ],
  },
  "2": {
    titleRu: "Анализ проектов",
    titleEn: "Project Analysis",
    descriptionRu: "Научимся анализировать потенциальные проекты для инвестиций.",
    descriptionEn: "Learn to analyze potential investment projects.",
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

// Node positions in the snake SVG (center x,y for each node in order)
const NODE_POSITIONS = [
  { cx: 120.922, cy: 32 },   // 1 - top-left
  { cx: 285.922, cy: 32 },   // 2 - top-right
  { cx: 285.922, cy: 161 },  // 3 - mid-right
  { cx: 120.922, cy: 161 },  // 4 - mid-left (current)
  { cx: 120.922, cy: 292 },  // 5 - locked
  { cx: 120.922, cy: 421 },  // 6 - locked
  { cx: 120.922, cy: 550 },  // 7 - locked
  { cx: 285.922, cy: 550 },  // 8 - locked
];

// Trophy icon for completed nodes
const TrophySVG = () => (
  <>
    <path d="M0 0h28v28H0z" fill="none" />
    <path d="M7.274-14.219h-14.549a2.32 2.32 0 00-2.315 2.315v7.274a9.59 9.59 0 009.589 9.59 9.59 9.59 0 009.59-9.59v-7.274a2.32 2.32 0 00-2.315-2.315z" fill="#D9C0FF" transform="translate(14 14) scale(0.7)" />
    <path d="M2.017 1.653h-3.968a.99.99 0 00-.992.992v6.613a.99.99 0 00.992.992h3.968a.99.99 0 00.992-.992V2.645a.99.99 0 00-.992-.992z" fill="#D9C0FF" transform="translate(14 14) scale(0.7)" />
    <path d="M6.316 8.267h-12.566a1.98 1.98 0 00-1.984 1.984v1.984a1.98 1.98 0 001.984 1.984h12.566a1.98 1.98 0 001.984-1.984v-1.984a1.98 1.98 0 00-1.984-1.984z" fill="#D9C0FF" transform="translate(14 14) scale(0.7)" />
  </>
);

// Lock icon for locked nodes
const LockSVG = ({ cx, cy }: { cx: number; cy: number }) => (
  <g transform={`translate(${cx}, ${cy})`}>
    <path d="M0-14.223c1.768 0 3.463.687 4.714 1.91C5.964 -11.091 6.666-9.433 6.666-7.704V-3.793c1.061 0 2.078.412 2.829 1.146C10.245-1.913 10.666-.918 10.666.118V7.94c0 1.038-.421 2.032-1.171 2.766C8.744 11.439 7.727 11.851 6.666 11.851H-6.667c-1.061 0-2.078-.412-2.829-1.145C-10.246 9.972-10.667 8.978-10.667 7.94V.118c0-1.037.421-2.032 1.171-2.765.751-.734 1.768-1.146 2.829-1.146V-7.704c0-1.729.702-3.387 1.953-4.609C-3.464-13.536-1.769-14.223 0-14.223zM0 1.422c-.673 0-1.321.248-1.815.695-.494.448-.795 1.061-.845 1.717L-2.667 4.029c0 .516.156 1.02.449 1.449.293.429.71.763 1.197.96.487.197 1.023.249 1.541.149.517-.101.992-.349 1.365-.714.373-.365.627-.829.73-1.335.103-.506.05-1.03-.152-1.507a2.71 2.71 0 00-1.052-1.17A2.67 2.67 0 000 1.422zM0-11.615c-1.061 0-2.079.412-2.829 1.145C-3.579-9.736-4-8.741-4-7.704V-3.793H4V-7.704c0-1.037-.422-2.032-1.172-2.766C2.078-11.203 1.06-11.615 0-11.615z" fill="#460466" />
  </g>
);

// Sparkle/quiz icon for current node
const SparkleCurrentSVG = ({ cx, cy }: { cx: number; cy: number }) => (
  <g transform={`translate(${cx}, ${cy})`}>
    {/* Checklist icon */}
    <rect x="-11" y="-13" width="8" height="8" rx="2" fill="#460466" />
    <rect x="-11" y="3" width="8" height="8" rx="2" fill="#460466" />
    <path d="M3.5-10.5l2 2 4-4" stroke="#460466" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M5 7l-4-4m0 0l4-4m-4 4l8 0m-8 0l0 8" stroke="#460466" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" transform="translate(3, 4) scale(0.7)" />
  </g>
);

// Sparkle decorative icon for locked decorative nodes  
const SparkleLockedSVG = ({ cx, cy }: { cx: number; cy: number }) => (
  <g transform={`translate(${cx}, ${cy})`}>
    <path d="M15.587 5.323H7.959l7.878-2.022a.75.75 0 00-.554-1.394l-8.536 2.192 7.692-4.464a.75.75 0 10-.752-1.298L0 5.166l-13.485-7.824a.75.75 0 10-.752 1.298l7.693 4.464-8.536-2.192a.75.75 0 00-.554 1.394l7.878 2.022h-7.628a1.006 1.006 0 00-1.006 1.005v4.772c0 .555.45 1.005 1.006 1.005h11.104a5.1 5.1 0 004.483-2.328A5.1 5.1 0 004.483 12.105H15.587c.556 0 1.006-.45 1.006-1.005V6.328c0-.555-.45-1.005-1.006-1.005z" fill="#460466" transform="scale(0.75)" />
    <path d="M-6.64-8.907a4.37 4.37 0 01-2.383-2.383.75.75 0 00-1.414 0 4.37 4.37 0 01-2.383 2.383.75.75 0 000 1.414 4.37 4.37 0 012.383 2.383.75.75 0 001.414 0 4.37 4.37 0 012.383-2.383.75.75 0 000-1.414z" fill="#460466" transform="translate(0,-5) scale(0.75)" />
    <path d="M6.648-10.372a6.7 6.7 0 01-3.664-3.664.75.75 0 00-1.414 0 6.7 6.7 0 01-3.664 3.664.75.75 0 000 1.414 6.7 6.7 0 013.664 3.664.75.75 0 001.414 0 6.7 6.7 0 013.664-3.664.75.75 0 000-1.414z" fill="#460466" transform="translate(5,-5) scale(0.75)" />
  </g>
);

const CourseLessons = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const store = usePurchaseStore();
  const { purchasedCourses } = store;
  const [paymentOpen, setPaymentOpen] = useState(false);

  const courseMapRaw = id ? courseMaps[id] : null;
  const isOwned = id ? purchasedCourses.includes(id) : false;
  const isReset = purchasedCourses.length === 0 && !store.subscription && store.transactions.length === 0;

  const courseMap = courseMapRaw ? {
    ...courseMapRaw,
    progress: isReset ? 0 : courseMapRaw.progress,
    lessons: courseMapRaw.lessons.map((lesson, idx) => {
      if (isReset) {
        return { ...lesson, completed: false, current: idx === 0, locked: idx > 0 };
      }
      return lesson;
    }),
  } : null;

  if (!courseMap) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-body">{lang === "ru" ? "Курс не найден" : "Course not found"}</p>
      </div>
    );
  }

  const title = lang === "ru" ? courseMap.titleRu : courseMap.titleEn;
  const description = lang === "ru" ? courseMap.descriptionRu : courseMap.descriptionEn;
  const hasStarted = courseMap.lessons.some(l => l.completed);

  // Build dynamic snake path data based on lessons
  const lessonCount = courseMap.lessons.length;
  const positions = NODE_POSITIONS.slice(0, lessonCount);

  // Determine where the completed path ends
  const lastCompletedIdx = courseMap.lessons.reduce((acc, l, i) => l.completed ? i : acc, -1);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[13px] text-muted-foreground mb-6 flex-wrap">
          <button onClick={() => navigate("/catalog")} className="hover:text-foreground transition-colors">
            {lang === "ru" ? "Мои курсы" : "My Courses"}
          </button>
          <span>/</span>
          <button onClick={() => navigate(`/course/${id}`)} className="hover:text-foreground transition-colors">
            {title}
          </button>
          <span>/</span>
          <span className="text-[hsl(var(--violet-primary))]">
            {lang === "ru" ? "Обучение" : "Learning"}
          </span>
        </nav>

        {/* Title & description */}
        <h1 className="text-h1 text-foreground mb-3">{title}</h1>
        <p className="text-body text-muted-foreground leading-relaxed mb-6 max-w-xl">{description}</p>

        {/* Continue learning button */}
        <Button
          className="rounded-full px-8 py-3 text-[15px] font-medium bg-foreground text-background hover:bg-foreground/90 mb-8"
          onClick={() => {
            if (!isOwned) {
              setPaymentOpen(true);
            }
          }}
        >
          {hasStarted
            ? (lang === "ru" ? "Продолжить обучение" : "Continue learning")
            : (lang === "ru" ? "Начать обучение" : "Start learning")
          }
        </Button>

        {/* Lesson map */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(180deg, hsl(270 60% 88% / 0.7) 0%, hsl(270 70% 85% / 1) 50%, hsl(270 60% 88% / 0.7) 100%)",
          }}
        >
          {/* Dot pattern overlay */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: "radial-gradient(circle, hsl(var(--violet-primary) / 0.3) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />

          {/* Progress card */}
          <div className="relative z-10 mx-6 mt-6">
            <div className="bg-background rounded-xl px-5 py-3 inline-block min-w-[220px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[14px] text-foreground font-medium">
                  {lang === "ru" ? "Пройдено" : "Completed"}
                </span>
                <span className="text-[14px] font-semibold text-foreground">{courseMap.progress}%</span>
              </div>
              <Progress value={courseMap.progress} className="h-1.5 bg-muted" />
            </div>
          </div>

          {/* SVG map */}
          <div className="relative z-10 flex justify-center pb-8">
            <svg
              width="418"
              height="582"
              viewBox="0 0 418 582"
              fill="none"
              className="max-w-full h-auto"
              style={{ maxHeight: "600px" }}
            >
              <defs>
                <filter id="filter0_i" x="88.9219" y="129" width="64" height="64" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset dy="2"/>
                  <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"/>
                  <feBlend mode="normal" in2="shape" result="effect1"/>
                </filter>
                <linearGradient id="gPurpleFilled" x1="0" y1="0" x2="0" y2="1">
                  <stop stopColor="#7E63A8"/>
                  <stop offset="1" stopColor="#A66CFF"/>
                </linearGradient>
                <linearGradient id="gPurpleNode" x1="0" y1="0" x2="0" y2="1">
                  <stop stopColor="#AB75FF"/>
                  <stop offset="1" stopColor="#D3B6FF"/>
                </linearGradient>
                <linearGradient id="gGoldNode" x1="0" y1="0" x2="0" y2="1">
                  <stop stopColor="#FFCBB1"/>
                  <stop offset="1" stopColor="#FED912"/>
                </linearGradient>
                <linearGradient id="gWhiteNode" x1="0" y1="0" x2="0" y2="1">
                  <stop stopColor="#F7F7F8"/>
                  <stop offset="1" stopColor="white"/>
                </linearGradient>
                <linearGradient id="gLockedInner" x1="0" y1="0" x2="0" y2="1">
                  <stop stopColor="#460466" stopOpacity="0.1"/>
                  <stop offset="1" stopColor="#BF96FF" stopOpacity="0.1"/>
                </linearGradient>
              </defs>

              {/* Dashed white path (full snake) */}
              <path
                d="M106.701 32H350.286C384.922 32 413 60.08 413 94.7184V99.1983C413 133.837 384.922 161.917 350.286 161.917H64.7139C30.078 161.917 2 189.997 2 224.635V229.115C2 263.753 30.078 291.833 64.7139 291.833H174.23C208.866 291.833 236.944 319.905 236.944 354.543V359.028C236.944 393.667 208.874 421.75 174.238 421.75H64.7014C30.0655 421.75 2 449.83 2 484.468V488.948C2 523.587 30.078 551.667 64.7139 551.667H266.5"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="10 8"
              />

              {/* Solid purple path (completed segment) */}
              <path
                d="M350.42 27.5L351.28 27.5049H351.284C387.933 27.9706 417.5 57.9014 417.5 94.7559V99.2441C417.5 136.099 387.933 166.028 351.284 166.494L350.417 166.5H206.4C203.969 166.5 202 164.523 202 162.088C202 159.653 203.969 157.677 206.4 157.677H350.417C382.606 157.677 408.7 131.515 408.7 99.2441V94.7559C408.7 62.9896 383.415 37.1427 351.921 36.3428V36.3418L350.41 36.3232H108.9C106.469 36.3232 104.5 34.3471 104.5 31.9121C104.5 29.477 106.469 27.5 108.9 27.5H350.42Z"
                fill="url(#gPurpleFilled)"
                stroke="#460466"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* === NODES === */}

              {/* Node 1 - (121, 32) - Completed */}
              {courseMap.lessons[0] && (() => {
                const l = courseMap.lessons[0];
                return (
                  <g className="cursor-pointer" onClick={() => { if (!l.locked && !l.completed && !isOwned) setPaymentOpen(true); }}>
                    <circle cx="120.922" cy="32" r="31.5" fill="url(#gPurpleNode)" stroke="#460466"/>
                    <circle opacity="0.3" cx="120.922" cy="32" r="23.7037" fill="#924CFE"/>
                    {/* Trophy */}
                    <path d="M128.196 17.781H113.647a2.32 2.32 0 00-2.315 2.315v7.274a9.59 9.59 0 009.59 9.59 9.59 9.59 0 009.59-9.59v-7.274a2.32 2.32 0 00-2.316-2.315z" fill="#D9C0FF"/>
                    <path d="M122.905 33.653h-3.968a.99.99 0 00-.992.992v6.614c0 .548.444.992.992.992h3.968a.99.99 0 00.992-.992v-6.614a.99.99 0 00-.992-.992z" fill="#D9C0FF"/>
                    <path d="M127.204 40.267h-12.566a1.98 1.98 0 00-1.984 1.984v1.984c0 1.096.889 1.984 1.984 1.984h12.566a1.98 1.98 0 001.984-1.984v-1.984a1.98 1.98 0 00-1.984-1.984z" fill="#D9C0FF"/>
                  </g>
                );
              })()}

              {/* Node 2 - (286, 32) - Completed */}
              {courseMap.lessons[1] && (() => {
                const l = courseMap.lessons[1];
                return (
                  <g className="cursor-pointer" onClick={() => { if (!l.locked && !l.completed && !isOwned) setPaymentOpen(true); }}>
                    <circle cx="285.922" cy="32" r="31.5" fill="url(#gPurpleNode)" stroke="#460466"/>
                    <circle opacity="0.3" cx="285.922" cy="32" r="23.7037" fill="#924CFE"/>
                    <path d="M293.196 17.781H278.647a2.32 2.32 0 00-2.315 2.315v7.274a9.59 9.59 0 009.59 9.59 9.59 9.59 0 009.59-9.59v-7.274a2.32 2.32 0 00-2.316-2.315z" fill="#D9C0FF"/>
                    <path d="M287.905 33.653h-3.968a.99.99 0 00-.992.992v6.614c0 .548.444.992.992.992h3.968a.99.99 0 00.992-.992v-6.614a.99.99 0 00-.992-.992z" fill="#D9C0FF"/>
                    <path d="M292.204 40.267h-12.566a1.98 1.98 0 00-1.984 1.984v1.984c0 1.096.889 1.984 1.984 1.984h12.566a1.98 1.98 0 001.984-1.984v-1.984a1.98 1.98 0 00-1.984-1.984z" fill="#D9C0FF"/>
                  </g>
                );
              })()}

              {/* Node 3 - (286, 161) - Completed */}
              {courseMap.lessons[2] && (() => {
                const l = courseMap.lessons[2];
                return (
                  <g className="cursor-pointer" onClick={() => { if (!l.locked && !l.completed && !isOwned) setPaymentOpen(true); }}>
                    <circle cx="285.922" cy="161" r="31.5" fill="url(#gPurpleNode)" stroke="#460466"/>
                    <circle opacity="0.3" cx="285.922" cy="161" r="23.7037" fill="#924CFE"/>
                    <path d="M293.196 146.781H278.647a2.32 2.32 0 00-2.315 2.315v7.275a9.59 9.59 0 009.59 9.59 9.59 9.59 0 009.59-9.59v-7.275a2.32 2.32 0 00-2.316-2.315z" fill="#D9C0FF"/>
                    <path d="M287.905 162.653h-3.968a.99.99 0 00-.992.992v6.614c0 .548.444.992.992.992h3.968a.99.99 0 00.992-.992v-6.614a.99.99 0 00-.992-.992z" fill="#D9C0FF"/>
                    <path d="M292.204 169.267h-12.566a1.98 1.98 0 00-1.984 1.984v1.984c0 1.096.889 1.984 1.984 1.984h12.566a1.98 1.98 0 001.984-1.984v-1.984a1.98 1.98 0 00-1.984-1.984z" fill="#D9C0FF"/>
                  </g>
                );
              })()}

              {/* Node 4 - (121, 161) - Current (Golden) */}
              {courseMap.lessons[3] && (() => {
                const l = courseMap.lessons[3];
                return (
                  <g className="cursor-pointer" onClick={() => { if (!l.locked && !isOwned) setPaymentOpen(true); }}>
                    <g filter="url(#filter0_i)">
                      <circle cx="120.922" cy="161" r="32" fill="url(#gGoldNode)"/>
                    </g>
                    <circle cx="120.922" cy="161" r="31.5" stroke="#460466"/>
                    <circle opacity="0.3" cx="120.922" cy="161" r="23.7037" fill="white"/>
                    {/* Sparkle/checklist icon */}
                    <path d="M136.51 166.323H128.882l7.878-2.022a.75.75 0 00-.554-1.394l-8.536 2.192 7.692-4.464a.75.75 0 10-.752-1.298l-13.487 7.829-13.485-7.824a.75.75 0 10-.752 1.298l7.693 4.464-8.536-2.192a.75.75 0 00-.554 1.394l7.878 2.022h-7.628a1.006 1.006 0 00-1.006 1.005v4.772c0 .555.45 1.005 1.006 1.005h11.104a5.1 5.1 0 004.483-2.328 5.1 5.1 0 004.483 2.328h11.104c.556 0 1.006-.45 1.006-1.005v-4.772c0-.555-.45-1.005-1.006-1.005z" fill="#460466"/>
                    <path d="M117.573 152.643a4.37 4.37 0 01-2.383-2.383.75.75 0 00-1.414 0 4.37 4.37 0 01-2.383 2.383.75.75 0 000 1.414 4.37 4.37 0 012.383 2.383.75.75 0 001.414 0 4.37 4.37 0 012.383-2.383.75.75 0 000-1.414z" fill="#460466"/>
                    <path d="M130.861 151.178a6.7 6.7 0 01-3.664-3.664.75.75 0 00-1.414 0 6.7 6.7 0 01-3.664 3.664.75.75 0 000 1.414 6.7 6.7 0 013.664 3.664.75.75 0 001.414 0 6.7 6.7 0 013.664-3.664.75.75 0 000-1.414z" fill="#460466"/>
                  </g>
                );
              })()}

              {/* "Начать" label under current node */}
              {courseMap.lessons[3]?.current && (
                <foreignObject x="85" y="196" width="72" height="28">
                  <div className="flex justify-center">
                    <span className="text-[13px] font-medium text-foreground bg-background rounded-full px-3 py-0.5 shadow-sm whitespace-nowrap">
                      {lang === "ru" ? "Начать" : "Start"}
                    </span>
                  </div>
                </foreignObject>
              )}

              {/* Node 5 - (121, 292) - Locked (checklist icon) */}
              {courseMap.lessons[4] && (() => {
                const l = courseMap.lessons[4];
                return (
                  <g className={l.locked ? "cursor-not-allowed" : "cursor-pointer"} onClick={() => { if (!l.locked && !isOwned) setPaymentOpen(true); }}>
                    <circle cx="120.922" cy="292" r="31.5" fill="url(#gWhiteNode)" stroke="white"/>
                    <circle cx="120.922" cy="292" r="23.7037" fill="url(#gLockedInner)"/>
                    {/* Checklist icon */}
                    <rect x="109.076" y="278.838" width="10.53" height="10.53" rx="2" fill="#460466"/>
                    <rect x="109.076" y="294.633" width="10.53" height="10.53" rx="2" fill="#460466"/>
                    <path d="M126.186 288.052a1.32 1.32 0 01-.934-.382l-2.632-2.632a1.32 1.32 0 011.869-1.869l1.697 1.711 4.331-4.344a1.32 1.32 0 011.869 1.869l-5.265 5.265a1.32 1.32 0 01-.935.382z" fill="#460466"/>
                    <path d="M130.793 304.504a1.32 1.32 0 01-.934-.381l-6.581-6.581a1.32 1.32 0 011.869-1.87l6.581 6.582a1.32 1.32 0 01-.935 2.25z" fill="#460466"/>
                    <path d="M124.213 304.504a1.32 1.32 0 01-.935-2.25l6.581-6.582a1.32 1.32 0 011.869 1.87l-6.581 6.581a1.32 1.32 0 01-.934.381z" fill="#460466"/>
                  </g>
                );
              })()}

              {/* Node 6 - (121, 421) - Locked (sparkle icon) */}
              {courseMap.lessons[5] && (() => {
                const l = courseMap.lessons[5];
                return (
                  <g className={l.locked ? "cursor-not-allowed" : "cursor-pointer"} onClick={() => { if (!l.locked && !isOwned) setPaymentOpen(true); }}>
                    <circle cx="120.922" cy="421" r="31.5" fill="url(#gWhiteNode)" stroke="white"/>
                    <circle cx="120.922" cy="421" r="23.7037" fill="url(#gLockedInner)"/>
                    <path d="M136.51 426.323H128.882l7.878-2.022a.75.75 0 00-.554-1.394l-8.536 2.192 7.692-4.464a.75.75 0 10-.752-1.298l-13.487 7.829-13.485-7.824a.75.75 0 10-.752 1.298l7.693 4.464-8.536-2.192a.75.75 0 00-.554 1.394l7.878 2.022h-7.628a1.006 1.006 0 00-1.006 1.005v4.772c0 .555.45 1.005 1.006 1.005h11.104a5.1 5.1 0 004.483-2.328 5.1 5.1 0 004.483 2.328h11.104c.556 0 1.006-.45 1.006-1.005v-4.772c0-.555-.45-1.005-1.006-1.005z" fill="#460466"/>
                    <path d="M117.573 412.643a4.37 4.37 0 01-2.383-2.383.75.75 0 00-1.414 0 4.37 4.37 0 01-2.383 2.383.75.75 0 000 1.414 4.37 4.37 0 012.383 2.383.75.75 0 001.414 0 4.37 4.37 0 012.383-2.383.75.75 0 000-1.414z" fill="#460466"/>
                    <path d="M130.861 411.178a6.7 6.7 0 01-3.664-3.664.75.75 0 00-1.414 0 6.7 6.7 0 01-3.664 3.664.75.75 0 000 1.414 6.7 6.7 0 013.664 3.664.75.75 0 001.414 0 6.7 6.7 0 013.664-3.664.75.75 0 000-1.414z" fill="#460466"/>
                  </g>
                );
              })()}

              {/* Node 7 - (121, 550) - Locked (lock icon) */}
              {courseMap.lessons[6] && (() => {
                const l = courseMap.lessons[6];
                return (
                  <g className={l.locked ? "cursor-not-allowed" : "cursor-pointer"} onClick={() => { if (!l.locked && !isOwned) setPaymentOpen(true); }}>
                    <circle cx="120.922" cy="550" r="31.5" fill="url(#gWhiteNode)" stroke="white"/>
                    <circle cx="120.922" cy="550" r="23.7037" fill="url(#gLockedInner)"/>
                    <path d="M120.923 535.777c1.768 0 3.463.687 4.714 1.91 1.25 1.222 1.952 2.88 1.952 4.609v3.911c1.061 0 2.078.412 2.829 1.146.75.733 1.171 1.728 1.171 2.765v7.822c0 1.038-.421 2.032-1.171 2.766-.751.733-1.768 1.145-2.829 1.145h-13.333c-1.061 0-2.078-.412-2.829-1.145-.75-.734-1.171-1.728-1.171-2.766v-7.822c0-1.037.421-2.032 1.171-2.765.751-.734 1.768-1.146 2.829-1.146v-3.911c0-1.729.702-3.387 1.952-4.609 1.251-1.223 2.946-1.91 4.715-1.91zm0 15.645a2.67 2.67 0 00-1.815.695 2.6 2.6 0 00-.845 1.717l-.007.195c0 .516.156 1.02.449 1.449.293.429.71.763 1.197.96.487.197 1.023.249 1.541.149.517-.101.992-.349 1.365-.714.373-.365.627-.829.73-1.335.103-.506.05-1.03-.152-1.507a2.71 2.71 0 00-1.052-1.17 2.67 2.67 0 00-1.411-.439zm0-13.037c-1.061 0-2.079.412-2.829 1.145-.75.734-1.171 1.729-1.171 2.766v3.911h8v-3.911c0-1.037-.422-2.032-1.172-2.766-.75-.733-1.768-1.145-2.828-1.145z" fill="#460466"/>
                  </g>
                );
              })()}

              {/* Node 8 - (286, 550) - Locked (lock icon) */}
              {courseMap.lessons[7] && (() => {
                const l = courseMap.lessons[7];
                return (
                  <g className={l.locked ? "cursor-not-allowed" : "cursor-pointer"} onClick={() => { if (!l.locked && !isOwned) setPaymentOpen(true); }}>
                    <circle cx="285.922" cy="550" r="31.5" fill="url(#gWhiteNode)" stroke="white"/>
                    <circle cx="285.922" cy="550" r="23.7037" fill="url(#gLockedInner)"/>
                    <path d="M285.923 535.777c1.768 0 3.463.687 4.714 1.91 1.25 1.222 1.952 2.88 1.952 4.609v3.911c1.061 0 2.078.412 2.829 1.146.75.733 1.171 1.728 1.171 2.765v7.822c0 1.038-.421 2.032-1.171 2.766-.751.733-1.768 1.145-2.829 1.145h-13.333c-1.061 0-2.078-.412-2.829-1.145-.75-.734-1.171-1.728-1.171-2.766v-7.822c0-1.037.421-2.032 1.171-2.765.751-.734 1.768-1.146 2.829-1.146v-3.911c0-1.729.702-3.387 1.952-4.609 1.251-1.223 2.946-1.91 4.715-1.91zm0 15.645a2.67 2.67 0 00-1.815.695 2.6 2.6 0 00-.845 1.717l-.007.195c0 .516.156 1.02.449 1.449.293.429.71.763 1.197.96.487.197 1.023.249 1.541.149.517-.101.992-.349 1.365-.714.373-.365.627-.829.73-1.335.103-.506.05-1.03-.152-1.507a2.71 2.71 0 00-1.052-1.17 2.67 2.67 0 00-1.411-.439zm0-13.037c-1.061 0-2.079.412-2.829 1.145-.75.734-1.171 1.729-1.171 2.766v3.911h8v-3.911c0-1.037-.422-2.032-1.172-2.766-.75-.733-1.768-1.145-2.828-1.145z" fill="#460466"/>
                  </g>
                );
              })()}
            </svg>
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
