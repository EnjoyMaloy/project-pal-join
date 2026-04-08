import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, Crown, Zap, Check } from "lucide-react";

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type PlanId = "monthly" | "yearly";

const SubscriptionModal = ({ open, onOpenChange }: SubscriptionModalProps) => {
  const { lang } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("yearly");

  const plans: { id: PlanId; titleRu: string; titleEn: string; priceRu: string; priceEn: string; subRu?: string; subEn?: string; badgeRu?: string; badgeEn?: string }[] = [
    {
      id: "monthly",
      titleRu: "Месячная",
      titleEn: "Monthly",
      priceRu: "₽1,200",
      priceEn: "$14",
      subRu: "/месяц",
      subEn: "/mo",
    },
    {
      id: "yearly",
      titleRu: "Годовая",
      titleEn: "Yearly",
      priceRu: "₽9,600",
      priceEn: "$99",
      subRu: "/год",
      subEn: "/yr",
      badgeRu: "Скидка 33%",
      badgeEn: "Save 33%",
    },
  ];

  const benefits = lang === "ru"
    ? ["Доступ ко всем премиум курсам", "Эксклюзивный доступ к сообществу", "Приоритетная поддержка", "Обновления навсегда"]
    : ["Access to all premium courses", "Exclusive community access", "Priority support", "Updates forever"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] p-0 gap-0 overflow-y-auto border-0 rounded-2xl [&>button.absolute]:hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-b from-[hsl(30,100%,65%)] to-[hsl(35,100%,55%)] px-5 pt-8 pb-6 text-center relative rounded-t-2xl">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/15 flex items-center justify-center text-white hover:bg-black/25 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-14 h-14 rounded-full bg-white/25 flex items-center justify-center mx-auto mb-4">
            <Crown className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-[22px] font-bold text-white mb-1">
            {lang === "ru" ? "Разблокировать премиум доступ" : "Unlock Premium Access"}
          </h2>
          <p className="text-[14px] text-white/85">
            {lang === "ru" ? "Получите неограниченный доступ ко всем премиум курсам" : "Get unlimited access to all premium courses"}
          </p>
        </div>

        {/* Plans */}
        <div className="px-5 pt-5 pb-2">
          <div className="flex gap-3">
            {plans.map((plan) => {
              const badge = lang === "ru" ? plan.badgeRu : plan.badgeEn;
              return (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`flex-1 border-2 rounded-xl px-4 py-4 text-center transition-all relative ${
                    selectedPlan === plan.id
                      ? "border-[hsl(35,100%,55%)] bg-[hsl(35,100%,55%)]/5"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  {badge && (
                    <span className="absolute -top-2.5 right-2 text-[11px] font-semibold bg-green-500 text-white rounded px-2 py-0.5">
                      {badge}
                    </span>
                  )}
                  <p className="text-[14px] font-semibold text-foreground mb-2">
                    {lang === "ru" ? plan.titleRu : plan.titleEn}
                  </p>
                  <p className="text-[22px] font-bold text-foreground leading-tight">
                    {lang === "ru" ? plan.priceRu : plan.priceEn}
                    <span className="text-[13px] font-normal text-muted-foreground">
                      {lang === "ru" ? plan.subRu : plan.subEn}
                    </span>
                  </p>
                  {plan.id === "yearly" && (
                    <p className="text-[12px] text-green-600 font-medium mt-1">
                      {lang === "ru" ? "₽800/месяц" : "$8.25/mo"}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Benefits */}
        <div className="px-5 py-4 space-y-3.5">
          {benefits.map((b, i) => (
            <div key={i} className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-[15px] text-foreground">{b}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="px-5 pb-5 pt-1">
          <button className="w-full h-12 rounded-xl text-[16px] font-bold text-white bg-gradient-to-r from-[hsl(35,100%,55%)] to-[hsl(30,100%,65%)] hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-md">
            <Zap className="w-5 h-5" />
            {lang === "ru" ? "Купить подписку" : "Buy subscription"}
          </button>
          <p className="text-center text-[12px] text-muted-foreground mt-3">
            {lang === "ru" ? "30-дневная гарантия возврата денег" : "30-day money-back guarantee"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionModal;
