import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePurchaseStore, type Transaction, cancelSubscription } from "@/hooks/usePurchaseStore";
import { BookOpen, Receipt, Calendar, ChevronDown } from "lucide-react";
import PremiumStarIcon from "@/components/icons/PremiumStarIcon";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import SubscriptionModal from "@/components/SubscriptionModal";
import CancelSubscriptionModal from "@/components/CancelSubscriptionModal";

const sampleTransactions: Transaction[] = [
  {
    id: "sample-1",
    date: "2026-03-15T10:00:00Z",
    descRu: 'Курс «Анализ проектов»',
    descEn: 'Course "Project Analysis"',
    amount: "$29",
    type: "purchase",
  },
  {
    id: "sample-2",
    date: "2026-02-01T10:00:00Z",
    descRu: "Годовая подписка Premium",
    descEn: "Yearly Premium Subscription",
    amount: "$39.60",
    type: "subscription",
  },
  {
    id: "sample-3",
    date: "2026-01-10T10:00:00Z",
    descRu: 'Курс «Основы блокчейна: архитектура доверия»',
    descEn: 'Course "Blockchain Basics: Trust Architecture"',
    amount: "$39",
    type: "purchase",
  },
];

const samplePurchasedCourses = [
  { id: "2", titleRu: "Анализ проектов", titleEn: "Project Analysis" },
  { id: "5", titleRu: "Основы блокчейна: архитектура доверия", titleEn: "Blockchain Basics: Trust Architecture" },
];

const PaymentSettings = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const store = usePurchaseStore();
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [transactionsOpen, setTransactionsOpen] = useState(false);

  const hasSubscription = store.subscription?.active;
  const realPurchasedCourses = store.purchasedCourses;
  const realTransactions = store.transactions;

  const transactions = realTransactions.length > 0 ? realTransactions : sampleTransactions;
  const purchasedCoursesList = realPurchasedCourses.length > 0
    ? realTransactions.filter((t) => t.type === "purchase")
    : samplePurchasedCourses.map((c) => ({
        id: c.id,
        descRu: `Курс «${c.titleRu}»`,
        descEn: `Course "${c.titleEn}"`,
      }));

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const sectionTitleClass = "text-[20px] font-normal leading-[20px] text-foreground";

  return (
    <div className="mb-8">
      <h2 className="text-[24px] font-medium leading-[90%] text-foreground mb-5">
        {lang === "ru" ? "Управление подпиской" : "Subscription Management"}
      </h2>

      <div className="space-y-3">
        {/* Subscription — standalone card */}
        <div className="bg-[hsl(var(--muted))] rounded-2xl px-6 py-5">
          <div className="flex items-center gap-3 mb-4">
            <PremiumStarIcon className="w-5 h-5" fill="currentColor" />
            <span className={sectionTitleClass}>
              {lang === "ru" ? "Подписка" : "Subscription"}
            </span>
          </div>

          {hasSubscription && store.subscription ? (
            <div className="space-y-4">
              {/* Status row */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[14px] font-medium text-[hsl(142_71%_35%)] bg-[hsl(142_71%_35%/0.12)] px-3 py-1 rounded-full">
                  {lang === "ru" ? "Активна" : "Active"}
                </span>
                <span className="text-[16px] text-muted-foreground">
                  {store.subscription.plan === "monthly"
                    ? (lang === "ru" ? "Месячная" : "Monthly")
                    : (lang === "ru" ? "Годовая" : "Yearly")}
                </span>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 text-[15px] text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{lang === "ru" ? "до" : "until"} {formatDate(store.subscription.endDate)}</span>
              </div>

              {/* Price */}
              <p className="text-[18px] font-semibold text-foreground">
                {store.subscription.price}
                <span className="text-[14px] font-normal text-muted-foreground ml-1">
                  /{store.subscription.plan === "monthly"
                    ? (lang === "ru" ? "мес" : "mo")
                    : (lang === "ru" ? "год" : "yr")}
                </span>
              </p>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-1">
                {store.subscription.plan === "monthly" && (
                  <Button
                    size="sm"
                    className="rounded-[10px] text-[14px] h-9 px-5"
                    onClick={() => setUpgradeOpen(true)}
                  >
                    {lang === "ru" ? "Улучшить план" : "Upgrade plan"}
                  </Button>
                )}
                <button
                  onClick={() => setCancelOpen(true)}
                  className="text-[14px] text-muted-foreground hover:text-destructive transition-colors underline underline-offset-2"
                >
                  {lang === "ru" ? "Отменить подписку" : "Cancel subscription"}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-[16px] text-muted-foreground">
              {lang === "ru" ? "Нет активной подписки" : "No active subscription"}
            </p>
          )}
        </div>

        {/* Purchased courses — collapsible card */}
        <div className="bg-[hsl(var(--muted))] rounded-2xl px-6 py-5">
          <button
            onClick={() => setCoursesOpen(!coursesOpen)}
            className="flex items-center gap-3 w-full text-left"
          >
            <BookOpen className="w-5 h-5 text-foreground" />
            <span className={sectionTitleClass}>
              {lang === "ru" ? "Купленные курсы" : "Purchased Courses"}
            </span>
            <span className="ml-1 text-[14px] text-muted-foreground">
              {purchasedCoursesList.length}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground ml-auto transition-transform duration-200 ${coursesOpen ? "rotate-180" : ""}`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${coursesOpen ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}
          >
            <div className="space-y-0 divide-y divide-border/50">
              {purchasedCoursesList.map((item: any, i: number) => (
                <div key={item.id || i} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="text-[15px] text-foreground">
                    {lang === "ru" ? (item.descRu || item.titleRu) : (item.descEn || item.titleEn)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-[10px] text-[13px] h-8 px-4 flex-shrink-0"
                    onClick={() => navigate(`/course/${item.id || ""}`)}
                  >
                    {lang === "ru" ? "Открыть" : "Open"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transactions — collapsible card */}
        <div className="bg-[hsl(var(--muted))] rounded-2xl px-6 py-5">
          <button
            onClick={() => setTransactionsOpen(!transactionsOpen)}
            className="flex items-center gap-3 w-full text-left"
          >
            <Receipt className="w-5 h-5 text-foreground" />
            <span className={sectionTitleClass}>
              {lang === "ru" ? "Транзакции" : "Transactions"}
            </span>
            <span className="ml-1 text-[14px] text-muted-foreground">
              {transactions.length}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground ml-auto transition-transform duration-200 ${transactionsOpen ? "rotate-180" : ""}`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${transactionsOpen ? "max-h-[600px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}
          >
            <div className="space-y-0 divide-y divide-border/50">
              {transactions.map((t, i) => (
                <div key={t.id || i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="text-[15px] text-foreground truncate">
                      {lang === "ru" ? t.descRu : t.descEn}
                    </p>
                    <p className="text-[13px] text-muted-foreground mt-0.5">{formatDate(t.date)}</p>
                  </div>
                  <span className="text-[15px] font-semibold text-foreground flex-shrink-0 ml-4">{t.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <SubscriptionModal open={upgradeOpen} onOpenChange={setUpgradeOpen} />
      <CancelSubscriptionModal
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        endDate={store.subscription?.endDate ? formatDate(store.subscription.endDate) : ""}
        onConfirmCancel={() => cancelSubscription()}
      />
    </div>
  );
};

export default PaymentSettings;
