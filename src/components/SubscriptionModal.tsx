import { useState } from "react";
import mascotSuccess from "@/assets/mascot-success.png";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, Crown, Zap, Check, ChevronLeft, CreditCard, Bitcoin } from "lucide-react";
import { purchaseSubscription } from "@/hooks/usePurchaseStore";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type PlanId = "monthly" | "yearly";
type Step = "plan" | "payment" | "success";

const SubscriptionModal = ({ open, onOpenChange }: SubscriptionModalProps) => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("yearly");
  const [step, setStep] = useState<Step>("plan");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "crypto">("card");

  const plans: {
    id: PlanId;
    titleRu: string;
    titleEn: string;
    priceRu: string;
    priceEn: string;
    subRu: string;
    subEn: string;
    perMonthRu?: string;
    perMonthEn?: string;
    badgeRu?: string;
    badgeEn?: string;
  }[] = [
    {
      id: "monthly",
      titleRu: "Месячная",
      titleEn: "Monthly",
      priceRu: "₽1,200",
      priceEn: "$14",
      subRu: " /месяц",
      subEn: " /mo",
    },
    {
      id: "yearly",
      titleRu: "Годовая",
      titleEn: "Yearly",
      priceRu: "₽9,600",
      priceEn: "$99",
      subRu: " /год",
      subEn: " /yr",
      perMonthRu: "₽800/месяц",
      perMonthEn: "$8.25/mo",
      badgeRu: "Скидка 33%",
      badgeEn: "Save 33%",
    },
  ];

  const benefits = lang === "ru"
    ? [
        "Доступ ко всем премиум курсам",
        "Эксклюзивный доступ к сообществу",
        "Приоритетная поддержка",
        "Обновления навсегда",
      ]
    : [
        "Access to all premium courses",
        "Exclusive community access",
        "Priority support",
        "Updates forever",
      ];

  const selectedPlanData = plans.find((p) => p.id === selectedPlan)!;

  const handleClose = (value: boolean) => {
    onOpenChange(value);
    if (!value) setStep("plan");
  };

  if (step === "success") {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[576px] max-h-[90vh] p-0 gap-0 overflow-y-auto border-0 rounded-2xl [&>button.absolute]:hidden">
          <div className="px-8 py-12 flex flex-col items-center text-center">
            <h2 className="text-[28px] font-medium text-foreground leading-[90%] mb-4">
              {lang === "ru" ? "Спасибо!" : "Thank you!"}
            </h2>
            <h2 className="text-[28px] font-medium text-foreground leading-[90%] mb-9">
              {lang === "ru" ? "Оплата получена" : "Your payment has been received"}
            </h2>
            <p className="text-[18px] text-muted-foreground leading-[100%] max-w-[502px] mb-12">
              {lang === "ru"
                ? "Подписка активирована. Вы получите подтверждение на email."
                : "Subscription activated. You will receive a confirmation receipt by email."}
            </p>
            <img src={mascotSuccess} alt="" className="w-[300px] mb-10" />
            <div className="flex items-center gap-3 w-full max-w-[492px]">
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-lg text-[20px] font-medium bg-[hsl(var(--muted))] border-0 text-foreground hover:bg-[hsl(var(--muted)/0.8)]"
                onClick={() => {
                  handleClose(false);
                  navigate("/catalog");
                }}
              >
                {lang === "ru" ? "В каталог" : "Back to Catalog"}
              </Button>
              <Button
                className="flex-1 h-12 rounded-lg text-[20px] font-medium bg-[#232323] hover:bg-[#464646] text-white"
                onClick={() => handleClose(false)}
              >
                {lang === "ru" ? "К курсам" : "Go to courses"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[440px] max-h-[90vh] p-0 gap-0 border-0 rounded-2xl shadow-2xl overflow-hidden [&>button.absolute]:hidden">
        <div className="overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-violet-dark via-primary to-violet-light px-6 pt-10 pb-8 text-center rounded-t-2xl overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-violet-super-light/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-violet-mid/25 blur-2xl pointer-events-none" />

          {step === "payment" && (
            <button
              onClick={() => setStep("plan")}
              className="absolute top-4 left-4 w-8 h-8 rounded-full bg-primary-foreground/15 backdrop-blur-sm flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/25 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => handleClose(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary-foreground/15 backdrop-blur-sm flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/25 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-16 h-16 rounded-2xl bg-primary-foreground/15 backdrop-blur-sm flex items-center justify-center mx-auto mb-5 rotate-3">
            {step === "plan" ? (
              <Crown className="w-8 h-8 text-primary-foreground drop-shadow-sm" />
            ) : (
              <CreditCard className="w-8 h-8 text-primary-foreground drop-shadow-sm" />
            )}
          </div>

          <h2 className="text-[22px] font-bold text-primary-foreground leading-tight mb-1.5">
            {step === "plan"
              ? (lang === "ru" ? "Разблокировать премиум" : "Unlock Premium")
              : (lang === "ru" ? "Выберите способ оплаты" : "Choose payment method")
            }
          </h2>
          <p className="text-[14px] text-primary-foreground/75 leading-snug max-w-[280px] mx-auto">
            {step === "plan"
              ? (lang === "ru" ? "Неограниченный доступ ко всем курсам" : "Unlimited access to all courses")
              : (lang === "ru" ? "Выберите, как вы хотите оплатить" : "Choose how you want to pay")
            }
          </p>
        </div>

        {step === "plan" ? (
          <>
            {/* Plan cards */}
            <div className="px-5 -mt-4 relative z-10">
              <div className="flex gap-3">
                {plans.map((plan) => {
                  const isSelected = selectedPlan === plan.id;
                  const badge = lang === "ru" ? plan.badgeRu : plan.badgeEn;

                  return (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`
                        flex-1 rounded-xl px-3 py-4 text-center transition-all relative
                        bg-background shadow-sm
                        ${isSelected
                          ? "ring-2 ring-primary shadow-md"
                          : "ring-1 ring-border hover:ring-muted-foreground/30"
                        }
                      `}
                    >
                      {badge && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[11px] font-semibold bg-green-500 text-primary-foreground rounded-full px-2.5 py-0.5 whitespace-nowrap">
                          {badge}
                        </span>
                      )}
                      <p className="text-[13px] font-medium text-muted-foreground mb-1.5">
                        {lang === "ru" ? plan.titleRu : plan.titleEn}
                      </p>
                      <p className="text-foreground leading-none">
                        <span className="text-[24px] font-bold">
                          {lang === "ru" ? plan.priceRu : plan.priceEn}
                        </span>
                        <span className="text-[12px] font-normal text-muted-foreground">
                          {lang === "ru" ? plan.subRu : plan.subEn}
                        </span>
                      </p>
                      {plan.perMonthRu && (
                        <p className="text-[12px] text-green-600 font-medium mt-1.5">
                          {lang === "ru" ? plan.perMonthRu : plan.perMonthEn}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Benefits */}
            <div className="px-6 pt-5 pb-2 space-y-3">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <span className="text-[14px] text-foreground font-medium">{b}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="px-5 pb-6 pt-4">
              <button
                onClick={() => setStep("payment")}
                className="w-full h-12 rounded-xl text-[15px] font-bold text-primary-foreground bg-gradient-to-r from-violet-dark to-primary hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
              >
                <Zap className="w-4 h-4" />
                {lang === "ru" ? "Продолжить" : "Continue"}
              </button>
            </div>
          </>
        ) : (
          /* Payment step */
          <div className="px-5 py-5 space-y-4">
            <button
              className={`w-full rounded-xl px-5 py-5 flex flex-col items-center gap-2 transition-all ${
                paymentMethod === "card"
                  ? "border-2 border-primary bg-primary/5"
                  : "border-2 border-border hover:border-muted-foreground/30"
              }`}
              onClick={() => setPaymentMethod("card")}
            >
              <CreditCard className="w-6 h-6 text-primary" />
              <span className="text-[15px] font-semibold text-foreground">
                {lang === "ru" ? "Банковская карта" : "Bank card"}
              </span>
              <span className="text-[13px] text-muted-foreground">Visa, Mastercard, Maestro</span>
            </button>

            {lang === "en" && (
              <button
                className={`w-full rounded-xl px-5 py-5 flex flex-col items-center gap-2 transition-all ${
                  paymentMethod === "crypto"
                    ? "border-2 border-primary bg-primary/5"
                    : "border-2 border-border hover:border-muted-foreground/30"
                }`}
                onClick={() => setPaymentMethod("crypto")}
              >
                <Sparkles className="w-6 h-6 text-primary" />
                <span className="text-[15px] font-semibold text-foreground">Cryptocurrency</span>
                <span className="text-[13px] text-muted-foreground">BTC, ETH, USDT, TON</span>
              </button>
            )}

            <div className="bg-muted/50 rounded-xl px-4 py-3.5 flex items-center justify-between">
              <span className="text-[15px] text-foreground">
                {lang === "ru" ? "Итого" : "Total"}
              </span>
              <span className="text-[18px] font-bold text-foreground">
                {lang === "ru"
                  ? `${selectedPlanData.priceRu}${selectedPlanData.subRu}`
                  : `${selectedPlanData.priceEn}${selectedPlanData.subEn}`
                }
              </span>
            </div>

            <button
              onClick={() => {
                const priceLabel = lang === "ru"
                  ? `${selectedPlanData.priceRu}${selectedPlanData.subRu}`
                  : `${selectedPlanData.priceEn}${selectedPlanData.subEn}`;
                purchaseSubscription(selectedPlan, priceLabel);
                setStep("success");
              }}
              className="w-full h-12 rounded-xl text-[15px] font-bold text-primary-foreground bg-gradient-to-r from-violet-dark to-primary hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
            >
              <Zap className="w-4 h-4" />
              {lang === "ru" ? "Подтвердить оплату" : "Confirm payment"}
            </button>
          </div>
        )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionModal;
