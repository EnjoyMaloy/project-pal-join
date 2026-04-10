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

  return (
    <div className="mb-8">
      <h2 className="text-[24px] font-medium leading-[90%] text-foreground mb-5">
        {lang === "ru" ? "Управление подпиской" : "Subscription Management"}
      </h2>

      <div className="space-y-3">
        {/* ── Subscription card ── */}
        <div className="bg-[hsl(var(--muted))] rounded-2xl px-6 py-5">
          {/* Header row: icon + title left, badge right */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <PremiumStarIcon className="w-5 h-5" fill="currentColor" />
              <span className="text-[20px] font-normal leading-[20px] text-foreground">
                {lang === "ru" ? "Подписка" : "Subscription"}
              </span>
            </div>
            {hasSubscription && store.subscription && (
              <span className="text-[14px] font-medium text-[#232323] bg-[#CFF504] dark:text-[#CFF504] dark:bg-[#CFF504]/15 px-3 py-1 rounded-full">
                {lang === "ru" ? "Активна" : "Active"}
              </span>
            )}
          </div>

          {hasSubscription && store.subscription ? (
            <>
              {/* Info grid: plan + date left, price right */}
              <div className="flex items-end justify-between mb-4">
                <div className="space-y-2">
                  <p className="text-[16px] text-muted-foreground">
                    {store.subscription.plan === "monthly"
                      ? (lang === "ru" ? "Месячная подписка" : "Monthly subscription")
                      : (lang === "ru" ? "Годовая подписка" : "Yearly subscription")}
                  </p>
                  <div className="flex items-center gap-2 text-[15px] text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{lang === "ru" ? "до" : "until"} {formatDate(store.subscription.endDate)}</span>
                  </div>
                </div>
                <p className="text-[22px] font-semibold text-foreground">
                  {store.subscription.plan === "monthly" ? "₽480" : "₽3,168"}{" "}
                  <span className="text-[18px] font-normal text-muted-foreground">
                    /{store.subscription.plan === "monthly" ? "мес" : "год"}
                  </span>
                </p>
              </div>

              {/* Actions row */}
              <div className="flex items-center justify-between pt-2 border-t border-border/40">
                <button
                  onClick={() => setCancelOpen(true)}
                  className="text-[14px] text-muted-foreground hover:text-[#FF3B30] transition-colors underline underline-offset-2"
                >
                  {lang === "ru" ? "Отменить подписку" : "Cancel subscription"}
                </button>
                {store.subscription.plan === "monthly" && (
                  <Button
                    size="sm"
                    className="rounded-[10px] text-[14px] h-9 px-5"
                    onClick={() => setUpgradeOpen(true)}
                  >
                    {lang === "ru" ? "Улучшить план" : "Upgrade plan"}
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-[18px] font-normal leading-[120%] text-muted-foreground">
                {lang === "ru" ? "Нет активной подписки" : "No active subscription"}
              </p>
              <Button
                size="sm"
                className="rounded-[10px] text-[18px] font-normal h-9 px-5"
                onClick={() => setUpgradeOpen(true)}
              >
                {lang === "ru" ? "Оформить подписку" : "Subscribe"}
              </Button>
            </div>
          )}
        </div>

        {/* ── Purchased courses — collapsible ── */}
        <div className="bg-[hsl(var(--muted))] rounded-2xl px-6 py-5">
          <button
            onClick={() => setCoursesOpen(!coursesOpen)}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-foreground" />
              <span className="text-[20px] font-normal leading-[20px] text-foreground">
                {lang === "ru" ? "Купленные курсы" : "Purchased Courses"}
              </span>
              <span className="text-[14px] text-muted-foreground">{purchasedCoursesList.length}</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${coursesOpen ? "rotate-180" : ""}`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${coursesOpen ? "max-h-[500px] opacity-100 mt-8" : "max-h-0 opacity-0"}`}
          >
            <div className="divide-y divide-border/40">
              {purchasedCoursesList.map((item: any, i: number) => (
                <div key={item.id || i} className="flex items-center justify-between gap-4 py-5 first:pt-0 last:pb-0">
                  <span className="text-[18px] font-normal leading-[120%] text-foreground min-w-0 truncate">
                    {lang === "ru" ? (item.descRu || item.titleRu) : (item.descEn || item.titleEn)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full text-[18px] font-normal h-9 px-5 flex-shrink-0 bg-white text-black border-0 hover:bg-black hover:text-white transition-colors"
                    onClick={() => navigate(`/course/${item.id || ""}`)}
                  >
                    {lang === "ru" ? "Открыть" : "Open"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Transactions — collapsible ── */}
        <div className="bg-[hsl(var(--muted))] rounded-2xl px-6 py-5">
          <button
            onClick={() => setTransactionsOpen(!transactionsOpen)}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-3">
              <Receipt className="w-5 h-5 text-foreground" />
              <span className="text-[20px] font-normal leading-[20px] text-foreground">
                {lang === "ru" ? "Транзакции" : "Transactions"}
              </span>
              <span className="text-[14px] text-muted-foreground">{transactions.length}</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${transactionsOpen ? "rotate-180" : ""}`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${transactionsOpen ? "max-h-[600px] opacity-100 mt-8" : "max-h-0 opacity-0"}`}
          >
            <div className="divide-y divide-border/40">
              {transactions.map((t, i) => (
                <div key={t.id || i} className="flex items-center justify-between py-5 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="text-[18px] font-normal leading-[120%] text-foreground truncate">
                      {lang === "ru" ? t.descRu : t.descEn}
                    </p>
                    <p className="text-[13px] text-muted-foreground mt-0.5">{formatDate(t.date)}</p>
                  </div>
                  <span className="text-[18px] font-normal leading-[120%] text-foreground flex-shrink-0 ml-4">{t.amount}</span>
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
