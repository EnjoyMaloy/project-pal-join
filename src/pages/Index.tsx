import { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, ChevronDown, X, BookOpenCheck, FileText, Eye, Clock, Calendar, Play, Pause, Smartphone, Monitor, Volume2, VolumeX, Maximize2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "next-themes";
import rehcVideo from "@/assets/rehc.mp4.asset.json";


const IconActive = ({ className }: { className?: string }) => (
  <svg className={className} width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.1992 0C20.9665 0 22.4004 1.43282 22.4004 3.2002V15.6973L15.6973 22.4004H3.2002C1.4329 22.4004 0 20.9666 0 19.1992V3.2002C0 1.43282 1.4329 0 3.2002 0H19.1992ZM6.69922 6.2002V8.2002H10.2041V15.7051H12.2041V8.2002H15.6992V6.2002H6.69922Z" fill="currentColor"/>
  </svg>
);

const IconInactive = ({ className }: { className?: string }) => (
  <svg className={className} width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 1C1.89543 1 1 1.89539 1 3V19C1 20.1046 1.89543 21 3 21H15L21 15V3C21 1.89539 20.1046 1 19 1H3Z" stroke="currentColor" strokeWidth="2"/>
    <path d="M15.5 8H12.0049V15.5049H10.0049V8H6.5V6H15.5V8Z" fill="currentColor"/>
    <path d="M21.3535 15.3535L15.3535 21.3535L14.5 21V17C14.5 15.6192 15.6193 14.5 17 14.5H21L21.3535 15.3535Z" fill="currentColor"/>
  </svg>
);

// ============ Article-style content types ============
type Inline = string | { text: string; bold?: boolean; highlight?: boolean };
type Section =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; runs: Inline[] }
  | { type: "list"; items: Inline[][] };

interface LessonContent {
  heading: string;
  author: string;
  views: number;
  readMin: number;
  date: string;
  sections: Section[];
}

interface Lesson {
  number: number;
  title: string;
  description: string;
  reward: number;
  progress: number;
  hasInstruction?: boolean;
  content: LessonContent;
}

const lessonsData: Lesson[] = [
  {
    number: 1,
    title: "Введение в Telegram Gifts",
    description: "Узнаем, что такое Telegram Gifts, как они работают и почему это интересно.",
    reward: 500,
    progress: 100,
    hasInstruction: true,
    content: {
      heading: "Что такое Telegram Gifts и почему это новый класс цифровых активов?",
      author: "pablo1337.base.eth",
      views: 124,
      readMin: 3,
      date: "12 мая 2026 г.",
      sections: [
        { type: "p", runs: [
          { text: "Telegram Gifts", bold: true }, " — это новая функция в мессенджере, которая превращает обычные подарки в ",
          { text: "уникальные цифровые активы", highlight: true }, " на блокчейне TON. Их можно дарить, коллекционировать и продавать на вторичном рынке.",
        ]},
        { type: "p", runs: [
          "Каждый подарок имеет ограниченный тираж, поэтому редкие экземпляры быстро становятся ",
          { text: "объектом коллекционирования", highlight: true }, " и заметно растут в цене.",
        ]},
        { type: "h2", text: "Разберём на пальцах" },
        { type: "h3", text: "Покупка подарка" },
        { type: "p", runs: [
          "Вы выбираете подарок в Telegram, оплачиваете его звёздами и сразу получаете в свой инвентарь. Подарок можно подарить другу или оставить себе.",
        ]},
        { type: "h3", text: "Вторичный рынок" },
        { type: "p", runs: [
          "Полученный подарок можно перепродать. Цена формируется ",
          { text: "спросом и редкостью", bold: true }, ": чем меньше тираж и выше интерес сообщества — тем дороже актив.",
        ]},
        { type: "h2", text: "Почему это интересно?" },
        { type: "p", runs: [
          "Telegram Gifts открывают ",
          { text: "новый способ заработка", highlight: true },
          " внутри привычного мессенджера — без сложных кошельков и бирж. Достаточно интуиции и понимания трендов.",
        ]},
      ],
    },
  },
  {
    number: 4,
    title: "Как зарабатывают на подарках?",
    description: "Узнаем, как идёт торговля сейчас и какие навыки помогут выйти в плюс.",
    reward: 1300,
    progress: 100,
    content: {
      heading: "Как зарабатывают на Telegram Gifts: критерии выбора прибыльных подарков",
      author: "pablo1337.base.eth",
      views: 89,
      readMin: 4,
      date: "15 мая 2026 г.",
      sections: [
        { type: "p", runs: [
          { text: "Выбор подарков для инвестиций", bold: true }, " — ключевой навык, который отделяет случайную прибыль от стабильного дохода. Разберём, на что смотреть в первую очередь.",
        ]},
        { type: "h2", text: "Критерии оценки" },
        { type: "h3", text: "Редкость" },
        { type: "p", runs: [
          "Чем ниже тираж — тем выше потенциал роста. Ищите подарки с пометкой ",
          { text: "Limited Edition", highlight: true }, " и небольшим количеством выпущенных экземпляров.",
        ]},
        { type: "h3", text: "Дизайн и эстетика" },
        { type: "p", runs: [
          "Визуально привлекательные подарки пользуются большим спросом. Сообщество ценит ",
          { text: "сильную айдентику", highlight: true }, " и узнаваемый стиль.",
        ]},
        { type: "h3", text: "Тренды сообщества" },
        { type: "p", runs: [
          "Следите за активностью в каналах коллекционеров — резкий рост обсуждений часто опережает рост цены на ",
          { text: "несколько часов", bold: true }, ".",
        ]},
      ],
    },
  },
  {
    number: 6,
    title: "Стратегии торговли на вторичном рынке",
    description: "Разберём основные стратегии покупки и продажи подарков.",
    reward: 800,
    progress: 45,
    hasInstruction: true,
    content: {
      heading: "Стратегии торговли на вторичном рынке Telegram Gifts",
      author: "pablo1337.base.eth",
      views: 57,
      readMin: 5,
      date: "20 мая 2026 г.",
      sections: [
        { type: "p", runs: [
          { text: "Вторичный рынок", bold: true }, " — это место, где формируется реальная цена подарка. Здесь работают сразу несколько ",
          { text: "проверенных стратегий", highlight: true }, ", каждая со своим горизонтом и риском.",
        ]},
        { type: "h2", text: "Разберём на пальцах" },
        { type: "h3", text: "Скальпинг" },
        { type: "p", runs: [
          "Быстрая покупка на просадке и продажа на отскоке. Подходит активным трейдерам, готовым ",
          { text: "следить за рынком в режиме онлайн", highlight: true }, ".",
        ]},
        { type: "h3", text: "Долгосрочное удержание" },
        { type: "p", runs: [
          "Покупаете редкий подарок и держите месяцами. Главное — ",
          { text: "выбрать действительно дефицитный актив", bold: true }, " с растущим интересом.",
        ]},
        { type: "h2", text: "Пример" },
        { type: "p", runs: [
          "Подарок с тиражом 500 шт. куплен за 200 звёзд. Через месяц на фоне новой коллекции его цена выросла до 850 звёзд — ",
          { text: "+325% за 30 дней", highlight: true }, ".",
        ]},
      ],
    },
  },
  {
    number: 7,
    title: "Анализ трендов и популярных подарков",
    description: "Научимся отслеживать тренды и предсказывать популярность подарков.",
    reward: 1000,
    progress: 0,
    content: {
      heading: "Анализ трендов: как предсказывать рост популярных подарков",
      author: "pablo1337.base.eth",
      views: 12,
      readMin: 3,
      date: "25 мая 2026 г.",
      sections: [
        { type: "p", runs: [
          "Умение читать тренды — это ",
          { text: "ключевой навык успешного трейдера", highlight: true }, ". Цена редко растёт случайно: за каждым движением стоят понятные сигналы.",
        ]},
        { type: "h2", text: "Инструменты анализа" },
        { type: "h3", text: "Мониторинг цен" },
        { type: "p", runs: [
          "Регулярно сверяйтесь с маркетплейсами и трекерами. Резкий рост объёмов почти всегда предшествует ",
          { text: "ценовому импульсу", bold: true }, ".",
        ]},
        { type: "h3", text: "Активность сообщества" },
        { type: "p", runs: [
          "Каналы и чаты коллекционеров — лучший опережающий индикатор. Если о подарке начали говорить — у вас есть ",
          { text: "пара часов", highlight: true }, " на покупку.",
        ]},
      ],
    },
  },
];

// ============ Inline renderers ============
const HL = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-md px-1.5 py-0.5 text-white bg-[#A66CFF] font-medium">{children}</span>
);

const renderRuns = (runs: Inline[]) =>
  runs.map((r, i) => {
    if (typeof r === "string") return <span key={i}>{r}</span>;
    if (r.highlight) return <HL key={i}>{r.text}</HL>;
    if (r.bold) return <strong key={i} className="font-semibold text-foreground">{r.text}</strong>;
    return <span key={i}>{r.text}</span>;
  });

// ============ SVG lesson-map nodes ============
const TrophyIcon = ({ cx, cy }: { cx: number; cy: number }) => (
  <g transform={`translate(${cx}, ${cy})`}>
    {/* Cup body */}
    <path d="M7.274 -14.219h-14.549a2.32 2.32 0 00-2.315 2.315v7.274a9.59 9.59 0 009.589 9.59 9.59 9.59 0 009.59-9.59v-7.274a2.32 2.32 0 00-2.315-2.315z" fill="#D9C0FF" />
    {/* Stem */}
    <path d="M1.983 1.653h-3.968a.99.99 0 00-.992.992v6.614c0 .548.444.992.992.992h3.968a.99.99 0 00.992-.992v-6.614a.99.99 0 00-.992-.992z" fill="#D9C0FF" />
    {/* Base */}
    <path d="M6.282 8.267h-12.566a1.98 1.98 0 00-1.984 1.984v1.984a1.98 1.98 0 001.984 1.984h12.566a1.98 1.98 0 001.984-1.984v-1.984a1.98 1.98 0 00-1.984-1.984z" fill="#D9C0FF" />
  </g>
);


const ChecklistSparkleIcon = ({ cx, cy, color = "#460466" }: { cx: number; cy: number; color?: string }) => (
  <g transform={`translate(${cx}, ${cy})`}>
    <path d="M15.588 5.323H7.96l7.878-2.022a.75.75 0 00-.554-1.394l-8.536 2.192 7.692-4.464a.75.75 0 10-.752-1.298L0 5.166l-13.485-7.824a.75.75 0 10-.752 1.298l7.693 4.464-8.536-2.192a.75.75 0 00-.554 1.394l7.878 2.022h-7.628a1.006 1.006 0 00-1.006 1.005v4.772c0 .555.45 1.005 1.006 1.005h11.104a5.1 5.1 0 004.483-2.328 5.1 5.1 0 004.483 2.328h11.104c.556 0 1.006-.45 1.006-1.005V6.328c0-.555-.45-1.005-1.006-1.005z" fill={color} />
    <path d="M-3.349-8.357a4.37 4.37 0 01-2.383-2.383.75.75 0 00-1.414 0 4.37 4.37 0 01-2.383 2.383.75.75 0 000 1.414 4.37 4.37 0 012.383 2.383.75.75 0 001.414 0 4.37 4.37 0 012.383-2.383.75.75 0 000-1.414z" fill={color} />
    <path d="M9.939-9.822a6.7 6.7 0 01-3.664-3.664.75.75 0 00-1.414 0 6.7 6.7 0 01-3.664 3.664.75.75 0 000 1.414 6.7 6.7 0 013.664 3.664.75.75 0 001.414 0 6.7 6.7 0 013.664-3.664.75.75 0 000-1.414z" fill={color} />
  </g>
);

const LockIcon = ({ cx, cy }: { cx: number; cy: number }) => (
  <g transform={`translate(${cx}, ${cy})`}>
    <path d="M0-14.223c1.768 0 3.463.687 4.714 1.91C5.964-11.091 6.666-9.433 6.666-7.704V-3.793c1.061 0 2.078.412 2.829 1.146C10.245-1.913 10.666-.918 10.666.118V7.94c0 1.038-.421 2.032-1.171 2.766C8.744 11.439 7.727 11.851 6.666 11.851H-6.667c-1.061 0-2.078-.412-2.829-1.145C-10.246 9.972-10.667 8.978-10.667 7.94V.118c0-1.037.421-2.032 1.171-2.765.751-.734 1.768-1.146 2.829-1.146V-7.704c0-1.729.702-3.387 1.953-4.609C-3.464-13.536-1.769-14.223 0-14.223zM0 1.422a2.67 2.67 0 00-1.815.695 2.6 2.6 0 00-.845 1.717L-2.667 4.029c0 .516.156 1.02.449 1.449.293.429.71.763 1.197.96.487.197 1.023.249 1.541.149.517-.101.992-.349 1.365-.714.373-.365.627-.829.73-1.335.103-.506.05-1.03-.152-1.507a2.71 2.71 0 00-1.052-1.17A2.67 2.67 0 000 1.422zM0-11.615c-1.061 0-2.079.412-2.829 1.145C-3.579-9.736-4-8.741-4-7.704V-3.793H4V-7.704c0-1.037-.422-2.032-1.172-2.766C2.078-11.203 1.06-11.615 0-11.615z" fill="#460466" />
  </g>
);

// 8-node S-snake positions (ported from /course/1/lessons)
const NODES_8 = [
  { cx: 120.922, cy: 32 },
  { cx: 285.922, cy: 32 },
  { cx: 285.922, cy: 161 },
  { cx: 120.922, cy: 161 },
  { cx: 120.922, cy: 292 },
  { cx: 120.922, cy: 421 },
  { cx: 120.922, cy: 550 },
  { cx: 285.922, cy: 550 },
];

// Decorative locked-icon variant for nodes beyond real lessons (matches CourseLessons)
type LockedIconVariant = "checklist" | "sparkle" | "lock";
const LOCKED_VARIANTS: LockedIconVariant[] = ["checklist", "sparkle", "lock", "lock"];

// Solid "completed" path segments matching the dashed snake route up to the given node index
const COMPLETED_PATHS = [
  "",
  "M106.701 32H285.922",
  "M106.701 32H350.286C384.922 32 413 60.08 413 94.7184V99.1983C413 133.837 384.922 161.917 350.286 161.917H285.922",
  "M106.701 32H350.286C384.922 32 413 60.08 413 94.7184V99.1983C413 133.837 384.922 161.917 350.286 161.917H106.701",
];


const Index = () => {
  const { t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const lessonColors = {
    surface: isDark ? "#000000" : "#FFFFFF",
    heading: isDark ? "#FFFFFF" : "#232323",
    body: isDark ? "#EBE9EA" : "#464646",
    meta: isDark ? "#8D8D8D" : "#8D8D8D",
    quizBg: isDark ? "#232323" : "#F7F7F8",
    quizBorder: isDark ? "#464646" : "#EBE9EA",
    fadeRgb: isDark ? "0,0,0" : "255,255,255",
  };

  const [searchParams] = useSearchParams();
  const mobileTab = searchParams.get("tab");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeLesson, setActiveLesson] = useState(0);
  const [lessonOpen, setLessonOpen] = useState(false);
  const [storyIndex, setStoryIndex] = useState<number | null>(null);
  const [instructionProgress, setInstructionProgress] = useState(0);
  
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoCurrent, setVideoCurrent] = useState(0);
  const [videoMuted, setVideoMuted] = useState(false);
  const [videoRate, setVideoRate] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const RATES = [1, 1.25, 1.5, 2, 0.5, 0.75];
  useEffect(() => {
    setInstructionProgress(0);
    
    setVideoPlaying(false);
    setVideoProgress(0);
    setVideoCurrent(0);
    setVideoMuted(false);
    setVideoRate(1);
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; videoRef.current.playbackRate = 1; }
  }, [storyIndex]);
  const [popoverIndex, setPopoverIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState(0);

  useEffect(() => {
    if (listRef.current) {
      setListHeight(sidebarOpen ? listRef.current.scrollHeight : 0);
    }
  }, [sidebarOpen]);

  useEffect(() => {
    if (lessonOpen) setStoryIndex(0);
  }, [lessonOpen, activeLesson]);


  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (popoverIndex !== null && !target.closest('[data-lesson-popover]') && !target.closest('[data-lesson-circle]')) {
        setPopoverIndex(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [popoverIndex]);

  const currentLesson = lessonsData[activeLesson];
  const navigate = useNavigate();

  // Overall course progress
  const totalProgress = Math.round(
    lessonsData.reduce((s, l) => s + l.progress, 0) / lessonsData.length
  );

  // Lesson states by index (completed / current / locked)
  const lessonState = (idx: number): "completed" | "current" | "locked" => {
    const l = lessonsData[idx];
    if (l.progress >= 100) return "completed";
    if (l.progress > 0) return "current";
    const prev = lessonsData[idx - 1];
    if (!prev || prev.progress >= 100) return "current";
    return "locked";
  };

  const instructionItems = lessonsData
    .filter((l) => l.hasInstruction)
    .map((l) => ({
      lesson: l,
      articleId: l.number === 1 ? "static-1" : l.number === 6 ? "static-3" : null,
    }));

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile: Instructions tab */}
      {mobileTab === "instructions" && (
        <div className="md:hidden px-4 py-6">
          <h1 className="text-h1 text-foreground mb-5">{t("index.courseInstructions")}</h1>
          <div className="space-y-3">
            {instructionItems.map(({ lesson, articleId }) => (
              <button
                key={lesson.number}
                onClick={() => articleId && navigate(`/instructions/${articleId}`)}
                className="group w-full text-left rounded-xl border-2 p-4 transition-all bg-background border-border hover:bg-violet-super-light hover:border-secondary hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3">
                  <IconInactive className="w-7 h-7 flex-shrink-0 text-violet-light group-hover:text-primary" />
                  <div>
                    <span className="text-caption-12 font-medium inline-block text-violet-light group-hover:text-primary bg-transparent rounded px-2 py-0.5 mb-1">
                      {t("index.lesson")} {lesson.number}
                    </span>
                    <span className="text-[18px] font-normal leading-[100%] block text-foreground">
                      {lesson.title}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={`w-full px-4 md:px-8 py-8 md:py-12 ${mobileTab === "instructions" ? "hidden md:block" : ""}`}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-h1 text-foreground mb-3">{t("index.title")}</h1>
          <p className="text-[16px] font-normal leading-relaxed text-muted-foreground max-w-3xl">
            {t("index.description")}
          </p>
        </div>

        {/* Main layout */}
        <div className="flex flex-col md:flex-row gap-8">
          <div className={`flex-1 min-w-0 ${mobileTab === "instructions" ? "hidden md:block" : ""}`}>
            {/* ============ LESSON MAP ============ */}
            <div
              className="relative rounded-2xl overflow-hidden p-6"
                style={{
                  background: "linear-gradient(180deg, hsl(270 60% 88% / 0.7) 0%, hsl(270 70% 85% / 1) 50%, hsl(270 60% 88% / 0.7) 100%)",
                }}
              >
                {/* Dot pattern */}
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(circle, hsl(var(--violet-primary) / 0.3) 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />

                {/* Progress card */}
                <div className="relative z-10 mb-4">
                  <div className="bg-background rounded-xl px-5 py-3 inline-block min-w-[220px]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[14px] text-foreground font-medium">{t("index.completed")}</span>
                      <span className="text-[14px] font-semibold text-foreground">{totalProgress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${totalProgress}%` }} />
                    </div>
                  </div>
                </div>

                {/* SVG map */}
                <div className="relative z-10 w-full flex justify-center">
                  <svg viewBox="0 0 418 600" fill="none" preserveAspectRatio="xMidYMid meet" className="w-full max-w-[480px] h-auto block">


                    <defs>
                      <filter id="idx_filter_i" x="-0.1" y="-0.1" width="1.2" height="1.2" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                        <feOffset dy="2"/>
                        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"/>
                        <feBlend mode="normal" in2="shape" result="effect1"/>
                      </filter>
                      <linearGradient id="idx_gPurpleFilled" x1="0" y1="0" x2="0" y2="1">
                        <stop stopColor="#7E63A8"/>
                        <stop offset="1" stopColor="#A66CFF"/>
                      </linearGradient>
                      <linearGradient id="idx_gPurpleNode" x1="0" y1="0" x2="0" y2="1">
                        <stop stopColor="#AB75FF"/>
                        <stop offset="1" stopColor="#D3B6FF"/>
                      </linearGradient>
                      <linearGradient id="idx_gGoldNode" x1="0" y1="0" x2="0" y2="1">
                        <stop stopColor="#FFCBB1"/>
                        <stop offset="1" stopColor="#FED912"/>
                      </linearGradient>
                      <linearGradient id="idx_gWhiteNode" x1="0" y1="0" x2="0" y2="1">
                        <stop stopColor="#F7F7F8"/>
                        <stop offset="1" stopColor="white"/>
                      </linearGradient>
                      <linearGradient id="idx_gLockedInner" x1="0" y1="0" x2="0" y2="1">
                        <stop stopColor="#460466" stopOpacity="0.1"/>
                        <stop offset="1" stopColor="#BF96FF" stopOpacity="0.1"/>
                      </linearGradient>
                    </defs>

                    {/* Dashed white path (full S-snake, 8 nodes) */}
                    <path
                      d="M106.701 32H350.286C384.922 32 413 60.08 413 94.7184V99.1983C413 133.837 384.922 161.917 350.286 161.917H64.7139C30.078 161.917 2 189.997 2 224.635V229.115C2 263.753 30.078 291.833 64.7139 291.833H174.23C208.866 291.833 236.944 319.905 236.944 354.543V359.028C236.944 393.667 208.874 421.75 174.238 421.75H64.7014C30.0655 421.75 2 449.83 2 484.468V488.948C2 523.587 30.078 551.667 64.7139 551.667H266.5"
                      stroke="white"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="10 8"
                      fill="none"
                    />



                    {/* Solid purple path (completed segment) */}
                    {(() => {
                      const lastCompleted = lessonsData.reduce((acc, _, i) => lessonState(i) === "completed" ? i : acc, -1);
                      if (lastCompleted < 1) return null;
                      return (
                        <path
                          d={COMPLETED_PATHS[lastCompleted] || ""}
                          stroke="url(#idx_gPurpleFilled)"
                          strokeWidth="9"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      );
                    })()}


                    {/* Nodes - 8 positions, real lessons first then decorative locked */}
                    {NODES_8.map((pos, idx) => {
                      const lesson = lessonsData[idx];
                      const isReal = !!lesson;
                      const state = isReal ? lessonState(idx) : "locked";
                      const lockedVariant: LockedIconVariant = isReal ? "lock" : LOCKED_VARIANTS[idx - lessonsData.length] ?? "lock";

                      return (
                        <g
                          key={idx}
                          className={isReal ? "cursor-pointer" : "cursor-not-allowed"}
                          onClick={() => { if (isReal) setPopoverIndex(popoverIndex === idx ? null : idx); }}
                          data-lesson-circle
                        >
                          {state === "completed" && (
                            <>
                              <circle cx={pos.cx} cy={pos.cy} r="31.5" fill="url(#idx_gPurpleNode)" stroke="#460466"/>
                              <circle opacity="0.3" cx={pos.cx} cy={pos.cy} r="23.7" fill="#924CFE"/>
                              <TrophyIcon cx={pos.cx} cy={pos.cy} />
                            </>
                          )}
                          {state === "current" && (
                            <>
                              <g filter="url(#idx_filter_i)">
                                <circle cx={pos.cx} cy={pos.cy} r="32" fill="url(#idx_gGoldNode)"/>
                              </g>
                              <circle cx={pos.cx} cy={pos.cy} r="31.5" stroke="#460466"/>
                              <circle opacity="0.3" cx={pos.cx} cy={pos.cy} r="23.7" fill="white"/>
                              <ChecklistSparkleIcon cx={pos.cx} cy={pos.cy} />
                            </>
                          )}
                          {state === "locked" && (
                            <>
                              <circle cx={pos.cx} cy={pos.cy} r="31.5" fill="url(#idx_gWhiteNode)" stroke="white"/>
                              <circle cx={pos.cx} cy={pos.cy} r="23.7" fill="url(#idx_gLockedInner)"/>
                              {lockedVariant === "lock" && <LockIcon cx={pos.cx} cy={pos.cy} />}
                              {lockedVariant === "sparkle" && <ChecklistSparkleIcon cx={pos.cx} cy={pos.cy} />}
                              {lockedVariant === "checklist" && (
                                <g>
                                  <rect x={pos.cx - 11.85} y={pos.cy - 13.16} width="10.53" height="10.53" rx="2" fill="#460466" />
                                  <rect x={pos.cx - 11.85} y={pos.cy + 2.63} width="10.53" height="10.53" rx="2" fill="#460466" />
                                  <path d={`M${pos.cx + 5.26} ${pos.cy - 3.95} l-2.63 -2.63 a1.32 1.32 0 011.87 -1.87 l1.7 1.71 4.33 -4.34 a1.32 1.32 0 011.87 1.87 l-5.27 5.27 a1.32 1.32 0 01-.93 .38 z`} fill="#460466" />
                                  <path d={`M${pos.cx + 9.87} ${pos.cy + 12.5} l-6.58 -6.58 a1.32 1.32 0 011.87 -1.87 l6.58 6.58 a1.32 1.32 0 01-.93 2.25 z`} fill="#460466" />
                                  <path d={`M${pos.cx + 3.29} ${pos.cy + 12.5} a1.32 1.32 0 01-.93 -2.25 l6.58 -6.58 a1.32 1.32 0 011.87 1.87 l-6.58 6.58 a1.32 1.32 0 01-.93 .38 z`} fill="#460466" />
                                </g>
                              )}
                            </>
                          )}
                          {/* Instruction badge */}
                          {isReal && lesson.hasInstruction && (
                            <g transform={`translate(${pos.cx + 22}, ${pos.cy + 22})`}>
                              <circle r="9" fill="#FFFFFF" stroke="#460466" strokeWidth="1" />
                              <g transform="translate(-5.4,-5.4) scale(0.45)" stroke="#460466" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                              </g>
                            </g>
                          )}
                        </g>
                      );
                    })}

                    {/* "Начать" label under current node */}
                    {(() => {
                      const currentIdx = lessonsData.findIndex((_, i) => lessonState(i) === "current");
                      if (currentIdx === -1) return null;
                      const pos = NODES_8[currentIdx];
                      if (!pos) return null;

                      return (
                        <foreignObject x={pos.cx - 50} y={pos.cy + 34} width="100" height="40">
                          <div className="flex justify-center">
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setActiveLesson(currentIdx); setLessonOpen(true); }}
                              className="text-[15px] font-medium whitespace-nowrap cursor-pointer pointer-events-auto"
                              style={{
                                color: '#460466',
                                background: '#FFFFFF',
                                borderRadius: 10,
                                padding: '6px 16px',
                                boxShadow: '0 2px 6px rgba(70, 4, 102, 0.12)',
                              }}
                            >
                              {t("index.start")}
                            </button>
                          </div>
                        </foreignObject>
                      );
                    })()}
                  </svg>
                </div>

                {/* Popovers (positioned absolutely over the map) */}
                {popoverIndex !== null && (() => {
                  const lesson = lessonsData[popoverIndex];
                  return (
                    <div
                      data-lesson-popover
                      className="absolute z-30 animate-in fade-in slide-in-from-top-2 duration-200"
                      style={{
                        left: "50%",
                        bottom: 16,
                        transform: "translateX(-50%)",
                        width: 320,
                        background: '#FFFFFF',
                        border: '1px solid #EBE9EA',
                        boxShadow: '0px 8px 24px rgba(70, 4, 102, 0.12)',
                        borderRadius: 14,
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{ background: '#F7F7F8', padding: '14px 18px', borderBottom: '1px solid #EBE9EA' }}>
                        <span className="text-[13px] font-medium tracking-[0.04em] uppercase" style={{ color: '#8D8D8D' }}>
                          {t("index.lesson")} {lesson.number}
                        </span>
                      </div>
                      <div style={{ padding: '16px 18px 14px' }}>
                        <div className="flex items-center gap-2">
                          <BookOpenCheck className="w-[22px] h-[22px] text-primary flex-shrink-0" />
                          <span className="text-[18px] font-semibold leading-[110%]" style={{ color: '#232323' }}>
                            {lesson.title}
                          </span>
                        </div>
                        <p className="text-[14px] font-normal leading-[140%]" style={{ color: '#8D8D8D', marginTop: 8 }}>
                          {lesson.description}
                        </p>
                        {lesson.hasInstruction && (
                          <div className="flex items-center gap-1.5 mt-3">
                            <span
                              className="inline-flex items-center gap-1 text-[12px] font-medium"
                              style={{ color: '#460466', background: '#E8DCFB', padding: '4px 10px', borderRadius: 6 }}
                            >
                              <FileText className="w-3.5 h-3.5" />
                              {t("index.instruction")}
                            </span>
                          </div>
                        )}
                      </div>
                      <div style={{ borderTop: '1px solid #EBE9EA' }} />
                      <div className="flex justify-between" style={{ padding: '14px 18px 16px' }}>
                        <div className="flex flex-col" style={{ gap: 6 }}>
                          <span className="text-[14px] font-normal leading-[100%]" style={{ color: '#8D8D8D' }}>{t("index.completed")}</span>
                          <span className="text-[24px] font-semibold leading-[100%] tracking-[-0.01em]" style={{ color: lesson.progress > 0 ? '#232323' : '#8D8D8D' }}>
                            {lesson.progress}%
                          </span>
                        </div>
                        <div className="flex flex-col" style={{ gap: 6 }}>
                          <span className="text-[14px] font-normal leading-[100%]" style={{ color: '#8D8D8D' }}>{t("index.reward")}</span>
                          <div className="flex items-center" style={{ gap: 6 }}>
                            <span
                              className="inline-flex items-center justify-center rounded-full text-[11px] font-bold"
                              style={{ width: 22, height: 22, background: '#FF7D60', color: '#FFFFFF' }}
                            >S</span>
                            <span className="text-[22px] font-semibold leading-[100%] tracking-[-0.01em]" style={{ color: '#232323' }}>
                              {lesson.reward.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div style={{ padding: '0 14px 14px' }}>
                        <button
                          onClick={() => { setPopoverIndex(null); setActiveLesson(popoverIndex); setLessonOpen(true); }}
                          className="w-full text-[16px] font-medium tracking-[0.01em] hover:opacity-90 transition-opacity"
                          style={{ background: '#232323', color: '#FFFFFF', borderRadius: 12, height: 52 }}
                        >
                          {lesson.progress === 100 ? t("index.retake") : lesson.progress > 0 ? t("index.continue") : t("index.start")}
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
          </div>

          {/* Sidebar - desktop only */}
          <div className="hidden md:block md:w-80 flex-shrink-0">
            <div
              className={`group rounded-2xl sticky top-8 border border-border ${sidebarOpen ? "bg-card p-4" : "bg-muted hover:bg-sidebar-accent cursor-pointer"} transition-all`}
              onClick={() => !sidebarOpen && setSidebarOpen(true)}
            >
              <button
                onClick={(e) => { if (sidebarOpen) { e.stopPropagation(); setSidebarOpen(false); } }}
                className={`flex items-center justify-between w-full rounded-xl px-4 py-4 ${sidebarOpen ? "" : "pointer-events-none"}`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className={`w-5 h-5 text-foreground/70 transition-transform duration-200 ${!sidebarOpen ? "group-hover:scale-110" : ""}`} />
                  <span className={`text-[22px] font-normal leading-[90%] tracking-[0.01em] text-foreground transition-transform duration-200 origin-left ${!sidebarOpen ? "group-hover:scale-[1.03]" : ""}`}>{t("index.courseInstructions")}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${sidebarOpen ? "rotate-180" : "group-hover:translate-y-1"}`} />
              </button>

              <div
                ref={listRef}
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: sidebarOpen ? `${listHeight}px` : "0px" }}
              >
                <div className="space-y-3 pt-4">
                  {lessonsData.map((lesson, index) => (
                    <button
                      key={lesson.number}
                      onClick={() => { setActiveLesson(index); setLessonOpen(true); }}
                      className={`group w-full text-left rounded-xl border-2 p-4 transition-all ${
                        index === activeLesson
                           ? "bg-violet-mid border-violet-super-dark"
                          : "bg-background border-border hover:bg-violet-super-light hover:border-secondary hover:-translate-y-0.5"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {index === activeLesson ? (
                          <IconActive className="w-7 h-7 flex-shrink-0 mt-0.5 text-violet-super-dark" />
                        ) : (
                          <IconInactive className="w-7 h-7 flex-shrink-0 mt-0.5 text-violet-light group-hover:text-primary" />
                        )}
                        <div>
                          {index === activeLesson ? (
                            <span className="text-caption-12 font-medium inline-block text-violet-super-dark bg-white rounded px-2 py-0.5 mb-1">
                              {t("index.lesson")} {lesson.number}
                            </span>
                          ) : (
                            <span className="text-caption-12 font-medium inline-block text-violet-light group-hover:text-primary bg-transparent rounded px-2 py-0.5 mb-1">
                              {t("index.lesson")} {lesson.number}
                            </span>
                          )}
                          <span className={`text-[18px] font-normal leading-[100%] block ${
                            index === activeLesson ? "text-violet-super-dark" : "text-foreground"
                          }`}>
                            {lesson.title}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stories overlay (5 steps per lesson) */}
      {lessonOpen && currentLesson && (() => {
        const STEPS: Array<"image" | "video" | "instruction" | "quiz"> = ["image", "video", "instruction", "quiz", "image"];
        const step = Math.min(Math.max(storyIndex ?? 0, 0), STEPS.length - 1);
        const setStep = (n: number) => setStoryIndex(n);
        const close = () => { setLessonOpen(false); setStoryIndex(null); };
        const next = () => { if (step < STEPS.length - 1) setStep(step + 1); else close(); };
        const prev = () => { if (step > 0) setStep(step - 1); };
        const kind = STEPS[step];

        return (
          <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center sm:p-4" onClick={close}>
            <div
              className={`relative flex flex-col w-full h-full sm:w-[min(420px,100%)] sm:h-[min(760px,92vh)] ${kind === "video" ? "" : "overflow-hidden sm:rounded-2xl"}`}
              style={{
                background: kind === "image" ? "linear-gradient(180deg,#D9C0FF 0%,#BF96FF 100%)" : kind === "video" ? "#000000" : lessonColors.surface,
              }}
              onClick={(e) => e.stopPropagation()}

            >


              {/* Progress bar — single continuous line at top */}
              <div
                className="absolute top-0 left-0 right-0 z-20 overflow-hidden"
                style={{ height: 6, background: 'rgba(255,125,96,0.25)' }}
              >
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${((step + 0.6) / STEPS.length) * 100}%`,
                    background: '#FF7D60',
                  }}
                />
              </div>
              {/* Header removed — content scrolls under progress bar */}


              {/* Tap zones */}
              <button
                aria-label="prev"
                onClick={prev}
                className="absolute left-0 top-0 w-1/3 h-full z-0"
              />
              <button
                aria-label="next"
                onClick={next}
                className="absolute right-0 top-0 w-1/3 h-full z-0"
              />

              {/* Step content */}
              <div className="flex-1 overflow-y-auto px-5 pb-4 relative z-[1] pointer-events-none">
                <div className="pointer-events-auto h-full flex flex-col">
                  {kind === "image" && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                      <div
                        className="w-full aspect-[4/5] rounded-2xl border-2 border-dashed flex items-center justify-center"
                        style={{ borderColor: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.15)' }}
                      >
                        <span className="text-[14px]" style={{ color: '#FFFFFF' }}>Изображение</span>
                      </div>
                      <h3 className="mt-5 text-[22px] font-semibold leading-tight" style={{ color: '#FFFFFF' }}>
                        {currentLesson.title}
                      </h3>
                      <p className="mt-2 text-[14px]" style={{ color: 'rgba(255,255,255,0.85)' }}>
                        {currentLesson.description}
                      </p>
                    </div>
                  )}

                  {kind === "video" && (
                    <div className="flex-1 flex flex-col text-center relative -mx-5 min-h-0">
                      {/* Video stage — letterboxed area with ambient glow */}
                      <div
                        className="flex-1 flex items-center justify-center relative min-h-0 overflow-hidden"
                        style={{ background: '#000' }}
                      >
                        {/* Ambient backlight — blurred copy of the video */}
                        <video
                          src={rehcVideo.url}
                          playsInline
                          muted
                          aria-hidden
                          className="absolute inset-0 w-full h-full pointer-events-none"
                          style={{
                            objectFit: 'cover',
                            filter: 'blur(60px) saturate(1.6)',
                            transform: 'scale(1.3)',
                            opacity: 0.7,
                          }}
                          ref={(el) => {
                            if (!el) return;
                            const main = videoRef.current;
                            if (main && Math.abs(el.currentTime - main.currentTime) > 0.3) {
                              try { el.currentTime = main.currentTime; } catch {}
                            }
                            if (videoPlaying) { el.play().catch(() => {}); } else { el.pause(); }
                          }}
                        />
                        <div
                          className="relative flex items-center justify-center transition-transform duration-500 ease-out"
                          style={{
                            width: '100%',
                            height: 'auto',
                            aspectRatio: '16 / 9',
                            maxHeight: '100%',
                            maxWidth: '100%',
                          }}
                        >
                          <video
                            ref={videoRef}
                            src={rehcVideo.url}
                            playsInline
                            preload="metadata"
                            muted={videoMuted}
                            className="absolute inset-0 w-full h-full"
                            style={{ objectFit: 'contain', background: '#000' }}
                            onLoadedMetadata={(e) => setVideoDuration(e.currentTarget.duration || 0)}
                            onTimeUpdate={(e) => {
                              const el = e.currentTarget;
                              setVideoCurrent(el.currentTime);
                              if (el.duration) setVideoProgress(el.currentTime / el.duration);
                            }}
                            onEnded={() => setVideoPlaying(false)}
                            onClick={(e) => {
                              e.stopPropagation();
                              const v = videoRef.current; if (!v) return;
                              if (v.paused) { v.play(); setVideoPlaying(true); } else { v.pause(); setVideoPlaying(false); }
                            }}
                          />
                          {!videoPlaying && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const v = videoRef.current; if (!v) return;
                                v.play(); setVideoPlaying(true);
                              }}
                              className="relative z-[1] inline-flex items-center justify-center rounded-full hover:scale-110 transition-transform"
                              style={{
                                width: 64, height: 64,
                                background: 'rgba(255,255,255,0.95)',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                              }}
                              aria-label="play"
                            >
                              <Play className="w-7 h-7" style={{ color: '#000', marginLeft: 3 }} fill="#000" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Native-style control bar on black */}
                      <div className="shrink-0 px-5 pt-4 pb-3" style={{ background: '#000' }}>
                        <div className="text-center text-[15px] font-medium tabular-nums mb-3" style={{ color: '#FFF', fontFamily: '"TT Commons", sans-serif' }}>
                          {(() => {
                            const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s) % 60).padStart(2, '0')}`;
                            return `${fmt(videoCurrent)} / ${fmt(videoDuration)}`;
                          })()}
                        </div>
                        <div
                          className="h-1 rounded-full overflow-hidden mb-3 cursor-pointer"
                          style={{ background: 'rgba(255,255,255,0.25)' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            const v = videoRef.current; if (!v || !v.duration) return;
                            const rect = e.currentTarget.getBoundingClientRect();
                            const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                            v.currentTime = ratio * v.duration;
                          }}
                        >
                          <div className="h-full" style={{ width: `${Math.round(videoProgress * 100)}%`, background: '#FFF' }} />
                        </div>
                        <div className="flex items-center justify-between" style={{ color: '#FFF' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const v = videoRef.current; if (!v) return;
                              if (v.paused) { v.play(); setVideoPlaying(true); } else { v.pause(); setVideoPlaying(false); }
                            }}
                            className="p-2 hover:opacity-70 transition-opacity"
                            aria-label="play-pause"
                          >
                            {videoPlaying ? <Pause className="w-6 h-6" fill="#FFF" /> : <Play className="w-6 h-6" fill="#FFF" />}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const idx = RATES.indexOf(videoRate);
                              const next = RATES[(idx + 1) % RATES.length];
                              setVideoRate(next);
                              if (videoRef.current) videoRef.current.playbackRate = next;
                            }}
                            className="text-[24px] font-semibold hover:opacity-70 transition-opacity px-2 leading-none"
                            aria-label="speed"
                          >
                            {videoRate}x
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setVideoMuted(m => !m);
                            }}
                            className="p-2 hover:opacity-70 transition-opacity"
                            aria-label="mute"
                          >
                            {videoMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const v = videoRef.current; if (!v) return;
                              if (v.requestFullscreen) v.requestFullscreen();
                            }}
                            className="p-2 hover:opacity-70 transition-opacity"
                            aria-label="fullscreen"
                          >
                            <Maximize2 className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}


                  {kind === "instruction" && (
                    <div className="flex-1 flex flex-col min-h-0">
                      <div
                        className="overflow-y-auto pr-1 flex-1 [&::-webkit-scrollbar]:hidden"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', paddingTop: 32, paddingBottom: 96, fontFamily: "'Inter', sans-serif" }}
                        onScroll={(e) => {
                          const el = e.currentTarget;
                          const max = el.scrollHeight - el.clientHeight;
                          const p = max > 0 ? Math.min(1, el.scrollTop / max) : 1;
                          setInstructionProgress(p);
                        }}
                      >
                        <h3 className="text-[28px] font-semibold leading-tight" style={{ color: lessonColors.heading }}>
                          {currentLesson.content.heading}
                        </h3>
                        <div className="flex items-center gap-5 mt-3 text-[16px] flex-wrap" style={{ color: lessonColors.meta, fontFamily: '"TT Commons", sans-serif' }}>
                          <span
                            className="inline-flex items-center gap-1 text-[16px] font-medium"
                            style={{ color: '#460466', background: '#E8DCFB', padding: '4px 10px', borderRadius: 6 }}
                          >
                            <FileText className="w-4 h-4" />
                            {t("index.instruction")}
                          </span>
                          <span className="inline-flex items-center gap-1"><Eye className="w-4 h-4" />{currentLesson.content.views}</span>
                          <span className="inline-flex items-center gap-1"><Clock className="w-4 h-4" />{currentLesson.content.readMin} мин</span>
                        </div>
                        <div className="mt-4 space-y-4">
                        {currentLesson.content.sections.slice(0, 12).map((s, i) => {
                          if (s.type === "h2") return <h4 key={i} className="text-[22px] font-semibold" style={{ color: lessonColors.heading }}>{s.text}</h4>;
                          if (s.type === "h3") return <h5 key={i} className="text-[18px] font-semibold" style={{ color: lessonColors.heading }}>{s.text}</h5>;
                          if (s.type === "p") return <p key={i} className="text-[17px] leading-[1.55]" style={{ color: lessonColors.body }}>{renderRuns(s.runs)}</p>;
                          return null;
                        })}
                        <h4 className="text-[22px] font-semibold" style={{ color: lessonColors.heading }}>Как это работает на практике</h4>
                        <p className="text-[17px] leading-[1.55]" style={{ color: lessonColors.body }}>
                          Telegram Gifts — это коллекционные цифровые подарки, которые можно покупать, дарить друзьям и перепродавать на внутреннем маркете. Каждый подарок имеет ограниченный тираж, поэтому редкие экземпляры быстро растут в цене и становятся предметом охоты коллекционеров.
                        </p>
                        <p className="text-[17px] leading-[1.55]" style={{ color: lessonColors.body }}>
                          Чтобы начать, тебе нужен только аккаунт Telegram и немного Stars — внутренней валюты платформы. Stars пополняются через App Store, Google Play или напрямую у ботов, а после покупки подарок мгновенно появляется в твоём профиле и его сразу видно друзьям.
                        </p>
                        <h4 className="text-[22px] font-semibold" style={{ color: lessonColors.heading }}>Почему на этом можно зарабатывать</h4>
                        <p className="text-[17px] leading-[1.55]" style={{ color: lessonColors.body }}>
                          Главный принцип рынка простой: чем меньше тираж и чем выше спрос — тем дороже подарок на вторичке. Лимитированные дропы раскупаются за минуты, а через несколько недель цена может вырасти в 3–10 раз. Опытные трейдеры мониторят релизы и заходят в первые секунды продаж.
                        </p>
                        <p className="text-[17px] leading-[1.55]" style={{ color: lessonColors.body }}>
                          Второй способ — арбитраж между площадками. Один и тот же подарок может стоить по-разному на Fragment, в ботах и в личных сделках. Разница в 10–20% — это уже хороший профит при минимальных рисках, если ты понимаешь механику переводов и комиссий.
                        </p>
                        <h4 className="text-[22px] font-semibold" style={{ color: lessonColors.heading }}>На что обратить внимание новичку</h4>
                        <p className="text-[17px] leading-[1.55]" style={{ color: lessonColors.body }}>
                          Никогда не покупай подарки у незнакомцев напрямую без эскроу — это самый частый способ развода. Используй только проверенные маркетплейсы и ботов с репутацией. Следи за комиссиями: иногда они съедают всю прибыль от сделки.
                        </p>
                        <p className="text-[17px] leading-[1.55]" style={{ color: lessonColors.body }}>
                          Начни с малого: возьми один-два недорогих подарка из свежего дропа, поторгуй ими неделю, посмотри как меняется цена. Это даст реальное понимание рынка гораздо быстрее, чем любая теория. А дальше уже можно масштабировать стратегию.
                        </p>
                        </div>
                      </div>
                    </div>
                  )}



                  {kind === "quiz" && (
                    <div className="flex-1 flex flex-col justify-center items-center">
                      <div className="w-full max-w-sm">
                        <h3 className="text-[20px] font-semibold leading-tight text-center" style={{ color: lessonColors.heading }}>
                          Что такое Telegram Gifts?
                        </h3>
                        <div className="mt-5 space-y-2">
                          {[
                            "Цифровые активы на блокчейне TON",
                            "Обычные стикеры в чате",
                            "Платная подписка на каналы",
                          ].map((opt, i) => (
                            <button
                              key={i}
                              className="w-full text-center text-[14px] rounded-xl border transition-colors hover:bg-violet-super-light"
                              style={{ color: lessonColors.heading, borderColor: lessonColors.quizBorder, padding: '12px 14px', background: lessonColors.quizBg }}
                            >

                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom button */}
              <div className="px-4 pb-4 pt-0 relative z-[2]" style={{ background: 'transparent' }}>
                {kind !== "image" && (
                  <>
                    {/* Progressive blur: stacked layers with increasing strength + soft masks */}
                    {/* Soft fade-out veil — minimal blur, mostly opacity */}
                    <div
                      className="pointer-events-none absolute left-0 right-0"
                      style={{
                        bottom: '100%',
                        height: 90,
                        background: `linear-gradient(to bottom, rgba(${lessonColors.fadeRgb},0) 0%, rgba(${lessonColors.fadeRgb},0.2) 30%, rgba(${lessonColors.fadeRgb},0.6) 60%, rgba(${lessonColors.fadeRgb},0.9) 85%, rgba(${lessonColors.fadeRgb},1) 100%)`,
                      }}
                    />



                  </>
                )}
                {kind !== "image" && (
                  <div className="absolute left-0 right-0 pointer-events-none" style={{ bottom: 0, top: 0, background: lessonColors.surface, zIndex: -1 }} />
                )}

                {(() => {
                  const isInstruction = kind === "instruction";
                  const isVideo = kind === "video";
                  const progress = isInstruction ? instructionProgress : isVideo ? videoProgress : 1;
                  const pct = Math.round(progress * 100);
                  const isActive = (!isInstruction && !isVideo) || progress >= 0.9;
                  const filled = '#FF7D60';
                  const empty = '#FFD0C2';
                  const bg = (isInstruction || isVideo)
                    ? `linear-gradient(to right, ${filled} 0%, ${filled} ${pct}%, ${empty} ${pct}%, ${empty} 100%)`
                    : filled;
                  return (
                    <button
                      onClick={isActive ? next : undefined}
                      disabled={!isActive}
                      className="w-full transition-all"
                      style={{
                        background: bg,
                        color: '#FFFFFF',
                        fontFamily: '"TT Commons", sans-serif',
                        fontWeight: 600,
                        fontStyle: 'normal',
                        fontSize: 18,
                        lineHeight: '18px',
                        borderRadius: 12,
                        height: 52,
                        cursor: isActive ? 'pointer' : 'default',
                        opacity: isActive ? 1 : 0.95,
                        boxShadow: isActive ? '0 4px 0 0 #C75A40' : 'none',
                      }}
                    >
                      {step < STEPS.length - 1 ? t("index.next") : t("index.finish")}
                    </button>

                  );
                })()}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default Index;
