import { useState, useRef, useEffect } from "react";
import { ArrowLeft, BookOpen, ChevronDown } from "lucide-react";

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
    content: {
      heading: "Введение в Telegram Gifts",
      sections: [
        {
          text: "Telegram Gifts — это новая функция в мессенджере Telegram, которая позволяет пользователям дарить цифровые подарки друг другу. Эти подарки представляют собой уникальные цифровые активы, которые можно коллекционировать, дарить и даже продавать.",
        },
        {
          heading: "Что такое Telegram Gifts?",
          text: "Telegram Gifts — это коллекционные цифровые предметы, которые существуют на блокчейне TON. Каждый подарок уникален и имеет вою ценность на рынке. Вы можете приобрести подарки через Telegram и отправить их своим контактам.",
        },
        {
          heading: "Как это работает?",
          text: "Система работает следующим образом:",
          list: [
            "Вы покупаете подарок в Telegram",
            "Отправляете его другу или сохраняете в коллекции",
            "Получатель может оставить подарок себе или продать его на вторичном рынке",
            "Цена подарка может меняться в зависимости от спроса",
          ],
        },
        {
          heading: "Почему это интересно?",
          text: "Telegram Gifts открывает новые возможности для заработка и инвестиций. Редкие подарки могут значительно вырасти в цене, а активная торговля позволяет получать прибыль от перепродажи.",
        },
      ],
    },
  },
  {
    number: 4,
    title: "Как выбирать подарки для инвестиций",
    content: {
      heading: "Как выбирать подарки для инвестиций",
      sections: [
        {
          text: "Выбор подарков для инвестиций — важный навык, который поможет вам получить максимальную прибыль. В этом уроке мы рассмотрим ключевые критерии выбора.",
        },
        {
          heading: "Критерии оценки",
          text: "При выборе подарка обращайте внимание на:",
          list: [
            "Редкость — чем реже подарок, тем выше потенциал роста",
            "Дизайн — привлекательные подарки пользуются большим спросом",
            "Тираж — ограниченные выпуски ценятся выше",
            "Тренды — следите за популярностью среди коллекционеров",
          ],
        },
      ],
    },
  },
  {
    number: 6,
    title: "Стратегии торговли на вторичном рынке",
    content: {
      heading: "Стратегии торговли на вторичном рынке",
      sections: [
        {
          text: "Вторичный рынок Telegram Gifts — это место, где можно покупать и продавать подарки. Правильная стратегия поможет увеличить ваш доход.",
        },
        {
          heading: "Основные стратегии",
          text: "Рассмотрим популярные подходы к торговле:",
          list: [
            "Покупка на спаде и продажа на росте",
            "Долгосрочное удержание редких подарков",
            "Быстрая перепродажа популярных предметов",
            "Диверсификация коллекции",
          ],
        },
      ],
    },
  },
  {
    number: 7,
    title: "Анализ трендов и популярных подарков",
    content: {
      heading: "Анализ трендов и популярных подарков",
      sections: [
        {
          text: "Умение анализировать тренды — ключ к успешной торговле. В этом уроке вы узнаете, как отслеживать и предсказывать популярность подарков.",
        },
        {
          heading: "Инструменты анализа",
          text: "Для анализа трендов используйте:",
          list: [
            "Мониторинг цен на вторичном рынке",
            "Отслеживание объёмов продаж",
            "Анализ активности сообщества",
            "Изучение новых выпусков и анонсов",
          ],
        },
      ],
    },
  },
];

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeLesson, setActiveLesson] = useState(0);
  const [lessonOpen, setLessonOpen] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState(0);

  useEffect(() => {
    if (listRef.current) {
      setListHeight(sidebarOpen ? listRef.current.scrollHeight : 0);
    }
  }, [sidebarOpen]);

  const handleLessonClick = (index: number) => {
    setActiveLesson(index);
    setLessonOpen(true);
  };

  const currentLesson = lessonsData[activeLesson];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Быстрый старт в Telegram Gifts
          </h1>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-3xl">
            Курс покажет, как пользоваться Telegram Gifts и зарабатывать на них. Ты разберёшься в механике,
            поймёшь, какие подарки востребованы, и узнаешь о секретах торговли на вторичном рынке.
          </p>
        </div>

        {/* Main layout */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Content area */}
          <div className="flex-1 min-w-0">
            {lessonOpen ? (
              <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
                <button
                  onClick={() => setLessonOpen(false)}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity mb-8"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Вернуться к курсу
                </button>

                <article className="prose prose-neutral max-w-none">
                  <h2 className="text-xl font-bold text-foreground mb-4">{currentLesson.content.heading}</h2>
                  {currentLesson.content.sections.map((section, i) => (
                    <div key={i}>
                      {section.heading && (
                        <h3 className="text-lg font-bold text-foreground mb-3">{section.heading}</h3>
                      )}
                      <p className="text-foreground/80 leading-relaxed mb-4">{section.text}</p>
                      {section.list && (
                        <ul className="list-none space-y-1 text-foreground/80 mb-4 pl-0">
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
              <div className="bg-[hsl(270,60%,93%)] rounded-2xl p-12 flex items-center justify-center min-h-[300px] cursor-pointer hover:bg-[hsl(270,60%,88%)] transition-colors"
                onClick={() => setLessonOpen(true)}
              >
                <span className="text-lg font-semibold text-[hsl(270,50%,40%)]">Выберите урок из списка</span>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:w-80 flex-shrink-0">
            <div className={`rounded-2xl p-4 sticky top-8 border border-border ${sidebarOpen ? "bg-card" : "bg-muted hover:bg-[hsl(270,60%,93%)]"} transition-colors`}>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`group flex items-center justify-between w-full rounded-xl px-4 py-2`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-foreground/70" />
                  <span className="text-lg font-bold text-foreground">Инструкции из курса</span>
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
                      onClick={() => handleLessonClick(index)}
                      className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
                        index === activeLesson
                          ? "bg-accent border-primary"
                          : "bg-card border-border hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={index === activeLesson ? iconActive : iconInactive}
                          alt=""
                          className="w-7 h-7 flex-shrink-0 mt-0.5"
                        />
                        <div>
                          <span className="text-xs font-medium text-secondary-foreground block mb-1">
                            Урок {lesson.number}
                          </span>
                          <span className="text-sm font-semibold text-foreground leading-snug block">
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
    </div>
  );
};

export default Index;
