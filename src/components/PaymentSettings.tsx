import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePurchaseStore, type Transaction, type SubscriptionData, cancelSubscription } from "@/hooks/usePurchaseStore";
import { BookOpen, Receipt, Calendar } from "lucide-react";
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

  const hasSubscription = store.subscription?.active;
  const realPurchasedCourses = store.purchasedCourses;
  const realTransactions = store.transactions;

  // Merge real + sample data (sample shown when no real data)
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

      <div className="bg-[hsl(var(--muted))] rounded-2xl divide-y divide-border/50">
        {/* Subscription */}
        <div className="px-6 py-5">
          <div className="flex items-center gap-3 mb-3">
            <PremiumStarIcon className="w-5 h-5" fill="currentColor" />
            <span className="text-[16px] font-semibold text-foreground">
              {lang === "ru" ? "Подписка" : "Subscription"}
            </span>
          </div>
          {hasSubscription && store.subscription ? (
            <div className="ml-8">
              <div className="flex items-start justify-between mb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-medium text-[hsl(var(--success))] bg-[hsl(var(--success-accent)/0.15)] px-2.5 py-0.5 rounded-full">
                      {lang === "ru" ? "Активна" : "Active"}
                    </span>
                    <span className="text-[14px] text-muted-foreground">
                      {store.subscription.plan === "monthly"
                        ? (lang === "ru" ? "Месячная" : "Monthly")
                        : (lang === "ru" ? "Годовая" : "Yearly")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    {lang === "ru" ? "до" : "until"} {formatDate(store.subscription.endDate)}
                  </div>
                  <p className="text-[14px] font-semibold text-foreground">{store.subscription.price}</p>
                </div>
                {store.subscription.plan === "monthly" && (
                  <Button
                    size="sm"
                    className="rounded-lg text-[13px] h-8 px-4"
                    onClick={() => setUpgradeOpen(true)}
                  >
                    {lang === "ru" ? "Улучшить" : "Upgrade"}
                  </Button>
                )}
              </div>
              <button
                onClick={() => setCancelOpen(true)}
                className="text-[13px] text-muted-foreground hover:text-red-400 transition-colors underline underline-offset-2"
              >
                {lang === "ru" ? "Отменить подписку" : "Cancel subscription"}
              </button>
            </div>
          ) : (
            <p className="ml-8 text-[14px] text-muted-foreground">
              {lang === "ru" ? "Нет активной подписки" : "No active subscription"}
            </p>
          )}
        </div>

        {/* Purchased courses */}
        <div className="px-6 py-5">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="w-5 h-5 text-foreground" />
            <span className="text-[16px] font-semibold text-foreground">
              {lang === "ru" ? "Купленные курсы" : "Purchased Courses"}
            </span>
          </div>
          <div className="ml-8 space-y-2">
            {purchasedCoursesList.map((item: any, i: number) => (
              <div key={item.id || i} className="flex items-center justify-between gap-3">
                <span className="text-[14px] text-foreground">
                  {lang === "ru" ? (item.descRu || item.titleRu) : (item.descEn || item.titleEn)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg text-[13px] h-7 px-3"
                  onClick={() => navigate(`/course/${item.id || ""}`)}
                >
                  {lang === "ru" ? "Открыть" : "Open"}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction history */}
        <div className="px-6 py-5">
          <div className="flex items-center gap-3 mb-3">
            <Receipt className="w-5 h-5 text-foreground" />
            <span className="text-[16px] font-semibold text-foreground">
              {lang === "ru" ? "История транзакций" : "Transaction History"}
            </span>
          </div>
          <div className="ml-8 space-y-3">
            {transactions.map((t, i) => (
              <div key={t.id || i} className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] text-foreground">
                    {lang === "ru" ? t.descRu : t.descEn}
                  </p>
                  <p className="text-[12px] text-muted-foreground">{formatDate(t.date)}</p>
                </div>
                <span className="text-[14px] font-semibold text-foreground">{t.amount}</span>
              </div>
            ))}
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
