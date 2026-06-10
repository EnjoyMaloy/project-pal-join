import { useState, useRef, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import mascotSuccess from "@/assets/mascot-success.png";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, Check, ChevronLeft, CreditCard, Bitcoin, Loader2 } from "lucide-react";
import PremiumStarIcon from "@/components/icons/PremiumStarIcon";
import { purchaseSubscription } from "@/hooks/usePurchaseStore";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type PlanId = "monthly" | "yearly";
type Step = "plan" | "payment" | "success";

const ResponsiveModal = ({ open, onOpenChange, children, className }: { open: boolean; onOpenChange: (v: boolean) => void; children: React.ReactNode; className?: string }) => {
  const isMobile = useIsMobile();
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className={`max-h-[90vh] p-0 border-0 ${className || ""}`}>
          <div className="overflow-y-auto max-h-[85vh]">
            {children}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className}>
        {children}
      </DialogContent>
    </Dialog>
  );
};

const SubscriptionModal = ({ open, onOpenChange }: SubscriptionModalProps) => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("yearly");
  const [step, setStep] = useState<Step>("plan");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "crypto">("card");
  const [shimmerKey, setShimmerKey] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [autoBilling, setAutoBilling] = useState(false);
  const billingTermsRef = useRef<HTMLParagraphElement>(null);

  // ---- Promo code state ----
  type PromoSuccess =
    | { kind: "percent"; code: string; percent: number }
    | { kind: "free_months"; code: string; months: number };
  type PromoErrorCode = "not_found" | "expired" | "limit" | "used" | "wrong_plan";
  const [promoInput, setPromoInput] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<PromoSuccess | null>(null);
  const [promoError, setPromoError] = useState<{ code: PromoErrorCode; requiredPlan?: PlanId } | null>(null);

  // Demo promo DB
  const PROMO_DB: Record<string, { type: "percent" | "free_months"; value: number; plan_restriction?: PlanId; state?: "expired" | "limit" | "used" }> = {
    CRYPTON50: { type: "percent", value: 50 },
    SAVE20: { type: "percent", value: 20 },
    YEARLY30: { type: "percent", value: 30, plan_restriction: "yearly" },
    MONTHLY15: { type: "percent", value: 15, plan_restriction: "monthly" },
    TEST25: { type: "percent", value: 25 },
    FRIEND3M: { type: "free_months", value: 3 },
    WELCOME1M: { type: "free_months", value: 1 },
    EXPIRED: { type: "percent", value: 10, state: "expired" },
    SOLDOUT: { type: "percent", value: 25, state: "limit" },
    USEDCODE: { type: "percent", value: 10, state: "used" },
  };

  type PromoResult =
    | { ok: true; promo: PromoSuccess }
    | { ok: false; error: { code: PromoErrorCode; requiredPlan?: PlanId } };
  const validatePromo = (rawCode: string, plan: PlanId): PromoResult => {
    const code = rawCode.trim().toUpperCase();
    const entry = PROMO_DB[code];
    if (!entry) return { ok: false, error: { code: "not_found" } };
    if (entry.state === "expired") return { ok: false, error: { code: "expired" } };
    if (entry.state === "limit") return { ok: false, error: { code: "limit" } };
    if (entry.state === "used") return { ok: false, error: { code: "used" } };
    if (entry.plan_restriction && entry.plan_restriction !== plan) {
      return { ok: false, error: { code: "wrong_plan", requiredPlan: entry.plan_restriction } };
    }
    const promo: PromoSuccess = entry.type === "percent"
      ? { kind: "percent", code, percent: entry.value }
      : { kind: "free_months", code, months: entry.value };
    return { ok: true, promo };
  };

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    setPromoError(null);
    setTimeout(() => {
      const result = validatePromo(promoInput, selectedPlan);
      if (result.ok === true) {
        setAppliedPromo(result.promo);
        setPromoError(null);
      } else if (result.ok === false) {
        setAppliedPromo(null);
        setPromoError(result.error);
      }
      setPromoLoading(false);
    }, 500);
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoError(null);
    setPromoInput("");
  };

  // Re-validate when plan changes
  useEffect(() => {
    if (!appliedPromo) return;
    const result = validatePromo(appliedPromo.code, selectedPlan);
    if (result.ok === true) {
      setAppliedPromo(result.promo);
      setPromoError(null);
    } else if (result.ok === false) {
      setAppliedPromo(null);
      setPromoError(result.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlan]);

  // Price helpers
  const parsePrice = (price: string) => {
    const num = parseFloat(price.replace(/[^0-9.]/g, "").replace(",", ""));
    const prefix = price.match(/^[₽$]/)?.[0] || "";
    return { num, prefix };
  };
  const formatPrice = (num: number, prefix: string) => {
    const rounded = Math.round(num * 100) / 100;
    return `${prefix}${rounded % 1 === 0 ? rounded.toLocaleString("en-US") : rounded.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  };
  const getDiscountedPrice = (price: string) => {
    if (!appliedPromo || appliedPromo.kind !== "percent") return price;
    const { num, prefix } = parsePrice(price);
    return formatPrice(num * (1 - appliedPromo.percent / 100), prefix);
  };
  const getPerMonthAfterFree = (price: string) => {
    // For free_months, post-trial monthly price = monthly equivalent
    const { num, prefix } = parsePrice(price);
    if (selectedPlan === "yearly") return formatPrice(num / 12, prefix);
    return formatPrice(num, prefix);
  };

  useEffect(() => {
    if (autoBilling) {
      setTimeout(() => billingTermsRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 100);
    }
  }, [autoBilling]);

  const applyDiscount = (price: string) => {
    const num = parseFloat(price.replace(/[^0-9.]/g, "").replace(",", ""));
    const discounted = Math.round(num * 0.9 * 100) / 100;
    const prefix = price.match(/^[₽$]/)?.[0] || "";
    return `${prefix}${discounted % 1 === 0 ? discounted.toLocaleString("en-US") : discounted.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  };

  const plans = [
    {
      id: "monthly" as PlanId,
      titleRu: "На месяц",
      titleEn: "Monthly",
      priceRu: "₽480",
      priceEn: "$6",
      subRu: " /мес",
      subEn: " /mo",
      discountRu: "Скидка 20%",
      discountEn: "20% off!",
      oldPriceRu: "₽600",
      oldPriceEn: "$7.50",
      oldSubRu: " /мес",
      oldSubEn: " /mo",
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
        "Все платные курсы без ограничений",
        "Доступ в закрытые сообщества внутри курсов",
        "Premium статус в профиле",
        "AI-генерация — 3 курса в месяц",
      ]
    : [
        "All paid courses with no limits",
        "Access to private communities inside courses",
        "Premium profile status",
        "AI generation — 3 courses per month",
      ];

  const selectedPlanData = plans.find((p) => p.id === selectedPlan)!;

  const handleClose = (value: boolean) => {
    onOpenChange(value);
    if (!value) { setStep("plan"); setAutoBilling(false); setAppliedPromo(null); setPromoError(null); setPromoInput(""); }
  };

  if (step === "success") {
    return (
      <ResponsiveModal open={open} onOpenChange={handleClose} className="sm:max-w-[576px] max-h-[90vh] p-0 gap-0 overflow-y-auto border-0 rounded-2xl [&>button.absolute]:hidden bg-white">
          <div className="px-8 py-12 flex flex-col items-center text-center bg-white rounded-t-2xl">
            <h2 className="text-[28px] font-medium text-[#232323] leading-[90%] mb-4">
              {lang === "ru" ? "Спасибо!" : "Thank you!"}
            </h2>
            <h2 className="text-[28px] font-medium text-[#232323] leading-[90%] mb-9">
              {lang === "ru" ? "Оплата получена" : "Your payment has been received"}
            </h2>
            <p className="text-[18px] text-[#8D8D8D] leading-[100%] max-w-[502px] mb-12">
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
      </ResponsiveModal>
    );
  }

  return (
    <ResponsiveModal open={open} onOpenChange={handleClose} className="sm:max-w-[440px] max-h-[90vh] p-0 gap-0 border-0 rounded-3xl overflow-hidden [&>button.rounded-sm]:hidden bg-gradient-to-b from-[hsl(280_92%_1%)] to-[hsl(280_92%_5%)]">
        {/* Background glow - sits behind all content */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[70%] h-[200px] rounded-full bg-[hsl(var(--violet-mid)/0.3)] blur-[80px] pointer-events-none z-0" />

        {/* Close button - fixed over content */}
        <button
          onClick={() => handleClose(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors z-30"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Back button - fixed over content */}
        {step === "payment" && (
          <button
            onClick={() => setStep("plan")}
            className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors z-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        <div className="overflow-y-auto max-h-[90vh] relative z-[1]">
          {/* Header area */}
          <div className="relative px-6 pt-6 pb-6 text-center">

            {/* Icon with soft glow underneath */}
            <div className="relative w-20 h-20 mx-auto mb-5 mt-4 flex items-center justify-center">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[180%] h-24 rounded-full bg-[rgba(232,220,251,0.1)] blur-[90px] pointer-events-none" />
              <div className="relative">
                {step === "plan" ? (
                  <PremiumStarIcon className="w-14 h-14 text-[#E8DCFB]" fill="#E8DCFB" />
                ) : (
                  <CreditCard className="w-14 h-14 text-[#E8DCFB]" />
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
                <div className="rounded-xl border border-[hsl(280_25%_14%)] bg-[hsl(280_40%_8%)] px-5 py-4">
                <div className="space-y-3">
                    {benefits.map((b, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[hsl(var(--violet-dark)/0.4)] to-[hsl(var(--violet-dark)/0.2)] border border-[hsl(var(--violet-light)/0.6)] flex items-center justify-center flex-shrink-0 animate-[shimmer-border_2s_ease-in-out_infinite] shadow-[0_0_6px_hsl(var(--violet-light)/0.3)]">
                          <Check className="w-3.5 h-3.5 text-[#E8DCFB]" strokeWidth={3} />
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
                    const isFreeMonths = appliedPromo?.kind === "free_months";
                    const isSelected = selectedPlan === plan.id && !isFreeMonths;
                    const badge = lang === "ru" ? plan.badgeRu : plan.badgeEn;
                    const isPromoHighlight = promoError?.code === "wrong_plan" && promoError.requiredPlan === plan.id;

                    return (
                      <button
                        key={plan.id}
                        onClick={() => { setSelectedPlan(plan.id); if (plan.id === "yearly") setShimmerKey(k => k + 1); }}
                        className={`
                          flex-1 rounded-xl px-3 py-4 text-center transition-all relative
                          ${isSelected
                            ? "border-2 border-[hsl(var(--violet-light))] bg-white/10"
                            : isPromoHighlight
                              ? "border-2 border-[hsl(0_70%_55%)]/70 bg-white/5 animate-pulse"
                              : "border border-[hsl(280_25%_14%)] bg-white/5 hover:border-white/25"
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
                              background: "linear-gradient(90deg, white 40%, hsl(261, 100%, 93%) 50%, white 60%)",
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
              <div className="px-5 mb-4">
                <div className={`rounded-xl px-5 py-4 transition-all ${appliedPromo?.kind === "free_months" ? "border-2 border-[hsl(var(--violet-light))] bg-white/10 shadow-[0_0_20px_hsl(var(--violet-light)/0.25)]" : "bg-white/5"}`}>

                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-normal text-xl">
                        {appliedPromo?.kind === "free_months"
                          ? (lang === "ru"
                              ? `${appliedPromo.months} бесплатных месяца`
                              : `${appliedPromo.months} months free`)
                          : (lang === "ru" ? selectedPlanData.titleRu : selectedPlanData.titleEn)}
                      </span>
                      {selectedPlanData.discountRu && appliedPromo?.kind !== "free_months" && !(selectedPlan === "monthly" && !appliedPromo) && (() => {
                        const oldP = lang === "ru" ? selectedPlanData.oldPriceRu! : selectedPlanData.oldPriceEn!;
                        const baseP = lang === "ru" ? selectedPlanData.priceRu : selectedPlanData.priceEn;
                        const finalP = appliedPromo?.kind === "percent" ? getDiscountedPrice(baseP) : baseP;
                        const oldNum = parsePrice(oldP).num;
                        const finalNum = parsePrice(finalP).num;
                        const pct = Math.round((1 - finalNum / oldNum) * 100);
                        return (
                          <span className="border-2 border-[hsl(var(--violet-mid))] text-[hsl(var(--violet-mid))] rounded-full px-2 py-0.5 font-medium text-xs">
                            {lang === "ru" ? `Скидка ${pct}%` : `${pct}% off!`}
                          </span>
                        );
                      })()}
                    </div>
                    <div className="flex items-baseline gap-2">
                      {appliedPromo?.kind === "free_months" && (
                        <span className="text-white/30 font-normal text-lg line-through">
                          {lang === "ru"
                            ? `₽${(appliedPromo.months * 480).toLocaleString("ru-RU")}`
                            : `$${appliedPromo.months * 6}`}
                        </span>
                      )}
                      {selectedPlan === "monthly" && appliedPromo && appliedPromo.kind !== "free_months" && (
                        <span className="text-white/30 font-normal text-lg line-through">
                          {lang === "ru" ? selectedPlanData.oldPriceRu : selectedPlanData.oldPriceEn}
                        </span>
                      )}
                      <span className="text-white font-normal text-3xl">
                        {appliedPromo?.kind === "free_months"
                          ? "$0"
                          : appliedPromo?.kind === "percent"
                            ? getDiscountedPrice(lang === "ru" ? selectedPlanData.priceRu : selectedPlanData.priceEn)
                            : (lang === "ru" ? selectedPlanData.priceRu : selectedPlanData.priceEn)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      key={`permonth-${shimmerKey}`}
                      className="text-white/40 font-normal text-lg"
                      style={selectedPlan === "yearly" && shimmerKey > 0 && selectedPlanData.perMonthRu && !appliedPromo ? {
                        background: "linear-gradient(90deg, rgba(255,255,255,0.4) 40%, hsl(261, 100%, 93%) 50%, rgba(255,255,255,0.4) 60%)",
                        backgroundSize: "300% auto",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        animation: "text-shimmer 0.6s ease-in-out 2s 1 forwards",
                        backgroundPosition: "-300% center",
                      } : {}}
                    >
                      {appliedPromo?.kind !== "free_months" && selectedPlanData.perMonthRu && (() => {
                        const baseP = lang === "ru" ? selectedPlanData.priceRu : selectedPlanData.priceEn;
                        const finalP = appliedPromo?.kind === "percent" ? getDiscountedPrice(baseP) : baseP;
                        const { num, prefix } = parsePrice(finalP);
                        const perMonth = formatPrice(num / 12, prefix);
                        return lang === "ru" ? `Всего ${perMonth}/месяц` : `Just ${perMonth}/mo`;
                      })()}
                    </span>
                    {selectedPlan === "yearly" && selectedPlanData.oldPriceRu && (
                      <span className="text-white/30 font-normal text-lg">
                        <span className="line-through">{lang === "ru" ? selectedPlanData.oldPriceRu : selectedPlanData.oldPriceEn}</span>
                        {lang === "ru" ? selectedPlanData.oldSubRu : selectedPlanData.oldSubEn}
                      </span>
                    )}
                  </div>

                </div>
              </div>

              {/* Promo code input */}
              <div className="px-5 mb-5">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => { setPromoInput(e.target.value); if (promoError) setPromoError(null); }}
                      onKeyDown={(e) => { if (e.key === "Enter" && !appliedPromo) handleApplyPromo(); }}
                      disabled={!!appliedPromo}
                      placeholder={lang === "ru" ? "Есть промокод?" : "Have a promo code?"}
                      className={`w-full h-11 rounded-xl bg-white/5 border pl-4 text-white placeholder:text-white/40 text-base outline-none transition-colors ${
                        appliedPromo
                          ? "border-[hsl(140_60%_50%)]/50 pr-[110px]"
                          : promoError
                            ? "border-[hsl(0_70%_55%)]/60 pr-9"
                            : "border-white/15 focus:border-white/30 pr-9"
                      }`}
                    />
                    {appliedPromo && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-full bg-[hsl(140_45%_92%)] px-2 py-0.5 text-[11px] font-medium text-[hsl(140_70%_20%)]">
                        <Check className="w-3 h-3" strokeWidth={3} />
                        {appliedPromo.kind === "percent"
                          ? (lang === "ru" ? `−${appliedPromo.percent}% применено` : `−${appliedPromo.percent}% applied`)
                          : (lang === "ru" ? `${appliedPromo.months} мес. бесплатно` : `${appliedPromo.months} months free`)}
                      </div>
                    )}
                  </div>
                  {appliedPromo ? (
                    <button
                      onClick={handleRemovePromo}
                      className="h-11 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 flex items-center justify-center transition-colors"
                      aria-label="Remove promo code"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleApplyPromo}
                      disabled={!promoInput.trim() || promoLoading}
                      className="h-11 px-5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed text-white text-base font-medium transition-colors flex items-center justify-center min-w-[88px]"
                    >
                      {promoLoading
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : (lang === "ru" ? "Применить" : "Apply")}
                    </button>
                  )}
                </div>
                {promoError && (
                  <p className="mt-2 text-sm text-[hsl(0_70%_65%)]">
                    {promoError.code === "not_found" && (lang === "ru" ? "Промокод не найден" : "Promo code not found")}
                    {promoError.code === "expired" && (lang === "ru" ? "Срок действия промокода истёк" : "This promo code has expired")}
                    {promoError.code === "limit" && (lang === "ru" ? "Промокод больше недоступен" : "This promo code is no longer available")}
                    {promoError.code === "used" && (lang === "ru" ? "Вы уже использовали этот промокод" : "You have already used this promo code")}
                    {promoError.code === "wrong_plan" && (
                      lang === "ru"
                        ? `Этот код работает только для ${promoError.requiredPlan === "yearly" ? "годового" : "месячного"} тарифа`
                        : `This code works for ${promoError.requiredPlan === "yearly" ? "Yearly" : "Monthly"} plan only`
                    )}
                  </p>
                )}
              </div>

              {/* CTA */}
              <div className="px-5 pb-5">
                <button
                  onClick={() => {
                    if (appliedPromo?.kind === "free_months") {
                      const basePrice = lang === "ru" ? selectedPlanData.priceRu : selectedPlanData.priceEn;
                      const { prefix } = parsePrice(basePrice);
                      purchaseSubscription(selectedPlan, `${prefix}0`);
                      setStep("success");
                    } else {
                      setStep("payment");
                    }
                  }}
                  className="w-full h-[52px] rounded-2xl text-[hsl(var(--violet-super-dark))] bg-[hsl(var(--violet-mid))] hover:bg-[hsl(var(--violet-light))] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 text-xl font-medium"
                >
                  {(() => {
                    if (appliedPromo?.kind === "free_months") {
                      return lang === "ru"
                        ? `Активировать ${appliedPromo.months} мес. бесплатно`
                        : `Activate ${appliedPromo.months} months free`;
                    }
                    const basePrice = lang === "ru" ? selectedPlanData.priceRu : selectedPlanData.priceEn;
                    const sub = lang === "ru" ? selectedPlanData.subRu : selectedPlanData.subEn;
                    const finalPrice = appliedPromo?.kind === "percent" ? getDiscountedPrice(basePrice) : basePrice;
                    return lang === "ru"
                      ? `Подписаться — ${finalPrice}${sub}`
                      : `Subscribe ${selectedPlanData.titleEn}`;
                  })()}
                </button>

              </div>

              {/* Footer links */}
              <div className="flex items-center justify-center gap-1 pb-5 text-sm text-white/40 px-5">
                <span className="underline hover:text-white/60 transition-colors cursor-pointer">
                  {lang === "ru" ? "Условия" : "Terms"}
                </span>
                {" · "}
                <span className="underline hover:text-white/60 transition-colors cursor-pointer">
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
                  onClick={() => { setPaymentMethod("crypto"); setAutoBilling(false); }}
                >
                  <Bitcoin className="w-6 h-6 text-[hsl(var(--violet-light))]" />
                  <span className="text-white font-normal text-2xl">Cryptocurrency</span>
                  <span className="text-white/40 font-normal text-base">BTC, ETH, USDT, TON</span>
                </button>
              )}

              {/* Auto-billing discount checkbox — only for card */}
              {paymentMethod === "card" && (
              <button
                onClick={() => setAutoBilling(!autoBilling)}
                className={`w-full rounded-xl px-4 py-3.5 flex items-center gap-3 transition-all text-left ${
                  autoBilling
                    ? "border-2 border-[hsl(var(--violet-light))] bg-white/10"
                    : "border border-white/15 bg-white/5 hover:border-white/25"
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  autoBilling ? "bg-[hsl(var(--violet-light))]" : "border border-white/30"
                }`}>
                  {autoBilling && <Check className="w-3 h-3 text-[hsl(var(--violet-super-dark))]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-base font-normal">
                    {lang === "ru" ? "Автосписание" : "Auto-billing"}
                  </p>
                  <p className="text-white/40 text-sm">
                    {lang === "ru" ? "Скидка 10% при привязке карты" : "10% off when you link your card"}
                  </p>
                </div>
                <span className="text-[hsl(var(--violet-mid))] text-base font-medium flex-shrink-0">-10%</span>
              </button>
              )}

              <div className="rounded-xl bg-white/5 px-4 py-3.5 space-y-2.5">
                {appliedPromo && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">
                      {lang === "ru" ? "Промокод" : "Promo"}{" "}
                      <span className="text-white/80 font-medium">{appliedPromo.code}</span>
                    </span>
                    <span className="text-[hsl(140_60%_60%)] font-medium">
                      {appliedPromo.kind === "percent"
                        ? (() => {
                            const base = lang === "ru" ? selectedPlanData.priceRu : selectedPlanData.priceEn;
                            const { num, prefix } = parsePrice(base);
                            return `−${formatPrice(num * appliedPromo.percent / 100, prefix)}`;
                          })()
                        : (lang === "ru" ? `${appliedPromo.months} мес. бесплатно` : `${appliedPromo.months} months free`)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-lg font-normal">
                    {lang === "ru" ? "Итого" : "Total"}
                  </span>
                  <div className="flex items-baseline gap-2">
                    {(autoBilling || appliedPromo?.kind === "percent") && (
                      <span className="text-white/30 text-sm line-through">
                        {lang === "ru" ? selectedPlanData.priceRu : selectedPlanData.priceEn}
                      </span>
                    )}
                    <span className="text-white text-xl font-normal">
                      {(() => {
                        const base = lang === "ru" ? selectedPlanData.priceRu : selectedPlanData.priceEn;
                        const sub = lang === "ru" ? selectedPlanData.subRu : selectedPlanData.subEn;
                        if (appliedPromo?.kind === "free_months") {
                          const { prefix } = parsePrice(base);
                          return lang === "ru"
                            ? <>{prefix}0 <span className="text-white/40 text-sm">{appliedPromo.months} мес. бесплатно</span></>
                            : <>{prefix}0 <span className="text-white/40 text-sm">{appliedPromo.months} months free</span></>;
                        }
                        let priced = base;
                        if (appliedPromo?.kind === "percent") priced = getDiscountedPrice(base);
                        else if (autoBilling) priced = applyDiscount(base);
                        return <>{priced}<span className="text-white/40 text-sm">{sub}</span></>;
                      })()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  const basePrice = lang === "ru" ? selectedPlanData.priceRu : selectedPlanData.priceEn;
                  const sub = lang === "ru" ? selectedPlanData.subRu : selectedPlanData.subEn;
                  let priceLabel = basePrice;
                  if (appliedPromo?.kind === "percent") priceLabel = getDiscountedPrice(basePrice);
                  else if (appliedPromo?.kind === "free_months") priceLabel = `${parsePrice(basePrice).prefix}0`;
                  else if (autoBilling) priceLabel = applyDiscount(basePrice);
                  purchaseSubscription(selectedPlan, `${priceLabel}${sub}`);
                  setStep("success");
                }}
                className="w-full h-[52px] rounded-2xl text-[hsl(var(--violet-super-dark))] bg-[hsl(var(--violet-mid))] hover:bg-[hsl(var(--violet-light))] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 text-xl font-medium"
              >
                {lang === "ru" ? "Подтвердить оплату" : "Confirm payment"}
              </button>

              {/* Auto-billing terms */}
              {autoBilling && (
                <p ref={billingTermsRef} className="text-sm text-white/40 text-center pt-1 pb-2">
                  {lang === "ru"
                    ? <>Продолжая, вы соглашаетесь на автоматическое списание {applyDiscount(selectedPlanData.priceRu)}/{selectedPlan === "yearly" ? "год" : "мес"} до отмены подписки. <span className="underline hover:text-white/60 cursor-pointer transition-colors">Условия</span> · <span className="underline hover:text-white/60 cursor-pointer transition-colors">Конфиденциальность</span></>
                    : <>By continuing, you agree to automatic billing of {applyDiscount(selectedPlanData.priceEn)}/{selectedPlan === "yearly" ? "year" : "mo"} until subscription is cancelled. <span className="underline hover:text-white/60 cursor-pointer transition-colors">Terms</span> · <span className="underline hover:text-white/60 cursor-pointer transition-colors">Privacy</span></>
                  }
                </p>
              )}
            </div>
          )}
        </div>
      </ResponsiveModal>
    );
};

export default SubscriptionModal;
