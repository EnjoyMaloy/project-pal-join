import { useState, useRef, useEffect } from "react";
import { ArrowLeft, BookOpen, ChevronDown, X, BookOpenCheck, FileText, Paperclip } from "lucide-react";
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

const lessonsData = [
  {
    number: 1,
    title: "Введение в Telegram Gifts",
    description: "Узнаем, что такое Telegram Gifts, как они работают и почему это интересно.",
    reward: 500,
    progress: 100,
    hasInstruction: true,
    content: {
      heading: "Введение в Telegram Gifts",
      sections: [
        { text: "Telegram Gifts — это новая функция в мессенджере Telegram, которая позволяет пользователям дарить цифровые подарки друг другу. Эти подарки представляют собой уникальные цифровые активы, которые можно коллекционировать, дарить и даже продавать." },
        { heading: "Что такое Telegram Gifts?", text: "Telegram Gifts — это коллекционные цифровые предметы, которые существуют на блокчейне TON. Каждый подарок уникален и имеет вою ценность на рынке." },
        { heading: "Как это работает?", text: "Система работает следующим образом:", list: ["Вы покупаете подарок в Telegram", "Отправляете его другу или сохраняете в коллекции", "Получатель может оставить подарок себе или продать его на вторичном рынке", "Цена подарка может меняться в зависимости от спроса"] },
        { heading: "Почему это интересно?", text: "Telegram Gifts открывает новые возможности для заработка и инвестиций. Редкие подарки могут значительно вырасти в цене." },
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
      heading: "Как зарабатывают на подарках?",
      sections: [
        { text: "Выбор подарков для инвестиций — важный навык, который поможет вам получить максимальную прибыль." },
        { heading: "Критерии оценки", text: "При выборе подарка обращайте внимание на:", list: ["Редкость — чем реже подарок, тем выше потенциал роста", "Дизайн — привлекательные подарки пользуются большим спросом", "Тираж — ограниченные выпуски ценятся выше", "Тренды — следите за популярностью среди коллекционеров"] },
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
      heading: "Стратегии торговли на вторичном рынке",
      sections: [
        { text: "Вторичный рынок Telegram Gifts — это место, где можно покупать и продавать подарки." },
        { heading: "Основные стратегии", text: "Рассмотрим популярные подходы к торговле:", list: ["Покупка на спаде и продажа на росте", "Долгосрочное удержание редких подарков", "Быстрая перепродажа популярных предметов", "Диверсификация коллекции"] },
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
      heading: "Анализ трендов и популярных подарков",
      sections: [
        { text: "Умение анализировать тренды — ключ к успешной торговле." },
        { heading: "Инструменты анализа", text: "Для анализа трендов используйте:", list: ["Мониторинг цен на вторичном рынке", "Отслеживание объёмов продаж", "Анализ активности сообщества", "Изучение новых выпусков и анонсов"] },
      ],
    },
  },
];

const Index = () => {
  const { t } = useLanguage();
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

  // Close popover on outside click
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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-h1 text-foreground mb-3">
            {t("index.title")}
          </h1>
          <p className="text-[16px] font-normal leading-relaxed text-muted-foreground max-w-3xl">
            {t("index.description")}
          </p>
        </div>

        {/* Main layout */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Content area */}
          <div className="flex-1 min-w-0">
            {lessonOpen ? (
              <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
                <button
                  onClick={() => { setLessonOpen(false); setActiveLesson(-1); }}
                  className="text-btn-medium inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg hover:bg-violet-dark transition-colors mb-8"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Вернуться к курсу
                </button>

                <article className="prose prose-neutral max-w-none">
                  <h2 className="text-h2 text-foreground mb-4">{currentLesson.content.heading}</h2>
                  {currentLesson.content.sections.map((section, i) => (
                    <div key={i}>
                      {section.heading && (
                        <h3 className="text-h3 text-foreground mb-3">{section.heading}</h3>
                      )}
                      <p className="text-body-14 text-foreground/80 leading-relaxed mb-4">{section.text}</p>
                      {section.list && (
                        <ul className="list-none space-y-1 text-body-14 text-foreground/80 mb-4 pl-0">
                          {section.list.map((item, j) => (
                            <li key={j}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </article>
              </div>
            ) : (
              <div className="bg-secondary rounded-2xl p-8 min-h-[300px] flex flex-col items-center justify-center gap-6">
                <p className="text-subh-16-medium text-secondary-foreground mb-2">Уроки курса</p>
                <div className="flex flex-wrap justify-center gap-5">
                  {lessonsData.map((lesson, index) => (
                    <div key={lesson.number} className="relative flex flex-col items-center gap-2">
                      <button
                        data-lesson-circle
                        onClick={() => setPopoverIndex(popoverIndex === index ? null : index)}
                        className="flex flex-col items-center gap-2 group"
                      >
                        {/* Outer circle */}
                        <div
                          className={`relative flex items-center justify-center transition-all ${
                            popoverIndex === index ? "scale-110" : "group-hover:scale-110"
                          }`}
                          style={{
                            width: 54,
                            height: 54,
                            borderRadius: '50%',
                            background: 'linear-gradient(180deg, #F7F7F8 0%, #FFFFFF 100%)',
                            border: '1px solid #FFFFFF',
                            boxShadow: '0px 1px 4px rgba(70, 4, 102, 0.08)',
                          }}
                        >
                          {/* Inner circle */}
                          <div
                            className="flex items-center justify-center"
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              background: 'linear-gradient(180deg, rgba(70, 4, 102, 0.1) 0%, rgba(191, 150, 255, 0.1) 100%)',
                            }}
                          >
                            <span className="text-[18px] font-medium text-primary">{lesson.number}</span>
                          </div>
                          {lesson.hasInstruction && (
                            <span
                              className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                              style={{ background: 'hsl(var(--background))', border: '1px solid rgba(166, 108, 255, 0.25)' }}
                            >
                              <Paperclip className="w-2.5 h-2.5 text-primary" />
                            </span>
                          )}
                        </div>
                      </button>

                      {/* Popover card */}
                      {popoverIndex === index && (
                        <div
                          data-lesson-popover
                          className="absolute top-20 left-1/2 -translate-x-1/2 z-30 animate-in fade-in slide-in-from-top-2 duration-200"
                          style={{
                            width: 230,
                            background: '#FFFFFF',
                            border: '1px solid hsl(var(--border))',
                            boxShadow: '0px 4px 8px rgba(70, 4, 102, 0.1)',
                            borderRadius: 10,
                            overflow: 'hidden',
                          }}
                        >
                          {/* Header bar */}
                          <div style={{ background: 'hsl(var(--muted))', padding: '12px 9px' }}>
                            <span className="text-[12px] font-normal tracking-[0.01em] uppercase" style={{ color: 'hsl(var(--muted-foreground))' }}>
                              Урок {lesson.number}
                            </span>
                          </div>

                          {/* Content */}
                          <div style={{ padding: '10px 8px 0' }}>
                            {/* Title row */}
                            <div className="flex items-center gap-1.5">
                              <BookOpenCheck className="w-[18px] h-[18px] text-primary flex-shrink-0" />
                              <span className="text-[16px] font-medium leading-[100%]" style={{ color: 'hsl(var(--foreground))' }}>
                                {lesson.title}
                              </span>
                            </div>

                            {/* Description */}
                            <p className="text-[12px] font-normal leading-[140%]" style={{ color: 'hsl(var(--muted-foreground))', marginTop: 6, paddingLeft: 24 }}>
                              {lesson.description}
                            </p>
                            {lesson.hasInstruction && (
                              <div className="flex items-center gap-1.5 mt-2" style={{ paddingLeft: 24 }}>
                                <span
                                  className="inline-flex items-center gap-1 text-[11px] font-medium"
                                  style={{
                                    color: '#460466',
                                    background: 'hsl(var(--secondary))',
                                    padding: '3px 8px',
                                    borderRadius: 6,
                                  }}
                                >
                                  <Paperclip className="w-3 h-3" />
                                  Инструкция
                                </span>
                              </div>
                            )}
                          </div>
                          <div style={{ borderTop: '1px solid hsl(var(--muted))', margin: '10px 0 0' }} />

                          {/* Stats row */}
                          <div className="flex justify-between" style={{ padding: '10px 8px' }}>
                            <div className="flex flex-col" style={{ gap: 6 }}>
                              <span className="text-[14px] font-normal leading-[100%]" style={{ color: 'hsl(var(--muted-foreground))' }}>Пройдено:</span>
                              <span className="text-[16px] font-medium leading-[100%] tracking-[0.01em]" style={{ color: lesson.progress > 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}>
                                {lesson.progress}%
                              </span>
                            </div>
                            <div className="flex flex-col" style={{ gap: 6 }}>
                              <span className="text-[14px] font-normal leading-[100%]" style={{ color: 'hsl(var(--foreground))' }}>Награда</span>
                              <div className="flex items-center" style={{ gap: 4 }}>
                                <span
                                  className="inline-flex items-center justify-center rounded-full text-[8px] font-bold"
                                  style={{ width: 16, height: 16, background: '#FF7D60', color: '#FFFFFF' }}
                                >S</span>
                                <span className="text-[14px] font-medium leading-[100%] tracking-[-0.01em]" style={{ color: 'hsl(var(--foreground))' }}>
                                  {lesson.reward.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Button */}
                          <div style={{ padding: '0 8px 8px' }}>
                            <button
                              onClick={() => { setPopoverIndex(null); setStoryIndex(index); }}
                              className="w-full text-[14px] font-medium tracking-[0.01em] hover:opacity-90 transition-opacity"
                              style={{
                                background: 'hsl(var(--foreground))',
                                color: 'hsl(var(--background))',
                                borderRadius: 8,
                                height: 32,
                              }}
                            >
                              {lesson.progress === 100 ? "Пройти снова" : lesson.progress > 0 ? "Продолжить" : "Начать"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:w-80 flex-shrink-0">
            <div
              className={`group rounded-2xl sticky top-8 border border-border ${sidebarOpen ? "bg-card p-4" : "bg-muted hover:bg-violet-super-light cursor-pointer"} transition-all`}
              onClick={() => !sidebarOpen && setSidebarOpen(true)}
            >
              <button
                onClick={(e) => { if (sidebarOpen) { e.stopPropagation(); setSidebarOpen(false); } }}
                className={`flex items-center justify-between w-full rounded-xl px-4 py-4 ${sidebarOpen ? "" : "pointer-events-none"}`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className={`w-5 h-5 text-foreground/70 transition-transform duration-200 ${!sidebarOpen ? "group-hover:scale-110" : ""}`} />
                  <span className={`text-[22px] font-normal leading-[90%] tracking-[0.01em] text-foreground transition-transform duration-200 origin-left ${!sidebarOpen ? "group-hover:scale-[1.03]" : ""}`}>Инструкции из курса</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${
                    sidebarOpen ? "rotate-180" : "group-hover:translate-y-1"
                  }`}
                />
              </button>

              {/* Lesson list with smooth animation */}
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
                           ? "bg-secondary border-primary"
                          : "bg-background border-border hover:bg-violet-super-light hover:border-secondary hover:-translate-y-0.5"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {index === activeLesson ? (
                          <IconActive className="w-7 h-7 flex-shrink-0 mt-0.5 text-secondary-foreground" />
                        ) : (
                          <IconInactive className="w-7 h-7 flex-shrink-0 mt-0.5 text-violet-light group-hover:text-primary" />
                        )}
                        <div>
                          {index === activeLesson ? (
                            <span className="text-caption-12 font-medium inline-block text-secondary-foreground bg-white/80 rounded px-2 py-0.5 mb-1">
                              Урок {lesson.number}
                            </span>
                          ) : (
                            <span className="text-caption-12 font-medium inline-block text-violet-light group-hover:text-primary bg-transparent rounded px-2 py-0.5 mb-1">
                              Урок {lesson.number}
                            </span>
                          )}
                          <span className={`text-[18px] font-normal leading-[100%] block ${
                            index === activeLesson ? "text-secondary-foreground" : "text-foreground"
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
            {/* Progress dots */}
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

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-subh-14 text-foreground">Урок {lessonsData[storyIndex].number}</span>
              <button onClick={() => setStoryIndex(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              <h2 className="text-h3 text-foreground mb-3">{lessonsData[storyIndex].content.heading}</h2>
              {lessonsData[storyIndex].content.sections.map((section, i) => (
                <div key={i} className="mb-3">
                  {section.heading && (
                    <h3 className="text-subh-14 text-foreground mb-1.5">{section.heading}</h3>
                  )}
                  <p className="text-body-14 text-foreground/80 leading-relaxed">{section.text}</p>
                  {section.list && (
                    <ul className="text-body-14 text-foreground/80 mt-1.5 space-y-1 pl-4 list-disc">
                      {section.list.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom button */}
            <div className="p-4 border-t border-border">
              {storyIndex < lessonsData.length - 1 ? (
                <button
                  onClick={() => setStoryIndex(storyIndex + 1)}
                  className="w-full text-btn-medium bg-primary text-primary-foreground py-3 rounded-xl hover:bg-violet-dark transition-colors"
                >
                  Далее
                </button>
              ) : (
                <button
                  onClick={() => setStoryIndex(null)}
                  className="w-full text-btn-medium bg-primary text-primary-foreground py-3 rounded-xl hover:bg-violet-dark transition-colors"
                >
                  Завершить
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
