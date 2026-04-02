import { useState } from "react";
import { ArrowLeft, BookOpen, ChevronDown } from "lucide-react";

const lessons = [
  { number: 1, title: "Введение в Telegram Gifts", active: true },
  { number: 4, title: "Как выбирать подарки для инвестиций", active: false },
  { number: 6, title: "Стратегии торговли на вторичном рынке", active: false },
  { number: 7, title: "Анализ трендов и популярных подарков", active: false },
];

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lessonOpen, setLessonOpen] = useState(true);

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
                {/* Back button */}
                <button
                  onClick={() => setLessonOpen(false)}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity mb-8"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Вернуться к курсу
                </button>

                {/* Lesson content */}
                <article className="prose prose-neutral max-w-none">
                  <h2 className="text-xl font-bold text-foreground mb-4">Введение в Telegram Gifts</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    Telegram Gifts — это новая функция в мессенджере Telegram, которая позволяет пользователям
                    дарить цифровые подарки друг другу. Эти подарки представляют собой уникальные цифровые
                    активы, которые можно коллекционировать, дарить и даже продавать.
                  </p>

                  <h3 className="text-lg font-bold text-foreground mb-3">Что такое Telegram Gifts?</h3>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    Telegram Gifts — это коллекционные цифровые предметы, которые существуют на блокчейне TON.
                    Каждый подарок уникален и имеет вою ценность на рынке. Вы можете приобрести подарки через
                    Telegram и отправить их своим контактам.
                  </p>

                  <h3 className="text-lg font-bold text-foreground mb-3">Как это работает?</h3>
                  <p className="text-foreground/80 leading-relaxed mb-2">
                    Система работает следующим образом:
                  </p>
                  <ul className="list-none space-y-1 text-foreground/80 mb-4 pl-0">
                    <li>Вы покупаете подарок в Telegram</li>
                    <li>Отправляете его другу или сохраняете в коллекции</li>
                    <li>Получатель может оставить подарок себе или продать его на вторичном рынке</li>
                    <li>Цена подарка может меняться в зависимости от спроса</li>
                  </ul>

                  <h3 className="text-lg font-bold text-foreground mb-3">Почему это интересно?</h3>
                  <p className="text-foreground/80 leading-relaxed">
                    Telegram Gifts открывает новые возможности для заработка и инвестиций. Редкие подарки могут
                    значительно вырасти в цене, а активная торговля позволяет получать прибыль от перепродажи.
                  </p>
                </article>
              </div>
            ) : (
              <div
                className="bg-[hsl(270,60%,93%)] rounded-2xl p-12 flex items-center justify-center min-h-[300px] cursor-pointer hover:bg-[hsl(270,60%,88%)] transition-colors"
                onClick={() => setLessonOpen(true)}
              >
                <span className="text-lg font-semibold text-[hsl(270,50%,40%)]">Выберите урок из списка</span>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:w-80 flex-shrink-0">
            <div className={`rounded-2xl p-4 sticky top-8 border border-border ${sidebarOpen ? "bg-card" : "bg-muted hover:bg-[hsl(270,60%,93%)]"} transition-colors`}>
              {/* Sidebar header */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`group flex items-center justify-between w-full rounded-xl px-4 py-2 ${
                  sidebarOpen ? "mb-4" : ""
                }`}
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

              {/* Lesson list */}
              {sidebarOpen && (
                <div className="space-y-3">
                  {lessons.map((lesson) => (
                    <button
                      key={lesson.number}
                      className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
                        lesson.active
                          ? "bg-accent border-primary"
                          : "bg-card border-border hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-secondary-foreground">T</span>
                        </div>
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
