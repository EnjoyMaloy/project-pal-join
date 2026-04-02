import { useState, useRef, useEffect } from "react";
import { ArrowLeft, BookOpen, ChevronDown } from "lucide-react";
import iconActive from "@/assets/icon-active.svg";
import iconInactive from "@/assets/icon-inactive.svg";

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
