import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Lock, ChevronLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import PaymentModal from "@/components/PaymentModal";
import { usePurchaseStore } from "@/hooks/usePurchaseStore";
import { Button } from "@/components/ui/button";
import lessonTrophy from "@/assets/lesson-trophy.png";

interface LessonNode {
  id: number;
  titleRu: string;
  titleEn: string;
  completed: boolean;
  locked: boolean;
  current?: boolean;
  icon?: string;
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

// Snake layout: nodes arranged in rows of 2, alternating direction
// Row 0: left, right (→)
// Row 1: left, right (←, visually right to left connection from previous)
// etc.
interface NodePos {
  x: number;
  y: number;
  row: number;
  col: number;
}

const NODE_SIZE = 56;
const ROW_GAP = 120;
const COL_GAP = 140;
const MAP_PADDING_X = 80;
const MAP_PADDING_TOP = 80;

function getSnakePositions(count: number): NodePos[] {
  const positions: NodePos[] = [];
  let row = 0;
  let i = 0;
  while (i < count) {
    const isEvenRow = row % 2 === 0;
    // First node in row
    if (i < count) {
      positions.push({
        x: isEvenRow ? MAP_PADDING_X : MAP_PADDING_X + COL_GAP,
        y: MAP_PADDING_TOP + row * ROW_GAP,
        row,
        col: isEvenRow ? 0 : 1,
      });
      i++;
    }
    // Second node in row (if exists)
    if (i < count) {
      positions.push({
        x: isEvenRow ? MAP_PADDING_X + COL_GAP : MAP_PADDING_X,
        y: MAP_PADDING_TOP + row * ROW_GAP,
        row,
        col: isEvenRow ? 1 : 0,
      });
      i++;
    }
    row++;
  }
  return positions;
}

function buildSVGPaths(
  positions: NodePos[],
  lessons: LessonNode[]
): { d: string; completed: boolean }[] {
  const paths: { d: string; completed: boolean }[] = [];
  const cx = (p: NodePos) => p.x + NODE_SIZE / 2;
  const cy = (p: NodePos) => p.y + NODE_SIZE / 2;

  for (let i = 0; i < positions.length - 1; i++) {
    const from = positions[i];
    const to = positions[i + 1];
    const isCompleted = lessons[i].completed && lessons[i + 1].completed;

    if (from.row === to.row) {
      // Same row — straight horizontal line
      paths.push({
        d: `M ${cx(from)} ${cy(from)} L ${cx(to)} ${cy(to)}`,
        completed: isCompleted,
      });
    } else {
      // Different row — U-curve going down
      // from is at end of current row, to is at start of next row
      const fromX = cx(from);
      const fromY = cy(from);
      const toX = cx(to);
      const toY = cy(to);
      
      // Determine curve direction based on which side the U-turn is on
      const midY = (fromY + toY) / 2;
      
      if (from.x > to.x) {
        // U-turn on the right side
        const curveX = fromX + 50;
        paths.push({
          d: `M ${fromX} ${fromY} C ${curveX} ${fromY}, ${curveX} ${toY}, ${toX} ${toY}`,
          completed: isCompleted,
        });
      } else if (from.x < to.x) {
        // U-turn on the right side (same direction)
        const curveX = Math.max(fromX, toX) + 50;
        paths.push({
          d: `M ${fromX} ${fromY} C ${curveX} ${fromY}, ${curveX} ${toY}, ${toX} ${toY}`,
          completed: isCompleted,
        });
      } else {
        // Same X, just go down with a slight curve
        const curveX = fromX - 60;
        paths.push({
          d: `M ${fromX} ${fromY} C ${curveX} ${fromY + 30}, ${curveX} ${toY - 30}, ${toX} ${toY}`,
          completed: isCompleted,
        });
      }
    }
  }
  return paths;
}

// Lesson node icon component
const LessonNodeIcon = ({ lesson }: { lesson: LessonNode }) => {
  if (lesson.locked) {
    return <Lock className="w-5 h-5 text-[hsl(var(--violet-primary))]" />;
  }
  if (lesson.completed) {
    return <img src={lessonTrophy} alt="" width={36} height={36} className="w-9 h-9" />;
  }
  if (lesson.current) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L14.5 8.5L21 9.5L16 14L17.5 21L12 17.5L6.5 21L8 14L3 9.5L9.5 8.5L12 2Z" 
              fill="hsl(var(--violet-primary))" stroke="hsl(var(--violet-primary))" strokeWidth="1"/>
      </svg>
    );
  }
  // Available but not started
  return <span className="text-[16px] font-bold text-[hsl(var(--violet-primary))]">{lesson.id}</span>;
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
  const positions = getSnakePositions(courseMap.lessons.length);
  const paths = buildSVGPaths(positions, courseMap.lessons);

  const svgWidth = MAP_PADDING_X * 2 + COL_GAP + NODE_SIZE;
  const totalRows = Math.ceil(courseMap.lessons.length / 2);
  const svgHeight = MAP_PADDING_TOP + totalRows * ROW_GAP + 40;

  const currentLesson = courseMap.lessons.find(l => l.current);
  const hasStarted = courseMap.lessons.some(l => l.completed);

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
            if (!isOwned && currentLesson && !currentLesson.completed) {
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
            background: "linear-gradient(180deg, hsl(270 60% 92% / 0.6) 0%, hsl(270 70% 88% / 0.9) 50%, hsl(270 60% 92% / 0.5) 100%)",
          }}
        >
          {/* Dot pattern overlay */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(circle, hsl(var(--violet-primary) / 0.3) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />

          {/* Progress card */}
          <div className="relative z-10 mx-6 mt-6">
            <div className="bg-background rounded-xl px-5 py-3 inline-flex items-center gap-6 min-w-[220px]">
              <span className="text-[14px] text-foreground font-medium">
                {lang === "ru" ? "Пройдено" : "Completed"}
              </span>
              <span className="text-[14px] font-semibold text-foreground">{courseMap.progress}%</span>
            </div>
          </div>

          {/* SVG map */}
          <div className="relative z-10 flex justify-center">
            <svg
              width={svgWidth}
              height={svgHeight}
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="max-w-full"
            >
              {/* Paths */}
              {paths.map((path, i) => (
                <path
                  key={i}
                  d={path.d}
                  fill="none"
                  stroke={path.completed ? "hsl(var(--violet-primary))" : "hsl(0 0% 100% / 0.7)"}
                  strokeWidth={path.completed ? 4 : 3}
                  strokeDasharray={path.completed ? "none" : "8 8"}
                  strokeLinecap="round"
                />
              ))}

              {/* Nodes */}
              {positions.map((pos, i) => {
                const lesson = courseMap.lessons[i];
                return (
                    <foreignObject
                      key={lesson.id}
                      x={pos.x}
                      y={pos.y}
                      width={NODE_SIZE}
                      height={NODE_SIZE + (lesson.current ? 28 : 0)}
                      style={{ overflow: 'visible' }}
                    >
                      <div className="flex flex-col items-center">
                        <button
                          disabled={lesson.locked}
                          onClick={() => {
                            if (!lesson.locked && !lesson.completed && !isOwned) {
                              setPaymentOpen(true);
                            }
                          }}
                          className={`w-[${NODE_SIZE}px] h-[${NODE_SIZE}px] rounded-full flex items-center justify-center transition-all ${
                            lesson.completed
                              ? "bg-[hsl(var(--violet-primary))] shadow-lg"
                              : lesson.current
                              ? "bg-[hsl(40,90%,65%)] shadow-lg ring-4 ring-[hsl(40,90%,75%)/0.5]"
                              : lesson.locked
                              ? "bg-background/80 border-2 border-[hsl(var(--violet-light))] cursor-not-allowed"
                              : "bg-background/90 border-2 border-[hsl(var(--violet-light))] hover:border-[hsl(var(--violet-primary))]"
                          }`}
                          style={{ width: NODE_SIZE, height: NODE_SIZE }}
                        >
                          <LessonNodeIcon lesson={lesson} />
                        </button>
                        {lesson.current && (
                          <span className="mt-1.5 text-[13px] font-medium text-foreground bg-background rounded-full px-3 py-0.5 shadow-sm whitespace-nowrap">
                            {lang === "ru" ? "Начать" : "Start"}
                          </span>
                        )}
                      </div>
                    </foreignObject>
                );
              })}
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
