import { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, ChevronDown, X, BookOpenCheck, Paperclip, Eye, Clock, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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
  <span className="rounded-md px-1.5 py-0.5 text-[#460466] bg-[#E8DCFB] font-medium">{children}</span>
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
  const [searchParams] = useSearchParams();
  const mobileTab = searchParams.get("tab");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeLesson, setActiveLesson] = useState(0);
  const [lessonOpen, setLessonOpen] = useState(false);
  const [storyIndex, setStoryIndex] = useState<number | null>(null);
  const [popoverIndex, setPopoverIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState(0);

  useEffect(() => {
    if (listRef.current) {
      setListHeight(sidebarOpen ? listRef.current.scrollHeight : 0);
    }
  }, [sidebarOpen]);

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
            {lessonOpen ? (
              <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
                <button
                  onClick={() => { setLessonOpen(false); setActiveLesson(-1); }}
                  className="text-btn-medium inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg hover:bg-violet-dark transition-colors mb-8"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t("index.backToCourse")}
                </button>

                {/* Top images */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[0, 1].map((i) => (
                    <div key={`top-${i}`} className="aspect-[4/3] rounded-xl bg-muted border border-dashed border-border flex items-center justify-center">
                      <span className="text-caption-12 text-muted-foreground">Изображение</span>
                    </div>
                  ))}
                </div>

                {/* Article-style content */}
                <article className="max-w-none mb-8">
                  {/* Title + meta card */}
                  <div className="bg-muted rounded-2xl p-5 md:p-6 mb-6">
                    <h2 className="text-h2 text-foreground mb-4 leading-tight">{currentLesson.content.heading}</h2>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-7 h-7 rounded-full bg-[#E8DCFB] border border-border flex items-center justify-center text-[10px] font-semibold text-[#460466]">
                        {currentLesson.content.author.slice(0, 4)}
                      </div>
                      <span className="text-[14px] text-foreground/80">{currentLesson.content.author}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" />{currentLesson.content.views}</span>
                      <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{currentLesson.content.readMin} мин</span>
                      <span className="inline-flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{currentLesson.content.date}</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="space-y-4">
                    {currentLesson.content.sections.map((s, i) => {
                      if (s.type === "h2") return <h3 key={i} className="text-[22px] font-semibold leading-tight text-foreground mt-6 mb-2">{s.text}</h3>;
                      if (s.type === "h3") return <h4 key={i} className="text-[16px] font-semibold text-foreground mt-4 mb-1">{s.text}</h4>;
                      if (s.type === "p") return (
                        <p key={i} className="text-[15px] leading-[1.7] text-foreground/85">{renderRuns(s.runs)}</p>
                      );
                      if (s.type === "list") return (
                        <ul key={i} className="list-disc pl-5 space-y-1 text-[15px] leading-[1.7] text-foreground/85">
                          {s.items.map((it, j) => <li key={j}>{renderRuns(it)}</li>)}
                        </ul>
                      );
                      return null;
                    })}
                  </div>
                </article>

                {/* Bottom images */}
                <div className="grid grid-cols-2 gap-4">
                  {[0, 1].map((i) => (
                    <div key={`bottom-${i}`} className="aspect-[4/3] rounded-xl bg-muted border border-dashed border-border flex items-center justify-center">
                      <span className="text-caption-12 text-muted-foreground">Изображение</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* ============ LESSON MAP ============ */
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
                              <circle r="9" fill="#FFFFFF" stroke="#BF96FF" strokeWidth="1" />
                              <g transform="translate(-4.5,-4.5) scale(0.45)">
                                <path d="M16 6l-6.5 6.5a3 3 0 104.243 4.243L20 10.5a5 5 0 10-7.071-7.071l-6.5 6.5a7 7 0 109.9 9.9l5.657-5.657" stroke="#460466" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
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
                        <foreignObject x={pos.cx - 36} y={pos.cy + 36} width="72" height="28">
                          <div className="flex justify-center">
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setActiveLesson(currentIdx); setLessonOpen(true); }}
                              className="text-[13px] font-medium text-foreground bg-background rounded-full px-3 py-0.5 shadow-sm whitespace-nowrap cursor-pointer pointer-events-auto"
                            >
                              {lessonsData[currentIdx].progress > 0 ? t("index.continue") : t("index.start")}
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
                        width: 260,
                        background: '#FFFFFF',
                        border: '1px solid #EBE9EA',
                        boxShadow: '0px 4px 8px rgba(70, 4, 102, 0.1)',
                        borderRadius: 10,
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{ background: '#F7F7F8', padding: '12px 9px' }}>
                        <span className="text-[12px] font-normal tracking-[0.01em] uppercase" style={{ color: '#8D8D8D' }}>
                          {t("index.lesson")} {lesson.number}
                        </span>
                      </div>
                      <div style={{ padding: '10px 8px 0' }}>
                        <div className="flex items-center gap-1.5">
                          <BookOpenCheck className="w-[18px] h-[18px] text-primary flex-shrink-0" />
                          <span className="text-[16px] font-medium leading-[100%]" style={{ color: '#232323' }}>
                            {lesson.title}
                          </span>
                        </div>
                        <p className="text-[12px] font-normal leading-[140%]" style={{ color: '#8D8D8D', marginTop: 6, paddingLeft: 24 }}>
                          {lesson.description}
                        </p>
                        {lesson.hasInstruction && (
                          <div className="flex items-center gap-1.5 mt-2" style={{ paddingLeft: 24 }}>
                            <span
                              className="inline-flex items-center gap-1 text-[11px] font-medium"
                              style={{ color: '#460466', background: '#E8DCFB', padding: '3px 8px', borderRadius: 6 }}
                            >
                              <Paperclip className="w-3 h-3" />
                              {t("index.instruction")}
                            </span>
                          </div>
                        )}
                      </div>
                      <div style={{ borderTop: '1px solid #EBE9EA', margin: '10px 0 0' }} />
                      <div className="flex justify-between" style={{ padding: '10px 8px' }}>
                        <div className="flex flex-col" style={{ gap: 6 }}>
                          <span className="text-[14px] font-normal leading-[100%]" style={{ color: '#8D8D8D' }}>{t("index.completed")}</span>
                          <span className="text-[16px] font-medium leading-[100%] tracking-[0.01em]" style={{ color: lesson.progress > 0 ? '#232323' : '#8D8D8D' }}>
                            {lesson.progress}%
                          </span>
                        </div>
                        <div className="flex flex-col" style={{ gap: 6 }}>
                          <span className="text-[14px] font-normal leading-[100%]" style={{ color: '#232323' }}>{t("index.reward")}</span>
                          <div className="flex items-center" style={{ gap: 4 }}>
                            <span
                              className="inline-flex items-center justify-center rounded-full text-[8px] font-bold"
                              style={{ width: 16, height: 16, background: '#FF7D60', color: '#FFFFFF' }}
                            >S</span>
                            <span className="text-[14px] font-medium leading-[100%] tracking-[-0.01em]" style={{ color: '#232323' }}>
                              {lesson.reward.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div style={{ padding: '0 8px 8px' }}>
                        <button
                          onClick={() => { setPopoverIndex(null); setActiveLesson(popoverIndex); setLessonOpen(true); }}
                          className="w-full text-[14px] font-medium tracking-[0.01em] hover:opacity-90 transition-opacity"
                          style={{ background: '#232323', color: '#FFFFFF', borderRadius: 8, height: 32 }}
                        >
                          {lesson.progress === 100 ? t("index.retake") : lesson.progress > 0 ? t("index.continue") : t("index.start")}
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
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

      {/* Stories overlay */}
      {storyIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setStoryIndex(null)}>
          <div
            className="relative bg-background rounded-2xl overflow-hidden flex flex-col"
            style={{ width: "min(400px, 100%)", height: "min(700px, 90vh)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-1.5 p-3 pb-0">
              {lessonsData.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i === storyIndex ? "bg-primary" : i < storyIndex ? "bg-primary/40" : "bg-border"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-subh-14 text-foreground">{t("index.lesson")} {lessonsData[storyIndex].number}</span>
              <button onClick={() => setStoryIndex(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              <h2 className="text-h3 text-foreground mb-3">{lessonsData[storyIndex].content.heading}</h2>
              <div className="space-y-3">
                {lessonsData[storyIndex].content.sections.map((s, i) => {
                  if (s.type === "h2") return <h3 key={i} className="text-[18px] font-semibold text-foreground mt-3">{s.text}</h3>;
                  if (s.type === "h3") return <h4 key={i} className="text-subh-14 text-foreground mt-2">{s.text}</h4>;
                  if (s.type === "p") return <p key={i} className="text-body-14 text-foreground/80 leading-relaxed">{renderRuns(s.runs)}</p>;
                  if (s.type === "list") return (
                    <ul key={i} className="text-body-14 text-foreground/80 space-y-1 pl-4 list-disc">
                      {s.items.map((it, j) => <li key={j}>{renderRuns(it)}</li>)}
                    </ul>
                  );
                  return null;
                })}
              </div>
            </div>
            <div className="p-4 border-t border-border">
              {storyIndex < lessonsData.length - 1 ? (
                <button
                  onClick={() => setStoryIndex(storyIndex + 1)}
                  className="w-full text-btn-medium bg-primary text-primary-foreground py-3 rounded-xl hover:bg-violet-dark transition-colors"
                >
                  {t("index.next")}
                </button>
              ) : (
                <button
                  onClick={() => setStoryIndex(null)}
                  className="w-full text-btn-medium bg-primary text-primary-foreground py-3 rounded-xl hover:bg-violet-dark transition-colors"
                >
                  {t("index.finish")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
