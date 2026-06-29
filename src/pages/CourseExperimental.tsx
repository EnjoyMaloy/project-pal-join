import { useState } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePurchaseStore } from "@/hooks/usePurchaseStore";
import {
  Star,
  Users,
  Globe,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Play,
  Trophy,
  Award,
  Sparkles,
  BadgeCheck,
  Send,
  Twitter,
  Youtube,
  Instagram,
  LayoutGrid,
  BarChart,
} from "lucide-react";
import PremiumStarIcon from "@/components/icons/PremiumStarIcon";
import { Button } from "@/components/ui/button";
import PaymentModal from "@/components/PaymentModal";
import courseHeroAsset from "@/assets/course-experimental-hero.png.asset.json";

type Scenario = "free" | "sub" | "sub-trial" | "paid" | "paid-trial";

interface Review {
  username: string;
  avatar: string;
  rating: number;
  timeRu: string;
  timeEn: string;
  textRu: string;
  textEn: string;
}

interface CourseConfig {
  id: string;
  scenario: Scenario;
  titleRu: string;
  titleEn: string;
  descriptionRu: string;
  descriptionEn: string;
  categoryRu: string;
  categoryEn: string;
  levelRu: string;
  levelEn: string;
  image: string;
  rating: number;
  reviewCount: number;
  students: number;
  updatedRu: string;
  updatedEn: string;
  price: number | null;        // one-time price (paid scenarios)
  monthlyFrom?: number;        // shown for subscription scenarios
  trialLessons?: number;       // for *-trial scenarios
  color: { base: string; light: string; superLight: string; dark: string };
  lessons: { titleRu: string; titleEn: string; min: number }[];
  reviews: Review[];
}

const COLORS = {
  red:   { base: "#FF3D4D", light: "#FFD8DC", superLight: "#FFEEF0", dark: "#7A0A14" },
  blue:  { base: "#3D8BFF", light: "#D5E5FF", superLight: "#EDF3FF", dark: "#0A2E7A" },
  green: { base: "#22C55E", light: "#CFF3DC", superLight: "#ECFBF0", dark: "#0D4A24" },
  amber: { base: "#F59E0B", light: "#FCE7BD", superLight: "#FEF5E1", dark: "#7A4A07" },
  purple:{ base: "#A66CFF", light: "#E5D6FF", superLight: "#F3ECFF", dark: "#460466" },
  teal:  { base: "#14B8A6", light: "#C7F0EA", superLight: "#E7F8F5", dark: "#0D4A44" },
};

const REVIEWS_DEMO: Review[] = [
  {
    username: "Shahriyar2100",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 5,
    timeRu: "1 неделю назад",
    timeEn: "1 week ago",
    textRu: "Да, это именно те шаблоны. Хотите сделать один специально для своего курса? Просто напишите мне: 1. *Название курса* 2. *Оценка*, которую вы бы поставили из 5 3. *1-2 вещи*, которые вам понравились 4. *1 вещь*, которую вы бы улучшили. Я превращу это в аккуратный отзыв, который вы сможете опубликовать за 10 секунд.",
    textEn: "Yep, those are the templates. Want to make one specific to your course? Just drop me: 1. *Course name* 2. *Rating* you'd give /5 3. *1-2 things you liked* 4. *1 thing you'd improve* I'll turn it into a clean review you can post in 10 seconds."
  },
  {
    username: "pawansatoshi",
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 5,
    timeRu: "1 неделю назад",
    timeEn: "1 week ago",
    textRu: "Отличное введение. Курс четко объясняет ключевые понятия и даёт практические инсайты. Легко понять новичкам, при этом полезно и продвинутым.",
    textEn: "Great introduction. The course clearly explains the key concepts and gives practical insights. Easy to understand for beginners while still useful for advanced users."
  }
];

const REVIEWS_FREE: Review[] = [
  {
    username: "crypto_fan",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 5,
    timeRu: "2 месяца назад",
    timeEn: "2 months ago",
    textRu: "Отличный бесплатный курс для начинающих! Всё понятно объясняется, быстро разобрался с Telegram Gifts.",
    textEn: "Great free course for beginners! Everything is explained clearly, I quickly figured out Telegram Gifts.",
  },
  REVIEWS_DEMO[1],
];

const REVIEWS_INVEST: Review[] = [
  {
    username: "elijah_andikan",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 5,
    timeRu: "5 месяцев назад",
    timeEn: "5 months ago",
    textRu: "Рекомендую на 100%. Я новичок в крипте, и часто видел, как KOL и блогеры рекомендуют проекты — всегда было интересно, как они их выбирают. Курс закрыл этот вопрос.",
    textEn: "I 100% recommend this course. I'm a newbie in crypto and I usually see how KOLs recommend projects on Twitter — I always wondered how they pick them. This course solved that.",
  },
  {
    username: "patr1ckk",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 5,
    timeRu: "5 месяцев назад",
    timeEn: "5 months ago",
    textRu: "Курс отличный. По делу, без воды, чётко по шагам — что и зачем проверять в проекте.",
    textEn: "Great course. To the point, no fluff, clear steps — what to check in a project and why.",
  },
];

const COURSE_CONFIGS: Record<string, CourseConfig> = {
  "1": {
    id: "1",
    scenario: "free",
    titleRu: "Telegram Gifts: цифровые подарки и NFT",
    titleEn: "Telegram Gifts: digital gifts & NFTs",
    descriptionRu: "Бесплатный курс о том, как использовать Telegram Gifts: создавать уникальные цифровые подарки, собирать коллекции и зарабатывать на NFT-подарках в экосистеме Telegram.",
    descriptionEn: "A free course on Telegram Gifts: create unique digital gifts, build collections, and earn from NFT gifts inside the Telegram ecosystem.",
    categoryRu: "Web3 и DeFi",
    categoryEn: "Web3 & DeFi",
    levelRu: "Начальный",
    levelEn: "Beginner",
    image: "https://images.unsplash.com/photo-1621504450181-5d356f61d307?w=1200&h=800&fit=crop",
    rating: 4.9,
    reviewCount: 85,
    students: 371,
    updatedRu: "Обновлён 10.04.26",
    updatedEn: "Updated 04/10/26",
    price: null,
    color: COLORS.green,
    lessons: [
      { titleRu: "Что такое Telegram Gifts", titleEn: "What are Telegram Gifts", min: 6 },
      { titleRu: "Создание первого подарка", titleEn: "Creating your first gift", min: 10 },
      { titleRu: "Коллекции и редкость", titleEn: "Collections & rarity", min: 12 },
      { titleRu: "Монетизация подарков", titleEn: "Monetizing gifts", min: 14 },
    ],
    reviews: REVIEWS_FREE,
  },
  "2": {
    id: "2",
    scenario: "sub",
    titleRu: "Анализ проектов: как выбирать перспективное",
    titleEn: "Project analysis: picking winners",
    descriptionRu: "Научимся анализировать потенциальные проекты для инвестиций: читать whitepaper, проверять токеномику и оценивать команду. Понятные инструменты для выбора и защиты от скама.",
    descriptionEn: "Learn to analyze investment projects: read whitepapers, verify tokenomics, and evaluate teams. Clear tools for picking projects and avoiding scams.",
    categoryRu: "Инвестиции",
    categoryEn: "Investments",
    levelRu: "Средний",
    levelEn: "Intermediate",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
    rating: 4.9,
    reviewCount: 1010,
    students: 35419,
    updatedRu: "Обновлён 07.04.26",
    updatedEn: "Updated 04/07/26",
    price: null,
    monthlyFrom: 6,
    color: COLORS.blue,
    lessons: [
      { titleRu: "Введение в анализ", titleEn: "Introduction to analysis", min: 10 },
      { titleRu: "Чтение Whitepaper", titleEn: "Reading whitepapers", min: 18 },
      { titleRu: "Токеномика", titleEn: "Tokenomics", min: 22 },
      { titleRu: "Оценка команды", titleEn: "Evaluating the team", min: 16 },
      { titleRu: "Чек-лист: красные флаги", titleEn: "Red flags checklist", min: 14 },
    ],
    reviews: REVIEWS_INVEST,
  },
  "6": {
    id: "6",
    scenario: "sub-trial",
    titleRu: "Основы крипты с триалом",
    titleEn: "Crypto basics with trial",
    descriptionRu: "Курс с триалом — пройдите первые 2 урока бесплатно, чтобы оценить материал. Доступ к остальным урокам открывается по подписке Premium.",
    descriptionEn: "A course with a trial — complete the first 2 lessons for free to evaluate the material. The rest unlocks with a Premium subscription.",
    categoryRu: "Основы крипты",
    categoryEn: "Crypto Basics",
    levelRu: "Начальный",
    levelEn: "Beginner",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=800&fit=crop",
    rating: 4.7,
    reviewCount: 312,
    students: 1024,
    updatedRu: "Обновлён 01.06.26",
    updatedEn: "Updated 06/01/26",
    price: null,
    monthlyFrom: 6,
    trialLessons: 2,
    color: COLORS.purple,
    lessons: [
      { titleRu: "Знакомство", titleEn: "Introduction", min: 8 },
      { titleRu: "Основные концепции", titleEn: "Core concepts", min: 12 },
      { titleRu: "Практика (Премиум)", titleEn: "Practice (Premium)", min: 18 },
      { titleRu: "Продвинутые темы", titleEn: "Advanced topics", min: 22 },
    ],
    reviews: REVIEWS_DEMO,
  },
  "7": {
    id: "7",
    scenario: "paid",
    titleRu: "Инструменты Web3-исследователя",
    titleEn: "Web3 researcher toolkit",
    descriptionRu: "Самостоятельный платный курс, не входит в подписку Premium. Доступ открывается только после разовой покупки.",
    descriptionEn: "A standalone paid course, not included in the Premium subscription. Access is granted only after a one-time purchase.",
    categoryRu: "Инструменты",
    categoryEn: "Tools",
    levelRu: "Средний",
    levelEn: "Intermediate",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=800&fit=crop",
    rating: 4.6,
    reviewCount: 128,
    students: 512,
    updatedRu: "Обновлён 05.06.26",
    updatedEn: "Updated 06/05/26",
    price: 79,
    color: COLORS.amber,
    lessons: [
      { titleRu: "Введение", titleEn: "Introduction", min: 8 },
      { titleRu: "Основы", titleEn: "Basics", min: 16 },
      { titleRu: "Боевые кейсы", titleEn: "Real-world cases", min: 24 },
      { titleRu: "Практика", titleEn: "Hands-on practice", min: 28 },
      { titleRu: "Итог", titleEn: "Summary", min: 10 },
    ],
    reviews: REVIEWS_DEMO,
  },
  "8": {
    id: "8",
    scenario: "paid-trial",
    titleRu: "Глубокая практика с триалом",
    titleEn: "Deep practice with trial",
    descriptionRu: "Самостоятельный платный курс вне подписки. Первые 3 урока доступны бесплатно — далее открывайте доступ покупкой курса.",
    descriptionEn: "Standalone paid course outside the subscription. First 3 lessons are free — unlock the rest with a one-time purchase.",
    categoryRu: "Инструменты",
    categoryEn: "Tools",
    levelRu: "Продвинутый",
    levelEn: "Advanced",
    image: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=1200&h=800&fit=crop",
    rating: 4.7,
    reviewCount: 156,
    students: 640,
    updatedRu: "Обновлён 08.06.26",
    updatedEn: "Updated 06/08/26",
    price: 89,
    trialLessons: 3,
    color: COLORS.teal,
    lessons: [
      { titleRu: "Урок 1 (бесплатно)", titleEn: "Lesson 1 (free)", min: 8 },
      { titleRu: "Урок 2 (бесплатно)", titleEn: "Lesson 2 (free)", min: 12 },
      { titleRu: "Урок 3 (бесплатно)", titleEn: "Lesson 3 (free)", min: 14 },
      { titleRu: "Урок 4 (после покупки)", titleEn: "Lesson 4 (after purchase)", min: 18 },
      { titleRu: "Урок 5 (после покупки)", titleEn: "Lesson 5 (after purchase)", min: 22 },
    ],
    reviews: REVIEWS_DEMO,
  },
  "9": {
    id: "9",
    scenario: "sub",
    titleRu: "Экспериментальная стр курса",
    titleEn: "Experimental course page",
    descriptionRu: "Полностью переосмысленная страница курса — больше визуала, больше воздуха, больше пользы. Узнайте, как мы экспериментируем с подачей образовательного контента.",
    descriptionEn: "A fully rethought course page — more visual, more breathing room, more value. See how we experiment with educational delivery.",
    categoryRu: "Web3 и DeFi",
    categoryEn: "Web3 & DeFi",
    levelRu: "Средний",
    levelEn: "Intermediate",
    image: courseHeroAsset.url,
    rating: 4.95,
    reviewCount: 128,
    students: 2480,
    updatedRu: "Обновлён 12.06.26",
    updatedEn: "Updated 06/12/26",
    price: null,
    monthlyFrom: 6,
    color: COLORS.red,
    lessons: [
      { titleRu: "Что такое эксперименты в Web3", titleEn: "What are Web3 experiments", min: 8 },
      { titleRu: "Подготовка окружения", titleEn: "Setting up environment", min: 12 },
      { titleRu: "Первый сценарий", titleEn: "First scenario", min: 12 },
      { titleRu: "Архитектура решений", titleEn: "Solution architecture", min: 18 },
      { titleRu: "Практика: запуск", titleEn: "Practice: launch", min: 22 },
      { titleRu: "Разбор кейсов", titleEn: "Case studies", min: 30 },
      { titleRu: "Постановка задачи", titleEn: "Define the task", min: 15 },
      { titleRu: "Реализация", titleEn: "Build", min: 25 },
      { titleRu: "Защита и фидбек", titleEn: "Review & feedback", min: 15 },
    ],
    reviews: REVIEWS_DEMO,
  },
};

const rewards = [
  { icon: Trophy, titleRu: "NFT-сертификат", titleEn: "NFT certificate", descRu: "Уникальный on-chain сертификат об окончании", descEn: "Unique on-chain certificate of completion" },
  { icon: Award, titleRu: "Бейдж в профиле", titleEn: "Profile badge", descRu: "Постоянный бейдж выпускника курса", descEn: "Permanent course graduate badge" },
  { icon: Sparkles, titleRu: "500 XP", titleEn: "500 XP", descRu: "Опыт идёт в общий рейтинг", descEn: "XP counts toward your global rating" },
  { icon: BadgeCheck, titleRu: "Доступ в чат", titleEn: "Private chat", descRu: "Закрытый чат выпускников курса", descEn: "Closed chat for graduates" },
];

const CourseExperimental = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const store = usePurchaseStore();
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [authorTab, setAuthorTab] = useState<"courses" | "about">("courses");
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const { id: routeId } = useParams<{ id: string }>();

  const config = COURSE_CONFIGS[routeId ?? "9"] ?? COURSE_CONFIGS["9"];
  const COURSE_ID = config.id;
  const COURSE_COLOR = config.color;
  const IMG = config.image;
  const lessons = config.lessons;
  const reviews = config.reviews;

  const title = lang === "ru" ? config.titleRu : config.titleEn;
  const description = lang === "ru" ? config.descriptionRu : config.descriptionEn;
  const category = lang === "ru" ? config.categoryRu : config.categoryEn;
  const level = lang === "ru" ? config.levelRu : config.levelEn;
  const updated = lang === "ru" ? config.updatedRu : config.updatedEn;

  const isPurchased = store.purchasedCourses.includes(COURSE_ID);
  const hasSubscription = store.subscription?.active;
  const isStandalone = config.scenario === "paid" || config.scenario === "paid-trial";
  const isFree = config.scenario === "free";
  const hasTrial = config.scenario === "sub-trial" || config.scenario === "paid-trial";
  const isOwned = isFree || isPurchased || (!isStandalone && hasSubscription);

  const cta = () => (isOwned ? navigate(`/course/${COURSE_ID}/lessons`) : setPaymentOpen(true));
  const startTrial = () => navigate(`/course/${COURSE_ID}/lessons`);

  // CTA label per scenario
  let ctaLabel = lang === "ru" ? "Начать обучение" : "Start learning";
  if (!isOwned) {
    if (config.scenario === "paid" || config.scenario === "paid-trial") {
      ctaLabel = lang === "ru" ? `Купить за $${config.price}` : `Buy for $${config.price}`;
    } else {
      ctaLabel = lang === "ru" ? "Открыть доступ" : "Get access";
    }
  }

  const filteredLessons = lessons.filter(l => {
    const q = searchQuery.toLowerCase();
    return (
      l.titleRu.toLowerCase().includes(q) ||
      l.titleEn.toLowerCase().includes(q)
    );
  });

  const totalLessons = filteredLessons.length;
  const totalMin = filteredLessons.reduce((s, l) => s + l.min, 0);

  // Price block per scenario
  const PriceBlock = () => {
    if (isFree) {
      return (
        <div className="flex flex-col">
          <span className="text-caption-12 mb-1.5 tracking-wide uppercase">
            {lang === "ru" ? "Стоимость" : "Price"}
          </span>
          <span className="text-[36px] font-light tracking-[-0.02em] leading-none text-foreground">
            {lang === "ru" ? "Бесплатно" : "Free"}
          </span>
        </div>
      );
    }
    if (isStandalone) {
      return (
        <div className="flex flex-col">
          <span className="text-caption-12 mb-1.5 tracking-wide uppercase">
            {lang === "ru" ? "Разовая покупка" : "One-time"}
          </span>
          <div className="flex items-baseline gap-1 tabular-nums">
            <span className="text-[20px] font-normal text-muted-foreground leading-none">$</span>
            <span className="text-[44px] font-light tracking-[-0.02em] leading-none text-foreground">{config.price}</span>
          </div>
        </div>
      );
    }
    // subscription
    return (
      <div className="flex flex-col">
        <span className="text-caption-12 mb-1.5 tracking-wide uppercase">
          {lang === "ru" ? "от" : "from"}
        </span>
        <div className="flex items-baseline gap-1 tabular-nums">
          <span className="text-[20px] font-normal text-muted-foreground leading-none">$</span>
          <span className="text-[44px] font-light tracking-[-0.02em] leading-none text-foreground">{config.monthlyFrom ?? 6}</span>
          <span className="text-[16px] font-normal text-muted-foreground leading-none ml-0.5">
            {lang === "ru" ? "/мес" : "/mo"}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full px-4 md:px-8 py-6 md:py-8">

        {/* HERO */}
        <div className="relative overflow-hidden rounded-2xl border border-border mb-8" style={{ backgroundColor: COURSE_COLOR.superLight }}>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(120% 90% at 100% 0%, ${COURSE_COLOR.light} 0%, transparent 60%), radial-gradient(120% 90% at 0% 100%, ${COURSE_COLOR.base}33 0%, transparent 55%)`,
            }}
          />
          <div className="relative grid md:grid-cols-[1.1fr_1fr] gap-0">
            {/* Left text */}
            <div className="p-6 md:p-10 flex flex-col justify-between gap-8">
              <div>
                <div className="flex items-center gap-2 mb-5 flex-wrap">
                  {!isFree && !isStandalone && (
                    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-body-12 font-medium text-violet-super-dark border border-[rgba(146,76,254,0.15)] bg-[rgba(217,192,255,0.55)]">
                      <PremiumStarIcon className="w-3.5 h-3.5" fill="currentColor" />
                      {lang === "ru" ? "Премиум" : "Premium"}
                    </span>
                  )}
                  {isFree && (
                    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-body-12 font-medium text-emerald-700 border border-emerald-200 bg-emerald-50">
                      {lang === "ru" ? "Бесплатно" : "Free"}
                    </span>
                  )}
                  {isStandalone && (
                    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-body-12 font-medium text-amber-800 border border-amber-200 bg-amber-50">
                      {lang === "ru" ? "Отдельный курс" : "Standalone"}
                    </span>
                  )}
                  {hasTrial && (
                    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-body-12 font-medium text-foreground border border-border bg-background">
                      {lang === "ru"
                        ? `Первые ${config.trialLessons} урока бесплатно`
                        : `First ${config.trialLessons} lessons free`}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-body-12 font-medium text-foreground border border-border bg-background">
                    <LayoutGrid className="w-3.5 h-3.5 text-muted-foreground" />
                    {category}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-body-12 font-medium text-foreground border border-border bg-background">
                    <BarChart className="w-3.5 h-3.5 text-muted-foreground" />
                    {level}
                  </span>
                </div>

                <h1 className="text-[40px] md:text-[52px] leading-[0.95] font-medium tracking-tight text-foreground mb-5">
                  {title}
                </h1>
                <p className="text-[18px] md:text-[20px] leading-relaxed text-muted-foreground max-w-[580px] mb-6">
                  {description}
                </p>
              </div>

              {/* Stat row */}
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-[16px] text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-orange-400 text-orange-400" />
                  <span className="font-semibold text-foreground">{config.rating}</span>
                  <span>({config.reviewCount} {lang === "ru" ? "отзывов" : "reviews"})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{config.students.toLocaleString()} {lang === "ru" ? "учеников" : "students"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{updated}</span>
                </div>
              </div>

              {/* CTA */}
              <div className="flex items-end gap-6 flex-wrap">
                <PriceBlock />

                <Button
                  onClick={cta}
                  className="h-12 px-7 rounded-lg text-[16px] font-medium gap-2 [&_svg]:size-5"
                >
                  {!isOwned && !isFree && !isStandalone && <PremiumStarIcon fill="currentColor" />}
                  {ctaLabel}
                </Button>

                {hasTrial && !isOwned && (
                  <button
                    onClick={startTrial}
                    className="h-12 px-5 rounded-lg border border-border bg-background text-foreground text-[15px] font-medium inline-flex items-center gap-2 hover:bg-muted transition-colors"
                  >
                    <Play className="w-4 h-4 fill-foreground" />
                    {lang === "ru" ? "Попробовать бесплатно" : "Try for free"}
                  </button>
                )}
                {(!hasTrial || isOwned) && (
                  <button
                    onClick={cta}
                    className="h-12 px-5 rounded-lg border border-border bg-background text-foreground text-[15px] font-medium inline-flex items-center gap-2 hover:bg-muted transition-colors"
                  >
                    <Play className="w-4 h-4 fill-foreground" />
                    {lang === "ru" ? "Превью" : "Preview"}
                  </button>
                )}
              </div>
            </div>

            {/* Right image */}
            <div className="relative min-h-[280px] md:min-h-[460px]">
              <img src={IMG} alt={title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          {/* MAIN COL */}
          <div className="min-w-0 space-y-10">
            {/* Rewards */}
            <section>
              <div className="flex items-end justify-between mb-6">
                <h2 className="text-[28px] md:text-[32px] font-semibold tracking-tight text-foreground">
                  {lang === "ru" ? "Награды за прохождение" : "Rewards for completion"}
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {rewards.map((r, i) => {
                  const Icon = r.icon;
                  return (
                    <div
                      key={i}
                      className="group relative overflow-hidden rounded-xl bg-sidebar p-6 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: "hsl(var(--violet-super-light))" }}
                        >
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[18px] font-semibold text-foreground mb-1.5 tracking-tight">
                            {lang === "ru" ? r.titleRu : r.titleEn}
                          </p>
                          <p className="text-[15px] text-muted-foreground leading-relaxed">
                            {lang === "ru" ? r.descRu : r.descEn}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Lessons */}
            <section>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div className="flex items-end justify-between sm:justify-start sm:gap-4 flex-1">
                  <h2 className="text-[28px] md:text-[32px] font-semibold tracking-tight text-foreground">
                    {lang === "ru" ? "Программа курса" : "Curriculum"}
                  </h2>
                  <span className="text-[14px] text-muted-foreground">
                    {totalLessons} {lang === "ru" ? "уроков · " : "lessons · "}{totalMin} {lang === "ru" ? "мин" : "min"}
                  </span>
                </div>
              </div>

              {filteredLessons.length > 0 ? (
                <ul className="rounded-xl bg-sidebar overflow-hidden">
                  {filteredLessons.map((l, i) => {
                    const originalIndex = lessons.findIndex(orig => orig.titleRu === l.titleRu);
                    const lessonNo = originalIndex !== -1 ? originalIndex + 1 : i + 1;
                    const isFreeLesson =
                      hasTrial && config.trialLessons ? lessonNo <= config.trialLessons : isFree;
                    return (
                      <li
                        key={i}
                        className={`flex items-center gap-4 px-6 py-5 hover:bg-background/40 transition-colors ${i > 0 ? "border-t border-border/20" : ""}`}
                      >
                        <div className="w-10 h-10 rounded-md bg-background border border-border flex items-center justify-center text-[15px] font-medium text-foreground flex-shrink-0">
                          {String(lessonNo).padStart(2, "0")}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[17px] font-medium text-foreground truncate">
                            {lang === "ru" ? l.titleRu : l.titleEn}
                          </p>
                        </div>
                        {hasTrial && (
                          <span className={`text-[12px] font-medium px-2 py-0.5 rounded ${isFreeLesson ? "bg-emerald-50 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                            {isFreeLesson
                              ? (lang === "ru" ? "Бесплатно" : "Free")
                              : (lang === "ru" ? (isStandalone ? "После покупки" : "Премиум") : (isStandalone ? "After purchase" : "Premium"))}
                          </span>
                        )}
                        <div className="flex items-center gap-2 text-[14px] text-muted-foreground flex-shrink-0">
                          <Play className="w-4 h-4" />
                          {l.min} {lang === "ru" ? "мин" : "min"}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="rounded-xl bg-sidebar p-8 text-center text-muted-foreground text-[15px]">
                  {lang === "ru" ? "Уроки не найдены" : "No lessons found"}
                </div>
              )}
            </section>

            {/* Reviews */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-[28px] md:text-[32px] font-semibold text-foreground tracking-tight">
                  {lang === "ru" ? `Отзывы (${config.reviewCount})` : `Reviews (${config.reviewCount})`}
                </h2>
                <button className="text-[15px] text-muted-foreground hover:text-foreground font-normal transition-colors inline-flex items-center gap-1">
                  {lang === "ru" ? "Показать все" : "View All"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {reviews.map((r, i) => (
                  <div key={i} className="rounded-xl bg-sidebar p-7">
                    <div className="flex gap-4 items-start mb-6">
                      <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border border-border/10">
                        <img src={r.avatar} alt={r.username} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[19px] font-semibold text-foreground tracking-tight leading-none mb-1.5">{r.username}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1">
                            {Array.from({ length: r.rating }).map((_, si) => (
                              <Star key={si} className="w-[15px] h-[15px] fill-[#FF6B57] text-[#FF6B57]" />
                            ))}
                          </div>
                          <span className="text-[13px] text-muted-foreground/80 font-normal">{lang === "ru" ? r.timeRu : r.timeEn}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[15px] leading-[1.65] font-normal text-foreground/90">
                      {lang === "ru" ? r.textRu : r.textEn}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button className="w-10 h-10 rounded-full border border-border/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/10 transition-all">
                  <ChevronLeft className="w-5 h-5 stroke-[1.5]" />
                </button>
                <button className="w-10 h-10 rounded-full border border-border/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/10 transition-all">
                  <ChevronRight className="w-5 h-5 stroke-[1.5]" />
                </button>
              </div>
            </section>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-5 lg:sticky lg:top-6 self-start">
            {/* Author */}
            <div className="rounded-xl bg-sidebar p-6 space-y-5">
              <div className="flex items-center gap-1 p-1 rounded-lg bg-background mb-1">
                <button
                  onClick={() => setAuthorTab("courses")}
                  className={`flex-1 h-10 rounded-md text-[15px] font-medium transition-colors ${
                    authorTab === "courses"
                      ? "bg-sidebar text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {lang === "ru" ? "Создал курс" : "Created course"}
                </button>
                <button
                  onClick={() => setAuthorTab("about")}
                  className={`flex-1 h-10 rounded-md text-[15px] font-medium transition-colors ${
                    authorTab === "about"
                      ? "bg-sidebar text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {lang === "ru" ? "Об авторе" : "About author"}
                </button>
              </div>

              {authorTab === "courses" ? (
                <div className="flex items-center gap-4 py-1">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#A66CFF] to-[#FF7D60] flex items-center justify-center text-white font-bold text-[22px] flex-shrink-0">
                    O
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[19px] font-medium text-foreground truncate">OpenCore Club</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                      <span className="text-[15px] font-medium text-foreground">4.9</span>
                      <span className="text-[14px] text-muted-foreground">· 12 {lang === "ru" ? "курсов" : "courses"}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-[21px] font-semibold text-foreground">OpenCore Club</p>
                  </div>
                  <p className="text-[15px] text-muted-foreground leading-relaxed">
                    {lang === "ru"
                      ? "OpenCore Club — независимое сообщество исследователей Web3, DeFi и новых форматов образования. С 2021 года выпускаем курсы, в которых сочетаем боевую практику и доступную подачу."
                      : "OpenCore Club is an independent community of researchers in Web3, DeFi and new educational formats. Since 2021 we publish courses combining hands-on practice with accessible delivery."}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(lang === "ru"
                      ? [
                          { text: "5 лет в Web3", style: "bg-[#E8DCFB] text-[#924CFE] dark:bg-[#460466]/40 dark:text-[#BF96FF]" },
                          { text: "12 курсов", style: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300" },
                          { text: "40k+ учеников", style: "bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300" },
                          { text: "Топ-автор 2025", style: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300" },
                          { text: "On-chain эксперт", style: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300" },
                        ]
                      : [
                          { text: "5 years in Web3", style: "bg-[#E8DCFB] text-[#924CFE] dark:bg-[#460466]/40 dark:text-[#BF96FF]" },
                          { text: "12 courses", style: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300" },
                          { text: "40k+ students", style: "bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300" },
                          { text: "Top author 2025", style: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300" },
                          { text: "On-chain expert", style: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300" },
                        ]
                    ).map((a) => (
                      <span
                        key={a.text}
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-[13px] font-medium ${a.style}`}
                      >
                        {a.text}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2.5 pt-1">
                    {[
                      { Icon: Send, label: "Telegram" },
                      { Icon: Twitter, label: "X" },
                      { Icon: Youtube, label: "YouTube" },
                      { Icon: Instagram, label: "Instagram" },
                    ].map(({ Icon, label }, i) => (
                      <a
                        key={i}
                        href="#"
                        aria-label={label}
                        className="w-10 h-10 rounded-lg border border-border/20 bg-background flex items-center justify-center text-muted-foreground hover:bg-[#924CFE] hover:text-white hover:border-transparent transition-all"
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Completion funnel */}
            <div className="rounded-xl bg-sidebar p-5">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-[19px] font-medium text-foreground leading-tight">
                    {lang === "ru" ? "Уровень удержания внимания" : "Attention retention level"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[28px] leading-none font-medium text-violet-dark">39%</p>
                  <p className="text-caption-12 mt-1">{lang === "ru" ? "Удержание" : "Retention"}</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { labelRu: "Начали курс", labelEn: "Started", value: config.students, pct: 100, bg: "bg-violet-super-dark" },
                  { labelRu: "Прошли половину", labelEn: "Half-way", value: Math.round(config.students * 0.65), pct: 65, bg: "bg-violet-dark" },
                  { labelRu: "Завершили", labelEn: "Completed", value: Math.round(config.students * 0.39), pct: 39, bg: "bg-violet-mid" },
                ].map((s) => (
                  <div key={s.labelEn}>
                    <div className="flex items-baseline justify-between mb-1.5">
                      <span className="text-body-12 text-foreground">{lang === "ru" ? s.labelRu : s.labelEn}</span>
                      <span className="text-body-12 text-muted-foreground tabular-nums">
                        <span className="text-foreground font-medium">{s.value.toLocaleString()}</span> · {s.pct}%
                      </span>
                    </div>
                    <div className="relative h-7 rounded-md bg-background overflow-hidden">
                      <div
                        className={`absolute inset-y-0 left-0 ${s.bg} rounded-md transition-all duration-700 ease-out`}
                        style={{ width: `${s.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="rounded-xl bg-sidebar p-5">
              <p className="text-caption-12 mb-3">{lang === "ru" ? "Языки курса" : "Course languages"}</p>
              <div className="flex flex-wrap gap-2">
                {["English", "Русский"].map((l) => (
                  <span key={l} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border/20 bg-background text-body-14 text-foreground">
                    <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <PaymentModal
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        courseId={COURSE_ID}
        courseTitleRu={config.titleRu}
        courseTitleEn={config.titleEn}
        courseImage={IMG}
        courseDescRu={config.descriptionRu}
        courseDescEn={config.descriptionEn}
      />
    </div>
  );
};

export const EXPERIMENTAL_COURSE_IDS = ["1", "2", "6", "7", "8", "9"];

export default CourseExperimental;
