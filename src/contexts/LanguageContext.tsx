import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "ru" | "en";

const translations = {
  // Navbar
  "nav.search": { ru: "Найти инструкцию...", en: "Search instructions..." },
  "nav.logout": { ru: "Выйти", en: "Log out" },
  "nav.login": { ru: "Войти", en: "Log in" },

  // Sidebar
  "sidebar.home": { ru: "Главная", en: "Home" },
  "sidebar.catalog": { ru: "Каталог", en: "Catalog" },
  "sidebar.myCourses": { ru: "Мои курсы", en: "My Courses" },
  "sidebar.tasks": { ru: "Задания", en: "Tasks" },
  "sidebar.myToken": { ru: "Мой токен", en: "My Token" },
  "sidebar.referral": { ru: "Реферальная программа", en: "Referral Program" },
  "sidebar.instructions": { ru: "Инструкции", en: "Instructions" },

  // Instructions page
  "instructions.all": { ru: "Все", en: "All" },
  "instructions.favorites": { ru: "Избранное", en: "Favorites" },
  "instructions.allTopics": { ru: "Все темы", en: "All Topics" },
  "instructions.sort": { ru: "Сортировка:", en: "Sort:" },
  "instructions.newest": { ru: "Сначала новые", en: "Newest First" },
  "instructions.popular": { ru: "Популярные", en: "Popular" },
  "instructions.loading": { ru: "Загрузка...", en: "Loading..." },
  "instructions.noFavorites": { ru: "Нет избранных инструкций", en: "No favorite instructions" },
  "instructions.notFound": { ru: "Ничего не найдено", en: "Nothing found" },
  "instructions.linkCopied": { ru: "Ссылка скопирована", en: "Link copied" },

  // Index / My Courses page
  "index.title": { ru: "Быстрый старт в Telegram Gifts", en: "Quick Start with Telegram Gifts" },
  "index.description": { ru: "Курс покажет, как пользоваться Telegram Gifts и зарабатывать на них. Ты разберёшься в механике, поймёшь, какие подарки востребованы, и узнаешь о секретах торговли на вторичном рынке.", en: "This course will show you how to use Telegram Gifts and earn from them. You'll understand the mechanics, learn which gifts are in demand, and discover secondary market trading secrets." },
  "index.backToCourse": { ru: "Вернуться к курсу", en: "Back to course" },
  "index.courseLessons": { ru: "Уроки курса", en: "Course Lessons" },
  "index.courseInstructions": { ru: "Инструкции из курса", en: "Course Instructions" },
  "index.lesson": { ru: "Урок", en: "Lesson" },
  "index.instruction": { ru: "Инструкция", en: "Instruction" },
  "index.completed": { ru: "Пройдено:", en: "Completed:" },
  "index.reward": { ru: "Награда", en: "Reward" },
  "index.retake": { ru: "Пройти снова", en: "Retake" },
  "index.continue": { ru: "Продолжить", en: "Continue" },
  "index.start": { ru: "Начать", en: "Start" },
  "index.next": { ru: "Далее", en: "Next" },
  "index.finish": { ru: "Завершить", en: "Finish" },
} as const;

type TranslationKey = keyof typeof translations;

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      return (localStorage.getItem("app-lang") as Lang) || "en";
    } catch { return "en"; }
  });

  const changeLang = (newLang: Lang) => {
    setLang(newLang);
    localStorage.setItem("app-lang", newLang);
  };

  const t = (key: TranslationKey): string => translations[key][lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
