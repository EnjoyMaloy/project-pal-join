import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, Sparkles, Zap, Check } from "lucide-react";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseTitleRu: string;
  courseTitleEn: string;
}

type PlanId = "single" | "monthly" | "yearly";

const PaymentModal = ({ open, onOpenChange, courseTitleRu, courseTitleEn }: PaymentModalProps) => {
  const { lang } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("single");

  const courseTitle = lang === "ru" ? courseTitleRu : courseTitleEn;

  const plans: { id: PlanId; titleRu: string; titleEn: string; descRu: string; descEn: string; priceRu: string; priceEn: string; badge?: string }[] = [
    {
      id: "single",
      titleRu: "Один курс",
      titleEn: "Single course",
      descRu: "Навсегда доступ только к этому курсу",
      descEn: "Lifetime access to this course only",
      priceRu: "₽2,400",
      priceEn: "$29",
    },
    {
      id: "monthly",
      titleRu: "Полный доступ - Месячный доступ",
      titleEn: "Full Access - Monthly",
      descRu: "Все премиум курсы на 1 месяц",
      descEn: "All premium courses for 1 month",
      priceRu: "₽1,200/мес",
      priceEn: "$14/mo",
    },
    {
      id: "yearly",
      titleRu: "Полный доступ - Годовой доступ",
      titleEn: "Full Access - Yearly",
      descRu: "Все премиум курсы на 1 год",
      descEn: "All premium courses for 1 year",
      priceRu: "₽9,600/год",
      priceEn: "$99/yr",
      badge: lang === "ru" ? "Выгоднее" : "Best value",
    },
  ];

  const benefits = lang === "ru"
    ? ["Навсегда доступ", "Все материалы курса", "Сертификат о завершении"]
    : ["Lifetime access", "All course materials", "Certificate of completion"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] p-0 gap-0 overflow-y-auto border-0 rounded-2xl">
        {/* Header */}
        <div className="bg-gradient-to-b from-[hsl(var(--primary))] to-[hsl(var(--primary)/0.8)] px-5 pt-6 pb-4 text-center relative">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-primary-foreground hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <h2 className="text-[18px] font-bold text-primary-foreground mb-0.5">
            {lang === "ru" ? "Получить доступ" : "Get Access"}
          </h2>
          <p className="text-[13px] text-primary-foreground/80">
            {lang === "ru" ? "Выберите, как вы хотите получить доступ к курсу" : "Choose how you want to access the course"}
          </p>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-2.5">
          {/* Course name pill */}
          <div className="border border-border rounded-xl px-4 py-3 text-center">
            <span className="text-[14px] font-medium text-foreground">{courseTitle}</span>
          </div>

          {/* Plans */}
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`w-full text-left border rounded-xl px-4 py-3.5 flex items-center justify-between transition-all relative ${
                selectedPlan === plan.id
                  ? "border-primary border-2 bg-primary/5"
                  : "border-border hover:border-muted-foreground/30"
              }`}
            >
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-foreground">{lang === "ru" ? plan.titleRu : plan.titleEn}</p>
                <p className="text-[12px] text-muted-foreground">{lang === "ru" ? plan.descRu : plan.descEn}</p>
              </div>
              <div className="flex flex-col items-end flex-shrink-0 ml-3">
                {plan.badge && (
                  <span className="text-[11px] font-semibold bg-green-500 text-white rounded px-2 py-0.5 mb-1">
                    {plan.badge}
                  </span>
                )}
                <span className="text-[16px] font-bold text-foreground whitespace-nowrap">
                  {lang === "ru" ? plan.priceRu : plan.priceEn}
                </span>
              </div>
            </button>
          ))}

          {/* Benefits */}
          <div className="bg-muted/50 rounded-xl px-4 py-4 space-y-2.5">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-[14px] text-foreground">{b}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Button className="w-full h-12 rounded-xl text-[15px] font-semibold gap-2">
            <Zap className="w-4 h-4" />
            {lang === "ru" ? "Продолжить" : "Continue"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
