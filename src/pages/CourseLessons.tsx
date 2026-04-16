import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Lock, ChevronLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import PaymentModal from "@/components/PaymentModal";
import LessonModal from "@/components/LessonModal";
import { usePurchaseStore } from "@/hooks/usePurchaseStore";
import lessonCompleteIcon from "@/assets/lesson-complete.png";
import lessonAvailableIcon from "@/assets/lesson-available.png";

interface LessonNode {
  id: number;
  titleRu: string;
  titleEn: string;
  descRu: string;
  descEn: string;
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
      { id: 1, titleRu: "Что такое Telegram Gifts", titleEn: "What are Telegram Gifts", descRu: "Узнаем, что такое Telegram Gifts и как они работают.", descEn: "Learn what Telegram Gifts are and how they work.", completed: true, locked: false },
      { id: 2, titleRu: "Создание подарка", titleEn: "Creating a Gift", descRu: "Создадим свой первый цифровой подарок в Telegram.", descEn: "Create your first digital gift in Telegram.", completed: false, locked: false, current: true },
      { id: 3, titleRu: "Коллекции NFT", titleEn: "NFT Collections", descRu: "Разберём, как организовать коллекции NFT.", descEn: "Learn how to organize NFT collections.", completed: false, locked: true },
      { id: 4, titleRu: "Монетизация", titleEn: "Monetization", descRu: "Способы монетизации через Telegram Gifts.", descEn: "Ways to monetize through Telegram Gifts.", completed: false, locked: true },
      { id: 5, titleRu: "Стратегии продвижения", titleEn: "Promotion Strategies", descRu: "Продвижение ваших подарков и коллекций.", descEn: "Promoting your gifts and collections.", completed: false, locked: true },
    ],
  },
  "2": {
    titleRu: "Анализ проектов",
    titleEn: "Project Analysis",
    descriptionRu: "Научимся анализировать потенциальные проекты для инвестиций: читать whitepaper, проверять токеномику и оценивать команду.",
    descriptionEn: "Learn to analyze potential investment projects: read whitepapers, verify tokenomics, and evaluate teams.",
    progress: 26,
    lessons: [
      { id: 1, titleRu: "Введение в анализ", titleEn: "Introduction to Analysis", descRu: "Основы анализа криптопроектов.", descEn: "Basics of crypto project analysis.", completed: true, locked: false },
      { id: 2, titleRu: "Чтение Whitepaper", titleEn: "Reading Whitepapers", descRu: "Как правильно читать и анализировать whitepaper.", descEn: "How to read and analyze whitepapers.", completed: true, locked: false },
      { id: 3, titleRu: "Токеномика", titleEn: "Tokenomics", descRu: "Разбираем токеномику проектов.", descEn: "Analyzing project tokenomics.", completed: false, locked: false, current: true },
      { id: 4, titleRu: "Оценка команды", titleEn: "Team Evaluation", descRu: "Как оценить команду проекта.", descEn: "How to evaluate a project team.", completed: false, locked: true },
      { id: 5, titleRu: "Аудит смарт-контрактов", titleEn: "Smart Contract Auditing", descRu: "Основы аудита смарт-контрактов.", descEn: "Smart contract audit basics.", completed: false, locked: true },
      { id: 6, titleRu: "Анализ конкурентов", titleEn: "Competitor Analysis", descRu: "Методы анализа конкурентов.", descEn: "Competitor analysis methods.", completed: false, locked: true },
      { id: 7, titleRu: "Итоговый проект", titleEn: "Final Project", descRu: "Применяем все знания на практике.", descEn: "Apply all knowledge in practice.", completed: false, locked: true },
    ],
  },
  "3": {
    titleRu: "Как создать систему достижения финансовых целей?",
    titleEn: "How to Build a Financial Goals System?",
    descriptionRu: "Построим персональную систему достижения финансовых целей.",
    descriptionEn: "Build a personal system for achieving financial goals.",
    progress: 0,
    lessons: [
      { id: 1, titleRu: "Постановка целей", titleEn: "Setting Goals", descRu: "Учимся правильно ставить финансовые цели.", descEn: "Learn to set financial goals properly.", completed: false, locked: false, current: true },
      { id: 2, titleRu: "Бюджетирование", titleEn: "Budgeting", descRu: "Основы бюджетирования и контроля расходов.", descEn: "Budgeting and expense control basics.", completed: false, locked: true },
      { id: 3, titleRu: "Инвестиционный план", titleEn: "Investment Plan", descRu: "Составляем инвестиционный план.", descEn: "Creating an investment plan.", completed: false, locked: true },
      { id: 4, titleRu: "Автоматизация", titleEn: "Automation", descRu: "Автоматизация финансовых процессов.", descEn: "Automating financial processes.", completed: false, locked: true },
    ],
  },
  "4": {
    titleRu: "Погружение в DeFi",
    titleEn: "Diving into DeFi",
    descriptionRu: "Полное погружение в мир децентрализованных финансов.",
    descriptionEn: "A deep dive into decentralized finance.",
    progress: 0,
    lessons: [
      { id: 1, titleRu: "Что такое DeFi", titleEn: "What is DeFi", descRu: "Введение в децентрализованные финансы.", descEn: "Introduction to decentralized finance.", completed: false, locked: false, current: true },
      { id: 2, titleRu: "DEX и AMM", titleEn: "DEX and AMM", descRu: "Как работают децентрализованные биржи.", descEn: "How decentralized exchanges work.", completed: false, locked: true },
      { id: 3, titleRu: "Yield Farming", titleEn: "Yield Farming", descRu: "Стратегии фарминга доходности.", descEn: "Yield farming strategies.", completed: false, locked: true },
      { id: 4, titleRu: "Управление рисками", titleEn: "Risk Management", descRu: "Риски DeFi и способы их минимизации.", descEn: "DeFi risks and how to minimize them.", completed: false, locked: true },
      { id: 5, titleRu: "Ликвидность", titleEn: "Liquidity Provision", descRu: "Предоставление ликвидности в пулы.", descEn: "Providing liquidity to pools.", completed: false, locked: true },
    ],
  },
  "5": {
    titleRu: "Основы блокчейна: архитектура доверия",
    titleEn: "Blockchain Basics: Trust Architecture",
    descriptionRu: "Разберёмся в устройстве блокчейна и механизмах доверия.",
    descriptionEn: "Understand blockchain architecture and trust mechanisms.",
    progress: 0,
    lessons: [
      { id: 1, titleRu: "Что такое блокчейн", titleEn: "What is Blockchain", descRu: "Узнаем, как работает современный блокчейн и почему Web3 уступает Web2-решениям.", descEn: "Learn how modern blockchain works and why Web3 falls short of Web2 solutions.", completed: false, locked: false, current: true },
      { id: 2, titleRu: "Консенсусные механизмы", titleEn: "Consensus Mechanisms", descRu: "PoW, PoS и другие механизмы консенсуса.", descEn: "PoW, PoS and other consensus mechanisms.", completed: false, locked: true },
      { id: 3, titleRu: "Криптография", titleEn: "Cryptography", descRu: "Криптографические основы блокчейна.", descEn: "Cryptographic foundations of blockchain.", completed: false, locked: true },
      { id: 4, titleRu: "Смарт-контракты", titleEn: "Smart Contracts", descRu: "Что такое смарт-контракты и как они работают.", descEn: "What smart contracts are and how they work.", completed: false, locked: true },
    ],
  },
};

// S-curve snake path: nodes arranged in rows of 2, alternating direction
// Row 0: left-to-right, Row 1: right-to-left, etc.
const getLessonLayout = (lessons: LessonNode[]) => {
  const rows: { lesson: LessonNode; col: number; row: number }[] = [];
  // First row has 2 nodes (left, right), then alternating single nodes snake down
  // Pattern from reference: pairs at top connected by line+curve, then singles snaking down
  let row = 0;
  let i = 0;
  while (i < lessons.length) {
    if (row === 0 && i + 1 < lessons.length) {
      // First row: 2 nodes side by side
      rows.push({ lesson: lessons[i], col: 0, row });
      rows.push({ lesson: lessons[i + 1], col: 1, row });
      i += 2;
    } else {
      // Snake: alternate between right(col=1) and left(col=0)
      const col = (row % 2 === 1) ? 0 : 1;
      rows.push({ lesson: lessons[i], col, row });
      i++;
    }
    row++;
  }
  return rows;
};

const CourseLessons = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const store = usePurchaseStore();
  const { purchasedCourses } = store;
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<LessonNode | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  const courseMapRaw = id ? courseMaps[id] : null;
  const isOwned = id ? purchasedCourses.includes(id) : false;

  // Check if store was reset (no purchases, no subscription, no transactions)
  const isReset = purchasedCourses.length === 0 && !store.subscription && store.transactions.length === 0;

  // Clear completed lessons when store is reset
  if (isReset && completedLessons.size > 0) {
    setCompletedLessons(new Set());
  }

  // Dynamic lesson state: if reset, all lessons start fresh
  const courseMap = courseMapRaw ? {
    ...courseMapRaw,
    progress: isReset ? 0 : courseMapRaw.progress,
    lessons: courseMapRaw.lessons.map((lesson, idx) => {
      const isCompleted = completedLessons.has(lesson.id) || (!isReset && lesson.completed);
      if (isReset && completedLessons.size === 0) {
        return {
          ...lesson,
          completed: false,
          current: idx === 0,
          locked: idx > 0,
        };
      }
      // Find first non-completed lesson to mark as current
      const allLessons = courseMapRaw.lessons;
      const firstIncomplete = allLessons.findIndex(l => !completedLessons.has(l.id) && !((!isReset) && l.completed));
      return {
        ...lesson,
        completed: isCompleted,
        current: !isCompleted && idx === firstIncomplete,
        locked: !isCompleted && idx > Math.max(firstIncomplete, 0),
      };
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
          {/* Background with violet gradient and dot pattern */}
          <div className="relative w-full rounded-3xl overflow-hidden p-8" style={{
            background: "linear-gradient(180deg, rgba(217,192,255,0.4) 0%, rgba(217,192,255,0.08) 100%)",
          }}>
            {/* Dot pattern overlay */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: "radial-gradient(circle, #A66CFF 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }} />

            <div className="relative">
              {/* Snake path SVG */}
              {(() => {
                const nodeSize = 64;
                const gapX = 120; // horizontal gap between columns
                const gapY = 130; // vertical gap between rows
                const centerX = 160;
                const leftX = centerX - gapX / 2;
                const rightX = centerX + gapX / 2;
                const lessons = courseMap.lessons;
                
                // Build node positions for snake layout
                const positions: { x: number; y: number; lesson: LessonNode }[] = [];
                let row = 0;
                let idx = 0;
                
                // Row 0: two nodes side by side
                if (lessons.length >= 2) {
                  positions.push({ x: leftX, y: 32, lesson: lessons[0] });
                  positions.push({ x: rightX, y: 32, lesson: lessons[1] });
                  idx = 2;
                  row = 1;
                } else if (lessons.length === 1) {
                  positions.push({ x: centerX, y: 32, lesson: lessons[0] });
                  idx = 1;
                  row = 1;
                }
                
                // Remaining nodes snake down alternating left-right
                while (idx < lessons.length) {
                  const col = row % 2 === 1 ? 0 : 1; // odd rows go left, even go right
                  const x = col === 0 ? leftX : rightX;
                  const y = 32 + row * gapY;
                  positions.push({ x, y, lesson: lessons[idx] });
                  idx++;
                  row++;
                }
                
                const svgHeight = 32 + row * gapY + 40;
                
                // Build path segments
                const pathSegments: { d: string; completed: boolean }[] = [];
                for (let i = 0; i < positions.length - 1; i++) {
                  const from = positions[i];
                  const to = positions[i + 1];
                  const isCompleted = from.lesson.completed;
                  
                  if (i === 0 && positions.length >= 2) {
                    // First segment: straight line + U-curve from left to right on row 0, then curve down to row 1
                    if (positions.length > 2) {
                      // Line between first two nodes
                      pathSegments.push({
                        d: `M ${from.x} ${from.y + nodeSize / 2} L ${to.x} ${to.y + nodeSize / 2}`,
                        completed: isCompleted,
                      });
                    } else {
                      pathSegments.push({
                        d: `M ${from.x + nodeSize / 2} ${from.y + nodeSize / 2} L ${to.x - nodeSize / 2} ${to.y + nodeSize / 2}`,
                        completed: isCompleted,
                      });
                    }
                  } else {
                    // Curved connection (S-curve between rows)
                    const midY = (from.y + to.y) / 2 + nodeSize / 2;
                    if (from.x !== to.x) {
                      // Different columns - S curve
                      pathSegments.push({
                        d: `M ${from.x} ${from.y + nodeSize} C ${from.x} ${midY}, ${to.x} ${midY - 30}, ${to.x} ${to.y}`,
                        completed: isCompleted,
                      });
                    } else {
                      // Same column - straight down
                      pathSegments.push({
                        d: `M ${from.x} ${from.y + nodeSize} L ${to.x} ${to.y}`,
                        completed: isCompleted,
                      });
                    }
                  }
                }
                
                // U-turn from node 1 (right, row 0) to node 2 (row 1)
                if (positions.length > 2) {
                  const node1 = positions[1];
                  const node2 = positions[2];
                  const isComp = node1.lesson.completed;
                  const curveRight = rightX + 60;
                  pathSegments.splice(1, 0, {
                    d: `M ${node1.x + nodeSize / 2} ${node1.y + nodeSize / 2} C ${curveRight} ${node1.y + nodeSize / 2}, ${curveRight} ${node2.y + nodeSize / 2}, ${node2.x > node1.x ? node2.x - nodeSize / 2 : node2.x + nodeSize / 2} ${node2.y + nodeSize / 2}`,
                    completed: isComp,
                  });
                  // Remove the auto-generated segment for 1->2
                  pathSegments.splice(2, 1);
                }
                
                return (
                  <div className="relative" style={{ width: 320, height: svgHeight }}>
                    {/* SVG paths */}
                    <svg className="absolute inset-0" width={320} height={svgHeight} fill="none">
                      {pathSegments.map((seg, i) => (
                        <path
                          key={i}
                          d={seg.d}
                          stroke={seg.completed ? "#924CFE" : "#FFFFFF"}
                          strokeWidth={seg.completed ? 4 : 3}
                          strokeDasharray={seg.completed ? "none" : "8 8"}
                          fill="none"
                          strokeLinecap="round"
                        />
                      ))}
                    </svg>
                    
                    {/* Nodes */}
                    {positions.map(({ x, y, lesson }, i) => {
                      const lessonTitle = lang === "ru" ? lesson.titleRu : lesson.titleEn;
                      return (
                        <button
                          key={lesson.id}
                          disabled={lesson.locked}
                          onClick={() => { if (!lesson.locked) setSelectedLesson(lesson); }}
                          className="absolute w-16 h-16 rounded-full flex items-center justify-center transition-all"
                          style={{
                            left: x - nodeSize / 2,
                            top: y,
                            ...(lesson.completed
                              ? {
                                  background: "linear-gradient(180deg, #AB75FF 0%, #D3B6FF 100%)",
                                  border: "1px solid #460466",
                                }
                              : lesson.current
                              ? {
                                  background: "linear-gradient(180deg, #FFCBB1 0%, #FED912 100%)",
                                  border: "1px solid #460466",
                                  boxShadow: "inset 0px 2px 0px rgba(255,255,255,0.5)",
                                }
                              : lesson.locked
                              ? {
                                  background: "linear-gradient(180deg, #F7F7F8 0%, #FFFFFF 100%)",
                                  border: "1px solid #FFFFFF",
                                }
                              : {
                                  background: "linear-gradient(180deg, #F7F7F8 0%, #FFFFFF 100%)",
                                  border: "1px solid #FFFFFF",
                                }),
                          }}
                        >
                          {/* Inner ring */}
                          <div className="absolute rounded-full" style={{
                            inset: "13%",
                            background: lesson.completed
                              ? "rgba(146,76,254,0.3)"
                              : lesson.current
                              ? "rgba(255,255,255,0.3)"
                              : "linear-gradient(180deg, rgba(70,4,102,0.1) 0%, rgba(191,150,255,0.1) 100%)",
                          }} />
                          <div className="relative z-10">
                            {lesson.locked ? (
                              <Lock className="w-5 h-5" style={{ color: "#460466" }} />
                            ) : lesson.completed ? (
                              <img src={lessonCompleteIcon} alt="completed" className="w-9 h-9" />
                            ) : (
                              <img src={lessonAvailableIcon} alt="available" className="w-9 h-9" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
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

      {selectedLesson && courseMap && (
        <LessonModal
          open={!!selectedLesson}
          onOpenChange={(open) => { if (!open) setSelectedLesson(null); }}
          lessonNumber={selectedLesson.id}
          titleRu={selectedLesson.titleRu}
          titleEn={selectedLesson.titleEn}
          descriptionRu={selectedLesson.descRu}
          descriptionEn={selectedLesson.descEn}
          totalLessons={courseMap.lessons.length}
          progress={courseMap.progress}
          onStart={() => {
            setCompletedLessons(prev => {
              const next = new Set(prev);
              next.add(selectedLesson.id);
              return next;
            });
          }}
        />
      )}
    </div>
  );
};

export default CourseLessons;
