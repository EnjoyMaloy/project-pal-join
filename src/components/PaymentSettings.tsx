import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePurchaseStore, type Transaction, type SubscriptionData } from "@/hooks/usePurchaseStore";
import { Crown, BookOpen, Receipt, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import SubscriptionModal from "@/components/SubscriptionModal";

const PaymentSettings = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const store = usePurchaseStore();
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const hasSubscription = store.subscription?.active;
  const purchasedCourses = store.purchasedCourses;
  const transactions = store.transactions;

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
      <h2 className="text-[22px] font-bold text-foreground mb-5">
        {lang === "ru" ? "Настройки оплаты" : "Payment Settings"}
      </h2>

      <div className="bg-[hsl(var(--muted))] rounded-2xl divide-y divide-border/50">
        {/* Subscription */}
        <div className="px-6 py-5">
          <div className="flex items-center gap-3 mb-3">
            <Crown className="w-5 h-5 text-foreground" />
            <span className="text-[16px] font-semibold text-foreground">
              {lang === "ru" ? "Подписка" : "Subscription"}
            </span>
          </div>
          {hasSubscription && store.subscription ? (
            <div className="ml-8 flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-medium text-green-600 bg-green-500/10 px-2.5 py-0.5 rounded-full">
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
                  {lang === "ru" ? "Улучшить подписку" : "Upgrade subscription"}
                </Button>
              )}
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
          {purchasedCourses.length > 0 ? (
            <div className="ml-8 space-y-2">
              {transactions
                .filter((t) => t.type === "purchase")
                .map((t) => (
                  <div key={t.id} className="flex items-center justify-between gap-3">
                    <span className="text-[14px] text-foreground">
                      {lang === "ru" ? t.descRu : t.descEn}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-[13px] text-muted-foreground">{t.amount}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg text-[13px] h-7 px-3"
                        onClick={() => navigate("/catalog")}
                      >
                        {lang === "ru" ? "Открыть курс" : "Open course"}
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="ml-8 text-[14px] text-muted-foreground">
              {lang === "ru" ? "Нет купленных курсов" : "No purchased courses"}
            </p>
          )}
        </div>

        {/* Transaction history */}
        <div className="px-6 py-5">
          <div className="flex items-center gap-3 mb-3">
            <Receipt className="w-5 h-5 text-foreground" />
            <span className="text-[16px] font-semibold text-foreground">
              {lang === "ru" ? "История транзакций" : "Transaction History"}
            </span>
          </div>
          {transactions.length > 0 ? (
            <div className="ml-8 space-y-3">
              {transactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between">
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
          ) : (
            <p className="ml-8 text-[14px] text-muted-foreground">
              {lang === "ru" ? "Нет транзакций" : "No transactions yet"}
            </p>
          )}
      </div>
      <SubscriptionModal open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </div>
    </div>
  );
};

export default PaymentSettings;
