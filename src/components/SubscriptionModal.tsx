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
  const [shimmerKey, setShimmerKey] = useState(0);

  const plans = [
    {
      id: "monthly" as PlanId,
      titleRu: "На месяц",
      titleEn: "Monthly",
      priceRu: "₽480",
      priceEn: "$6",
      subRu: " /мес",
      subEn: " /mo",
    },
    {
      id: "yearly" as PlanId,
      titleRu: "На год",
      titleEn: "Yearly",
      priceRu: "₽3,168",
      priceEn: "$39.60",
      subRu: " /год",
      subEn: " /yr",
      perMonthRu: "₽264/месяц",
      perMonthEn: "$3.30/mo",
      badgeRu: "Лучшая цена!",
      badgeEn: "Best value!",
      discountRu: "Скидка 45%",
      discountEn: "45% off!",
      oldPriceRu: "₽5,760",
      oldPriceEn: "$72",
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
      <DialogContent className="sm:max-w-[440px] max-h-[90vh] p-0 gap-0 border-0 rounded-3xl shadow-[0_0_120px_40px_hsl(var(--violet-dark)/0.4)] overflow-hidden [&>button.absolute]:hidden bg-gradient-to-b from-[hsl(280_92%_1%)] to-[hsl(280_92%_5%)]">
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

            {/* Icon with soft glow underneath */}
            <div className="relative w-20 h-20 mx-auto mb-5 mt-4 flex items-center justify-center">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-16 rounded-full bg-[hsl(var(--violet-super-light)/0.25)] blur-3xl pointer-events-none" />
              <div className="relative">
                {step === "plan" ? (
                  <PremiumStarIcon className="w-14 h-14 text-[hsl(var(--violet-super-light))]" fill="hsl(var(--violet-super-light))" />
                ) : (
                  <CreditCard className="w-14 h-14 text-[hsl(var(--violet-super-light))]" />
                )}
              </div>
            </div>

            <h2 className="text-white leading-[22px] text-3xl font-normal">
              {step === "plan"
                ? (lang === "ru" ? "Разблокировать премиум" : "Unlock Premium")
                : (lang === "ru" ? "Способ оплаты" : "Payment method")
              }
            </h2>
          </div>

          {step === "plan" ? (
            <>
              {/* Benefits as review-style card */}
              <div className="px-5 mb-5">
                <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4">
                <div className="space-y-3">
                    {benefits.map((b, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[hsl(var(--violet-dark)/0.4)] to-[hsl(var(--violet-dark)/0.2)] border border-[hsl(var(--violet-light)/0.6)] flex items-center justify-center flex-shrink-0 animate-[shimmer-border_2s_ease-in-out_infinite] shadow-[0_0_6px_hsl(var(--violet-light)/0.3)]">
                          <Check className="w-3.5 h-3.5 text-[hsl(var(--violet-super-light))]" strokeWidth={3} />
                        </div>
                        <span className="text-[16px] text-white/80">{b}</span>
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
                        onClick={() => { setSelectedPlan(plan.id); if (plan.id === "yearly") setShimmerKey(k => k + 1); }}
                        className={`
                          flex-1 rounded-xl px-3 py-4 text-center transition-all relative
                          ${isSelected
                            ? "border-2 border-[hsl(var(--violet-light))] bg-white/10"
                            : "border border-white/15 bg-white/5 hover:border-white/25"
                          }
                        `}
                      >
                        {badge && (
                          <span className={`absolute -top-2.5 left-1/2 -translate-x-1/2 font-medium bg-[hsl(var(--violet-mid))] text-[hsl(var(--violet-super-dark))] rounded-full px-2.5 py-0.5 whitespace-nowrap text-sm transition-transform ${isSelected ? "animate-[badge-bounce_0.4s_ease-out]" : ""}`}>
                            {badge}
                          </span>
                        )}
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[hsl(var(--violet-light))] flex items-center justify-center">
                            <Check className="w-3 h-3 text-[hsl(var(--violet-super-dark))]" />
                          </div>
                        )}
                        <p className="text-white/60 mb-1 text-center font-sans text-sm font-normal">
                          {lang === "ru" ? plan.titleRu : plan.titleEn}
                        </p>
                        <p className="text-white leading-none">
                          <span
                            key={`top-price-${plan.id}-${shimmerKey}`}
                            className="text-2xl font-normal"
                            style={plan.id === "yearly" && isSelected && shimmerKey > 0 ? {
                              background: "linear-gradient(90deg, white 40%, hsl(var(--violet-super-light)) 50%, white 60%)",
                              backgroundSize: "300% auto",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              animation: "text-shimmer 1.2s ease-in-out 1s 1 forwards",
                              backgroundPosition: "-300% center",
                            } : {}}
                          >
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
                <div className="rounded-xl bg-white/5 px-5 py-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-normal text-xl">
                        {lang === "ru" ? selectedPlanData.titleRu : selectedPlanData.titleEn}
                      </span>
                      {selectedPlanData.discountRu && (
                        <span className="border-2 border-[hsl(var(--violet-mid))] text-[hsl(var(--violet-mid))] rounded-full px-2 py-0.5 font-medium text-xs">
                          {lang === "ru" ? selectedPlanData.discountRu : selectedPlanData.discountEn}
                        </span>
                      )}
                    </div>
                    <span className="text-white font-normal text-3xl">
                      {lang === "ru" ? selectedPlanData.priceRu : selectedPlanData.priceEn}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      key={`permonth-${shimmerKey}`}
                      className="text-white/40 font-normal text-lg"
                      style={selectedPlan === "yearly" && shimmerKey > 0 && selectedPlanData.perMonthRu ? {
                        background: "linear-gradient(90deg, rgba(255,255,255,0.4) 40%, hsl(var(--violet-super-light)) 50%, rgba(255,255,255,0.4) 60%)",
                        backgroundSize: "300% auto",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        animation: "text-shimmer 0.6s ease-in-out 2s 1 forwards",
                        backgroundPosition: "-300% center",
                      } : {}}
                    >
                      {selectedPlanData.perMonthRu
                        ? (lang === "ru" ? `Всего ${selectedPlanData.perMonthRu}` : `Just ${selectedPlanData.perMonthEn}`)
                        : ""}
                    </span>
                    {selectedPlanData.oldPriceRu && (
                      <span className="text-white/30 font-normal text-lg">
                        <span className="line-through">{lang === "ru" ? selectedPlanData.oldPriceRu : selectedPlanData.oldPriceEn}</span>
                        {lang === "ru" ? selectedPlanData.oldSubRu : selectedPlanData.oldSubEn}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="px-5 pb-5">
                <button
                  onClick={() => setStep("payment")}
                  className="w-full h-[52px] rounded-2xl text-[hsl(var(--violet-super-dark))] bg-[hsl(var(--violet-mid))] hover:bg-[hsl(var(--violet-light))] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 text-xl font-medium"
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
            <div className="px-5 pt-6 pb-4 space-y-3">
              <button
                className={`w-full rounded-xl px-5 py-5 flex flex-col items-center gap-2 transition-all ${
                  paymentMethod === "card"
                    ? "border-2 border-[hsl(var(--violet-light))] bg-white/10"
                    : "border border-white/15 bg-white/5 hover:border-white/25"
                }`}
                onClick={() => setPaymentMethod("card")}
              >
                <CreditCard className="w-6 h-6 text-[hsl(var(--violet-light))]" />
                <span className="text-white font-normal text-2xl">
                  {lang === "ru" ? "Банковская карта" : "Bank card"}
                </span>
                <span className="text-white/40 font-normal text-base">Visa, Mastercard, Maestro</span>
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

              <div className="rounded-xl bg-white/5 px-4 py-3.5 flex items-center justify-between">
                <span className="text-white/60 text-lg font-normal">
                  {lang === "ru" ? "Итого" : "Total"}
                </span>
                <span className="text-white text-xl font-normal">
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
                className="w-full h-[52px] rounded-2xl text-[hsl(var(--violet-super-dark))] bg-[hsl(var(--violet-mid))] hover:bg-[hsl(var(--violet-light))] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 text-xl font-medium"
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
