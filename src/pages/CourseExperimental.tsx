import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePurchaseStore } from "@/hooks/usePurchaseStore";
import {
  Star,
  Users,
  Globe,
  Calendar,
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
  Search,
} from "lucide-react";
import PremiumStarIcon from "@/components/icons/PremiumStarIcon";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import PaymentModal from "@/components/PaymentModal";

const COURSE_ID = "9";

const IMG = "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=800&fit=crop";

const lessons = [
  { titleRu: "Что такое эксперименты в Web3", titleEn: "What are Web3 experiments", min: 8 },
  { titleRu: "Подготовка окружения", titleEn: "Setting up environment", min: 12 },
  { titleRu: "Первый сценарий", titleEn: "First scenario", min: 12 },
  { titleRu: "Архитектура решений", titleEn: "Solution architecture", min: 18 },
  { titleRu: "Практика: запуск", titleEn: "Practice: launch", min: 22 },
  { titleRu: "Разбор кейсов", titleEn: "Case studies", min: 30 },
  { titleRu: "Постановка задачи", titleEn: "Define the task", min: 15 },
  { titleRu: "Реализация", titleEn: "Build", min: 25 },
  { titleRu: "Защита и фидбек", titleEn: "Review & feedback", min: 15 },
];

const reviews = [
  { username: "alex_w3", color: "#A66CFF", rating: 5, timeRu: "3 дня назад", timeEn: "3 days ago", textRu: "Совершенно новая подача материала. Чувствуется, что курс делали с любовью.", textEn: "A completely fresh way of teaching. Made with love." },
  { username: "kira_dev", color: "#FF7D60", rating: 5, timeRu: "1 неделю назад", timeEn: "1 week ago", textRu: "Награды реально мотивируют дойти до конца. Лучший экспериментальный формат.", textEn: "The rewards actually push you to finish. Best experimental format." },
  { username: "n0va", color: "#4CAF50", rating: 4, timeRu: "2 недели назад", timeEn: "2 weeks ago", textRu: "Очень красиво и удобно. Хочу больше таких курсов.", textEn: "Beautiful and convenient. Want more courses like this." },
];

const rewards = [
  { icon: Trophy, titleRu: "NFT-сертификат", titleEn: "NFT certificate", descRu: "Уникальный on-chain сертификат об окончании", descEn: "Unique on-chain certificate of completion" },
  { icon: Award, titleRu: "Бейдж в профиле", titleEn: "Profile badge", descRu: "Постоянный бейдж «Experimentalist»", descEn: "Permanent “Experimentalist” badge" },
  { icon: Sparkles, titleRu: "500 XP", titleEn: "500 XP", descRu: "Опыт идёт в общий рейтинг", descEn: "XP counts toward your global rating" },
  { icon: BadgeCheck, titleRu: "Доступ в чат", titleEn: "Private chat", descRu: "Закрытый чат выпускников курса", descEn: "Closed chat for graduates" },
];

const CourseExperimental = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const store = usePurchaseStore();
  const [paymentOpen, setPaymentOpen] = useState(false);

  const titleRu = "Экспериментальная стр курса";
  const titleEn = "Experimental course page";
  const title = lang === "ru" ? titleRu : titleEn;
  const description =
    lang === "ru"
      ? "Полностью переосмысленная страница курса — больше визуала, больше воздуха, больше пользы. Узнайте, как мы экспериментируем с подачей образовательного контента."
      : "A fully rethought course page — more visual, more breathing room, more value. See how we experiment with educational delivery.";

  const isPurchased = store.purchasedCourses.includes(COURSE_ID);
  const hasSubscription = store.subscription?.active;
  const isOwned = isPurchased || hasSubscription;

  const cta = () => (isOwned ? navigate(`/course/${COURSE_ID}/lessons`) : setPaymentOpen(true));

  const totalLessons = lessons.length;
  const totalMin = lessons.reduce((s, l) => s + l.min, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full px-4 md:px-8 py-6 md:py-8">

        {/* HERO */}
        <div className="relative overflow-hidden rounded-[28px] border border-border bg-card mb-8">
          <div
            className="absolute inset-0 opacity-90"
            style={{
              backgroundImage:
                "radial-gradient(120% 90% at 100% 0%, hsl(var(--violet-super-light)) 0%, transparent 60%), radial-gradient(120% 90% at 0% 100%, hsl(var(--cat-web3-bg)) 0%, transparent 55%)",
            }}
          />
          <div className="relative grid md:grid-cols-[1.1fr_1fr] gap-0">
            {/* Left text */}
            <div className="p-6 md:p-10 flex flex-col justify-between gap-8">
              <div>
                <div className="flex items-center gap-2 mb-5 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-body-12 font-medium text-violet-super-dark border border-[rgba(146,76,254,0.15)] bg-[rgba(217,192,255,0.55)]">
                    <PremiumStarIcon className="w-3.5 h-3.5" fill="currentColor" />
                    {lang === "ru" ? "Премиум" : "Premium"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-body-12 font-medium text-foreground border border-border bg-background">
                    <LayoutGrid className="w-3.5 h-3.5 text-muted-foreground" />
                    {lang === "ru" ? "Web3 и DeFi" : "Web3 & DeFi"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-body-12 font-medium text-foreground border border-border bg-background">
                    <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                    EN · RU
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-body-12 font-medium text-foreground border border-border bg-background">
                    <Users className="w-3.5 h-3.5 text-muted-foreground" />
                    OpenCore Club
                  </span>
                </div>

                <h1 className="text-[40px] md:text-[52px] leading-[0.95] font-medium tracking-tight text-foreground mb-5">
                  {title}
                </h1>
                <p className="text-[16px] leading-relaxed text-muted-foreground max-w-[520px]">
                  {description}
                </p>
              </div>

              {/* Stat row */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-body-14 text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                  <span className="font-semibold text-foreground">4.95</span>
                  <span>(128 {lang === "ru" ? "отзывов" : "reviews"})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>{(2480).toLocaleString()} {lang === "ru" ? "учеников" : "students"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{lang === "ru" ? "Обновлён 12.06.26" : "Updated 06/12/26"}</span>
                </div>
              </div>

              {/* CTA */}
              <div className="flex items-end gap-6 flex-wrap">
                <div>
                  <p className="text-caption-12 mb-1">{lang === "ru" ? "Цена" : "Price"}</p>
                  <p className="text-[36px] leading-[32px] font-medium text-foreground">
                    <span className="text-[16px] font-normal text-muted-foreground">{lang === "ru" ? "от " : "from "}</span>
                    $6
                    <span className="text-[16px] font-normal text-muted-foreground">{lang === "ru" ? "/мес" : "/mo"}</span>
                  </p>
                </div>
                <Button
                  onClick={cta}
                  className="h-12 px-7 rounded-xl text-[16px] font-medium gap-2 [&_svg]:size-5"
                >
                  {!isOwned && <PremiumStarIcon fill="currentColor" />}
                  {isOwned
                    ? (lang === "ru" ? "Начать обучение" : "Start learning")
                    : (lang === "ru" ? "Открыть доступ" : "Get access")}
                </Button>
                <button
                  onClick={cta}
                  className="h-12 px-5 rounded-xl border border-border bg-background text-foreground text-[15px] font-medium inline-flex items-center gap-2 hover:bg-muted transition-colors"
                >
                  <Play className="w-4 h-4 fill-foreground" />
                  {lang === "ru" ? "Превью" : "Preview"}
                </button>
              </div>
            </div>

            {/* Right image */}
            <div className="relative min-h-[280px] md:min-h-[460px]">
              <img src={IMG} alt={title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <button
                onClick={cta}
                className="absolute bottom-5 left-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-background/90 backdrop-blur border border-border text-[14px] font-medium text-foreground hover:bg-background transition-colors"
              >
                <Play className="w-4 h-4 fill-foreground" />
                {lang === "ru" ? "Смотреть трейлер · 1:24" : "Watch trailer · 1:24"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          {/* MAIN COL */}
          <div className="min-w-0 space-y-10">
            {/* What you get / Rewards */}
            <section>
              <div className="flex items-end justify-between mb-5">
                <h2 className="text-h2 text-foreground">
                  {lang === "ru" ? "Награды за прохождение" : "Rewards for completion"}
                </h2>
                <span className="text-caption-12">{lang === "ru" ? "4 награды" : "4 rewards"}</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {rewards.map((r, i) => {
                  const Icon = r.icon;
                  return (
                    <div
                      key={i}
                      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 hover:border-primary/40 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: "hsl(var(--violet-super-light))" }}
                        >
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-subh-16 text-foreground mb-1.5">
                            {lang === "ru" ? r.titleRu : r.titleEn}
                          </p>
                          <p className="text-body-14 text-muted-foreground leading-relaxed">
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
              <div className="flex items-end justify-between mb-5">
                <h2 className="text-h2 text-foreground">
                  {lang === "ru" ? "Программа курса" : "Curriculum"}
                </h2>
                <span className="text-caption-12">
                  {totalLessons} {lang === "ru" ? "уроков · " : "lessons · "}{totalMin} {lang === "ru" ? "мин" : "min"}
                </span>
              </div>
              <ul className="rounded-2xl border border-border bg-card overflow-hidden">
                {lessons.map((l, i) => (
                  <li
                    key={i}
                    className={`flex items-center gap-4 px-5 py-4 hover:bg-background transition-colors ${i > 0 ? "border-t border-border" : ""}`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-background border border-border flex items-center justify-center text-[14px] font-medium text-foreground flex-shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-subh-16-medium text-foreground truncate">
                        {lang === "ru" ? l.titleRu : l.titleEn}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-caption-12 flex-shrink-0">
                      <Play className="w-3.5 h-3.5" />
                      {l.min} {lang === "ru" ? "мин" : "min"}
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Reviews */}
            <section>
              <div className="flex items-end justify-between mb-5">
                <h2 className="text-h2 text-foreground">
                  {lang === "ru" ? "Отзывы (128)" : "Reviews (128)"}
                </h2>
                <button className="text-body-14 text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors">
                  {lang === "ru" ? "Показать все" : "Show all"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {reviews.map((r, i) => (
                  <div key={i} className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: r.color }}
                      >
                        {r.username[0].toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-subh-14 text-foreground truncate">{r.username}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="flex gap-0.5">
                            {Array.from({ length: r.rating }).map((_, si) => (
                              <Star key={si} className="w-3 h-3 fill-orange-400 text-orange-400" />
                            ))}
                          </div>
                          <span className="text-caption-12">{lang === "ru" ? r.timeRu : r.timeEn}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-body-14 text-foreground leading-relaxed">
                      {lang === "ru" ? r.textRu : r.textEn}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-5 lg:sticky lg:top-6 self-start">
            {/* Author */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-caption-12 mb-4">{lang === "ru" ? "Автор курса" : "Course author"}</p>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#A66CFF] to-[#FF7D60] flex items-center justify-center text-white font-bold text-[20px]">
                  O
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-subh-16 text-foreground truncate">OpenCore Club</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                    <span className="text-body-14 text-foreground">4.9</span>
                    <span className="text-caption-12">· 12 {lang === "ru" ? "курсов" : "courses"}</span>
                  </div>
                </div>
              </div>
              <p className="text-body-14 text-muted-foreground leading-relaxed mb-4">
                {lang === "ru"
                  ? "Сообщество практиков Web3 и DeFi. Делимся боевыми кейсами и помогаем разобраться в новых технологиях."
                  : "A community of Web3 & DeFi practitioners. We share real cases and help you navigate new tech."}
              </p>

              {/* Socials */}
              <div className="flex items-center gap-2">
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
                    className="w-9 h-9 rounded-lg border border-border bg-background flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick facts */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="grid grid-cols-2">
                <Fact label={lang === "ru" ? "Учеников" : "Students"} value={(2480).toLocaleString()} />
                <Fact label={lang === "ru" ? "Уроков" : "Lessons"} value={totalLessons.toString()} bordered />
                <Fact label={lang === "ru" ? "Длительность" : "Duration"} value={lang === "ru" ? "≈ 2,5 ч" : "≈ 2.5h"} topBorder />
                <Fact label={lang === "ru" ? "Уровень" : "Level"} value={lang === "ru" ? "Средний" : "Mid"} bordered topBorder />
              </div>
            </div>

            {/* Languages */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-caption-12 mb-3">{lang === "ru" ? "Языки курса" : "Course languages"}</p>
              <div className="flex flex-wrap gap-2">
                {["English", "Русский"].map((l) => (
                  <span key={l} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background text-body-14 text-foreground">
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
        courseTitleRu={titleRu}
        courseTitleEn={titleEn}
        courseImage={IMG}
        courseDescRu={description}
        courseDescEn={description}
      />
    </div>
  );
};

const Fact = ({
  label,
  value,
  bordered,
  topBorder,
}: {
  label: string;
  value: string;
  bordered?: boolean;
  topBorder?: boolean;
}) => (
  <div
    className={`p-4 ${bordered ? "border-l border-border" : ""} ${topBorder ? "border-t border-border" : ""}`}
  >
    <p className="text-caption-12 mb-1.5">{label}</p>
    <p className="text-subh-16 text-foreground">{value}</p>
  </div>
);

export default CourseExperimental;
