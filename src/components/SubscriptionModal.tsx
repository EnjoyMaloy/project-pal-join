import { useState } from "react";
import mascotSuccess from "@/assets/mascot-success.png";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, Check, ChevronLeft, CreditCard, Bitcoin } from "lucide-react";
import PremiumStarIcon from "@/components/icons/PremiumStarIcon";
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

  const plans = [
    {
      id: "monthly" as PlanId,
      titleRu: "Месячная",
      titleEn: "Monthly",
      priceRu: "₽1,200",
      priceEn: "$ 14",
      subRu: " /мес",
      subEn: " /mo",
    },
    {
      id: "yearly" as PlanId,
      titleRu: "Годовая",
      titleEn: "Yearly",
      priceRu: "₽9,600",
      priceEn: "$ 99",
      subRu: " /год",
      subEn: " /yr",
      perMonthRu: "₽800/месяц",
      perMonthEn: "$8.25/mo",
      badgeRu: "Лучшая цена!",
      badgeEn: "Best value!",
      discountRu: "Скидка 33%",
      discountEn: "30% off!",
      oldPriceRu: "₽14,400",
      oldPriceEn: "$168",
      oldSubRu: " /год",
      oldSubEn: " /year",
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
            <Button
              className="w-full max-w-[492px] h-12 rounded-lg text-[20px] font-medium bg-[#232323] hover:bg-[#464646] text-white"
              onClick={() => {
                handleClose(false);
                navigate("/catalog");
              }}
            >
              {lang === "ru" ? "В каталог" : "Go to Catalog"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[440px] max-h-[90vh] p-0 gap-0 border-0 rounded-3xl shadow-2xl overflow-hidden [&>button.absolute]:hidden bg-gradient-to-b from-[hsl(280_92%_1%)] to-[hsl(280_92%_5%)]">
        <div className="overflow-y-auto max-h-[90vh]">
          {/* Header area */}
          <div className="relative px-6 pt-6 pb-6 text-center overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] rounded-full bg-[hsl(var(--violet-mid)/0.3)] blur-[80px] pointer-events-none" />

            {/* Close button */}
            <button
              onClick={() => handleClose(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {step === "payment" && (
              <button
                onClick={() => setStep("plan")}
                className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors z-10"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            {/* Icon with glow */}
            <div className="relative w-20 h-20 mx-auto mb-5 mt-4">
              <div className="absolute inset-0 rounded-full bg-[hsl(var(--violet-mid)/0.5)] blur-xl" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-b from-[hsl(var(--violet-dark))] to-[hsl(var(--violet-super-dark))] flex items-center justify-center">
                {step === "plan" ? (
                  <PremiumStarIcon className="w-9 h-9" fill="white" />
                ) : (
                  <CreditCard className="w-9 h-9 text-white" />
                )}
              </div>
            </div>

            <h2 className="text-[22px] font-bold text-white leading-tight mb-1">
              {step === "plan"
                ? (lang === "ru" ? "Разблокировать премиум" : "Unlock Premium")
                : (lang === "ru" ? "Способ оплаты" : "Payment method")
              }
            </h2>
            <p className="text-[14px] text-white/50 leading-snug">
              {step === "plan"
                ? (lang === "ru" ? "Неограниченный доступ ко всем курсам" : "Unlimited access to all courses")
                : (lang === "ru" ? "Выберите, как вы хотите оплатить" : "Choose how you want to pay")
              }
            </p>
          </div>

          {step === "plan" ? (
            <>
              {/* Benefits as review-style card */}
              <div className="px-5 mb-5">
                <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4">
                  <div className="space-y-2.5">
                    {benefits.map((b, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-[hsl(var(--violet-mid)/0.25)] flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-[hsl(var(--violet-light))]" />
                        </div>
                        <span className="text-[13px] text-white/80">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Plan selection pills */}
              <div className="px-5 mb-4">
                <div className="flex gap-2.5">
                  {plans.map((plan) => {
                    const isSelected = selectedPlan === plan.id;
                    const badge = lang === "ru" ? plan.badgeRu : plan.badgeEn;

                    return (
                      <button
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan.id)}
                        className={`
                          flex-1 rounded-xl px-3 py-4 text-center transition-all relative
                          ${isSelected
                            ? "border-2 border-[hsl(var(--violet-light))] bg-white/10"
                            : "border border-white/15 bg-white/5 hover:border-white/25"
                          }
                        `}
                      >
                        {badge && (
                          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-semibold bg-[hsl(var(--violet-mid))] text-[hsl(var(--violet-super-dark))] rounded-full px-2.5 py-0.5 whitespace-nowrap">
                            {badge}
                          </span>
                        )}
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[hsl(var(--violet-light))] flex items-center justify-center">
                            <Check className="w-3 h-3 text-[hsl(var(--violet-super-dark))]" />
                          </div>
                        )}
                        <p className="text-[13px] font-medium text-white/60 mb-1">
                          {lang === "ru" ? plan.titleRu : plan.titleEn}
                        </p>
                        <p className="text-white leading-none">
                          <span className="text-[22px] font-bold">
                            {lang === "ru" ? plan.priceRu : plan.priceEn}
                          </span>
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected plan details */}
              <div className="px-5 mb-5">
                <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[16px] font-bold text-white">
                        {lang === "ru" ? selectedPlanData.titleRu : selectedPlanData.titleEn}
                      </span>
                      {selectedPlanData.discountRu && (
                        <span className="text-[11px] font-medium border border-white/20 text-white/70 rounded-full px-2 py-0.5">
                          {lang === "ru" ? selectedPlanData.discountRu : selectedPlanData.discountEn}
                        </span>
                      )}
                    </div>
                    <span className="text-[18px] font-bold text-white">
                      {lang === "ru" ? selectedPlanData.priceRu : selectedPlanData.priceEn}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-white/40">
                      {selectedPlanData.perMonthRu
                        ? (lang === "ru" ? `Всего ${selectedPlanData.perMonthRu}` : `Just ${selectedPlanData.perMonthEn}`)
                        : ""}
                    </span>
                    {selectedPlanData.oldPriceRu && (
                      <span className="text-[13px] text-white/30 line-through">
                        {lang === "ru" ? `${selectedPlanData.oldPriceRu}${selectedPlanData.oldSubRu}` : `${selectedPlanData.oldPriceEn}${selectedPlanData.oldSubEn}`}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="px-5 pb-5">
                <button
                  onClick={() => setStep("payment")}
                  className="w-full h-[52px] rounded-2xl text-[15px] font-bold text-[hsl(var(--violet-super-dark))] bg-[hsl(var(--violet-mid))] hover:bg-[hsl(var(--violet-light))] transition-all flex items-center justify-center gap-2"
                >
                  {lang === "ru"
                    ? `Подписаться — ${selectedPlanData.priceRu}${selectedPlanData.subRu}`
                    : `Subscribe ${selectedPlanData.titleEn}`
                  }
                </button>
              </div>

              {/* Footer links */}
              <div className="flex items-center justify-center gap-3 pb-5 text-[12px] text-white/30">
                <span className="hover:text-white/50 cursor-pointer transition-colors">
                  {lang === "ru" ? "Условия" : "Terms"}
                </span>
                <span>·</span>
                <span className="hover:text-white/50 cursor-pointer transition-colors">
                  {lang === "ru" ? "Конфиденциальность" : "Privacy"}
                </span>
              </div>
            </>
          ) : (
            /* Payment step */
            <div className="px-5 py-4 space-y-3">
              <button
                className={`w-full rounded-xl px-5 py-5 flex flex-col items-center gap-2 transition-all ${
                  paymentMethod === "card"
                    ? "border-2 border-[hsl(var(--violet-light))] bg-white/10"
                    : "border border-white/15 bg-white/5 hover:border-white/25"
                }`}
                onClick={() => setPaymentMethod("card")}
              >
                <CreditCard className="w-6 h-6 text-[hsl(var(--violet-light))]" />
                <span className="text-[15px] font-semibold text-white">
                  {lang === "ru" ? "Банковская карта" : "Bank card"}
                </span>
                <span className="text-[13px] text-white/40">Visa, Mastercard, Maestro</span>
              </button>

              {lang === "en" && (
                <button
                  className={`w-full rounded-xl px-5 py-5 flex flex-col items-center gap-2 transition-all ${
                    paymentMethod === "crypto"
                      ? "border-2 border-[hsl(var(--violet-light))] bg-white/10"
                      : "border border-white/15 bg-white/5 hover:border-white/25"
                  }`}
                  onClick={() => setPaymentMethod("crypto")}
                >
                  <Bitcoin className="w-6 h-6 text-[hsl(var(--violet-light))]" />
                  <span className="text-[15px] font-semibold text-white">Cryptocurrency</span>
                  <span className="text-[13px] text-white/40">BTC, ETH, USDT, TON</span>
                </button>
              )}

              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 flex items-center justify-between">
                <span className="text-[15px] text-white/60">
                  {lang === "ru" ? "Итого" : "Total"}
                </span>
                <span className="text-[18px] font-bold text-white">
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
                className="w-full h-[52px] rounded-2xl text-[15px] font-bold text-[hsl(var(--violet-super-dark))] bg-[hsl(var(--violet-mid))] hover:bg-[hsl(var(--violet-light))] transition-all flex items-center justify-center gap-2"
              >
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
