import { useState, useRef, useEffect } from "react";
import mascotSuccess from "@/assets/mascot-success.png";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, Check, CreditCard, ChevronLeft, Bitcoin, Loader2 } from "lucide-react";
import PremiumStarIcon from "@/components/icons/PremiumStarIcon";
import { useNavigate } from "react-router-dom";
import { purchaseCourse, purchaseSubscription } from "@/hooks/usePurchaseStore";
import { useIsMobile } from "@/hooks/use-mobile";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseTitleRu: string;
  courseTitleEn: string;
  courseId: string;
  courseImage?: string;
  courseDescRu?: string;
  courseDescEn?: string;
}

type PlanId = "single" | "monthly" | "yearly";
type Step = "plan" | "payment" | "success";

const PaymentModal = ({ open, onOpenChange, courseTitleRu, courseTitleEn, courseId, courseImage, courseDescRu, courseDescEn }: PaymentModalProps) => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("single");
  const [step, setStep] = useState<Step>("plan");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "crypto">("card");
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [autoBilling, setAutoBilling] = useState(false);
  const billingTermsRef = useRef<HTMLParagraphElement>(null);
  const [showTestCodes, setShowTestCodes] = useState(false);

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
  const PROMO_DB: Record<string, { type: "percent" | "free_months"; value: number; plan_restriction?: PlanId; excluded_plans?: PlanId[]; state?: "expired" | "limit" | "used" }> = {
    COURSE99: { type: "percent", value: 99, excluded_plans: ["single"] },

    TEST50: { type: "percent", value: 50, plan_restriction: "monthly" },
    TEST50Y: { type: "percent", value: 50, plan_restriction: "yearly" },
    SINGLE50: { type: "percent", value: 50, plan_restriction: "single" },
    FRIEND3M: { type: "free_months", value: 3 },
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
    // free_months not applicable to single (one-time purchase)
    if (entry.type === "free_months" && plan === "single") {
      return { ok: false, error: { code: "wrong_plan", requiredPlan: "monthly" } };
    }
    if (entry.excluded_plans?.includes(plan)) {
      // Suggest a plan that's allowed
      const fallback = (["monthly", "yearly", "single"] as PlanId[]).find(p => !entry.excluded_plans!.includes(p));
      return { ok: false, error: { code: "wrong_plan", requiredPlan: fallback } };
    }
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
      if (result.ok === true) { setAppliedPromo(result.promo); setPromoError(null); }
      else if (result.ok === false) { setAppliedPromo(null); setPromoError(result.error); }
      setPromoLoading(false);
    }, 400);
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
    if (result.ok === true) { setAppliedPromo(result.promo); setPromoError(null); }
    else if (result.ok === false) { setAppliedPromo(null); setPromoError(result.error); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlan]);

  const parsePrice = (price: string) => {
    const num = parseFloat(price.replace(/[^0-9.]/g, "").replace(",", ""));
    const prefix = price.match(/^[₽$]/)?.[0] || "";
    return { num, prefix };
  };
  const formatPrice = (num: number, prefix: string) => {
    const rounded = Math.round(num * 100) / 100;
    return `${prefix}${rounded % 1 === 0 ? rounded.toLocaleString("en-US") : rounded.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  };
  const applyPromoToPrice = (price: string) => {
    if (!appliedPromo) return price;
    if (appliedPromo.kind === "percent") {
      const { num, prefix } = parsePrice(price);
      return formatPrice(num * (1 - appliedPromo.percent / 100), prefix);
    }
    if (appliedPromo.kind === "free_months") {
      const { prefix } = parsePrice(price);
      return `${prefix}0`;
    }
    return price;
  };

  useEffect(() => {
    if (autoBilling) {
      setTimeout(() => billingTermsRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 100);
    }
  }, [autoBilling]);

  const courseTitle = lang === "ru" ? courseTitleRu : courseTitleEn;

  const plans = [
    {
      id: "single" as PlanId,
      titleRu: "Один курс",
      titleEn: "Single course",
      descRu: "",
      descEn: "",
      priceRu: "₽2,400",
      priceEn: "$29",
    },
    {
      id: "monthly" as PlanId,
      titleRu: "Премиум на месяц",
      titleEn: "Premium Monthly",
      descRu: "",
      descEn: "",
      priceRu: "₽1,200",
      priceEn: "$14",
      subRu: "/мес",
      subEn: "/mo",
    },
    {
      id: "yearly" as PlanId,
      titleRu: "Премиум на год",
      titleEn: "Premium Yearly",
      descRu: "",
      descEn: "",
      priceRu: "₽9,600",
      priceEn: "$99",
      subRu: "/год",
      subEn: "/yr",
      badgeRu: "-₽4,800",
      badgeEn: "-$69",
      oldPriceRu: "₽14,400",
      oldPriceEn: "$168",
    },
  ];

  const selectedPlanData = plans.find((p) => p.id === selectedPlan)!;

  const applyDiscount = (price: string) => {
    const num = parseFloat(price.replace(/[^0-9.]/g, "").replace(",", ""));
    const discounted = Math.round(num * 0.9 * 100) / 100;
    const prefix = price.match(/^[₽$]/)?.[0] || "";
    return `${prefix}${discounted % 1 === 0 ? discounted.toLocaleString("en-US") : discounted.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  };

  const singleBenefits = lang === "ru"
    ? ["Доступ к этому курсу навсегда", "Пожизненные обновления", "Закрытое сообщество курса (если есть)"]
    : ["Lifetime access to this course", "Lifetime updates", "Private course community (if available)"];

  const premiumBenefits = lang === "ru"
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

  const benefits = selectedPlan === "single" ? singleBenefits : premiumBenefits;

  const handleClose = (value: boolean) => {
    onOpenChange(value);
    if (!value) {
      setStep("plan");
      setAutoBilling(false);
      setAppliedPromo(null);
      setPromoError(null);
      setPromoInput("");
      setShowTestCodes(false);
    }
  };

  // Success content
  const successContent = (
    <div className="px-6 sm:px-8 py-8 sm:py-12 flex flex-col items-center text-center bg-white">
      <h2 className="text-[24px] sm:text-[28px] font-medium text-[#232323] leading-[90%] mb-4">
        {lang === "ru" ? "Спасибо!" : "Thank you!"}
      </h2>
      <h2 className="text-[24px] sm:text-[28px] font-medium text-[#232323] leading-[90%] mb-6 sm:mb-9">
        {lang === "ru" ? "Оплата получена" : "Your payment has been received"}
      </h2>
      <p className="text-[16px] sm:text-[18px] text-[#8D8D8D] leading-[120%] max-w-[502px] mb-8 sm:mb-12">
        {lang === "ru"
          ? "Купленный курс добавлен в Мои курсы. Вы получите подтверждение на email."
          : "The purchased course has been added to My Courses. You will receive a confirmation receipt by email."}
      </p>
      <img src={mascotSuccess} alt="" className="w-[200px] sm:w-[300px] mb-8 sm:mb-10" />
      {selectedPlan === "single" ? (
        <div className="flex items-center gap-3 w-full max-w-[492px]">
          <Button
            variant="outline"
            className="flex-1 h-12 rounded-lg text-[18px] sm:text-[20px] font-medium bg-[#F7F7F8] border-0 text-[#232323] hover:bg-[#EBE9EA]"
            onClick={() => {
              handleClose(false);
              navigate("/catalog");
            }}
          >
            {lang === "ru" ? "В каталог" : "Back to Catalog"}
          </Button>
          <Button
            className="flex-1 h-12 rounded-lg text-[18px] sm:text-[20px] font-medium bg-[#232323] hover:bg-[#464646] text-white"
            onClick={() => handleClose(false)}
          >
            {lang === "ru" ? "К курсу" : "Go to course"}
          </Button>
        </div>
      ) : (
        <Button
          className="w-full max-w-[492px] h-12 rounded-lg text-[18px] sm:text-[20px] font-medium bg-[#232323] hover:bg-[#464646] text-white"
          onClick={() => {
            handleClose(false);
            navigate("/catalog");
          }}
        >
          {lang === "ru" ? "В каталог" : "Go to Catalog"}
        </Button>
      )}
    </div>
  );

  // Main modal content (plan + payment steps)
  const mainContent = (
    <div className="relative w-full max-w-full overflow-x-hidden">
      {/* Background glow */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[70%] h-[200px] rounded-full bg-[hsl(var(--violet-mid)/0.3)] blur-[80px] pointer-events-none z-0" />

      {/* Close button - fixed over content */}
      <button
        onClick={() => handleClose(false)}
        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors z-30"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Test promo codes toggle */}
      <button
        onClick={() => setShowTestCodes((v) => !v)}
        className="absolute top-4 right-14 h-8 px-2.5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-mono font-semibold text-white/70 hover:text-white hover:bg-white/20 transition-colors z-30 tracking-wider"
        aria-label="Test promo codes"
        title={lang === "ru" ? "Тестовые промокоды" : "Test promo codes"}
      >
        TEST
      </button>

      {/* Test promo codes panel */}
      {showTestCodes && (
        <div className="absolute top-14 right-4 z-40 w-[300px] rounded-xl border border-white/10 bg-[hsl(280_30%_10%)] shadow-2xl p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] uppercase tracking-wider text-white/50 font-medium">
              {lang === "ru" ? "Тестовые промокоды" : "Test promo codes"}
            </p>
            <button
              onClick={() => setShowTestCodes(false)}
              className="text-white/40 hover:text-white/80 transition-colors"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-2">
            {[
              { code: "COURSE99", desc: lang === "ru" ? "Скидка 99% ТОЛЬКО на подписку (месяц или год). На «Один курс» — ошибка «не подходит для этого тарифа», предлагается переключиться на месячный/годовой. Логика: цена = base × 0.01." : "99% off SUBSCRIPTION only (monthly or yearly). On «Single course» — error «not for this plan», suggests switching to monthly/yearly. Logic: price = base × 0.01." },
              
              { code: "SINGLE50", desc: lang === "ru" ? "Скидка 50% ТОЛЬКО на «Один курс». На месячном/годовом — ошибка «не подходит для этого тарифа»." : "50% off SINGLE course only. On monthly/yearly — error «not for this plan»." },
              { code: "TEST50", desc: lang === "ru" ? "Скидка 50% ТОЛЬКО на месячный план. Иначе — ошибка." : "50% off MONTHLY only. Otherwise — error." },
              { code: "TEST50Y", desc: lang === "ru" ? "Скидка 50% ТОЛЬКО на годовой план. Иначе — ошибка." : "50% off YEARLY only. Otherwise — error." },
              { code: "FRIEND3M", desc: lang === "ru" ? "3 месяца бесплатно. Работает только для месячного/годового плана. На «Один курс» — ошибка. В «Итого» — 0 ₽." : "3 months free. Works for monthly/yearly only. On single — error. Total shows 0." },
            ].map((t) => (
              <button
                key={t.code}
                onClick={() => { setPromoInput(t.code); setShowTestCodes(false); }}
                className="w-full text-left flex items-start gap-2 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                <span className="inline-block rounded-md bg-[hsl(261,100%,93%)] px-1.5 py-0.5 text-[11px] font-mono text-[hsl(280,92%,21%)] whitespace-nowrap mt-0.5">{t.code}</span>
                <span className="text-[11px] text-white/60 leading-[140%]">{t.desc}</span>
              </button>
            ))}
          </div>
          <p className="text-[10px] text-white/30 mt-2 px-1.5">
            {lang === "ru" ? "Кликни код — он подставится в поле промо." : "Click a code to fill the promo input."}
          </p>
        </div>
      )}

      {/* Back button - fixed over content */}
      {step === "payment" && (
        <button
          onClick={() => setStep("plan")}
          className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors z-30"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      <div className="relative z-[1] max-h-[85vh] overflow-x-hidden overflow-y-auto sm:max-h-[90vh]">
        {/* Header area */}
        <div className="relative px-6 pt-6 pb-6 text-center">


          {/* Icon with soft glow */}
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
              ? (lang === "ru" ? "Открыть доступ" : "Get Access")
              : (lang === "ru" ? "Способ оплаты" : "Payment method")
            }
          </h2>
          {step === "plan" && (
            <p className="text-white/50 text-sm mt-3 max-w-[320px] mx-auto leading-[140%]">
              {lang === "ru"
                ? "Ты прошёл бесплатную часть курса. Приобрети курс целиком или оформи подписку"
                : "You've completed the free part. Purchase the full course or subscribe"}
            </p>
          )}
        </div>

        {step === "plan" ? (
          <>
            {/* Course info */}
            <div className="px-5 mb-4">
              <div className="relative rounded-xl bg-gradient-to-r from-white/10 to-white/[0.02] px-4 py-3 flex items-center gap-3 before:absolute before:inset-0 before:rounded-xl before:p-[2px] before:bg-gradient-to-r before:from-[hsl(var(--violet-mid)/0.35)] before:via-[hsl(var(--violet-dark)/0.15)] before:to-[hsl(var(--violet-light)/0.25)] before:-z-[1] before:content-[''] after:absolute after:inset-[2px] after:rounded-[10px] after:bg-gradient-to-r after:from-[hsl(280_92%_1.5%)] after:to-[hsl(280_92%_3%)] after:-z-[1] after:content-['']">
                {courseImage && (
                  <img src={courseImage} alt="" className="w-14 h-10 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-white/90 text-base font-normal truncate">{courseTitle}</p>
                  {(courseDescRu || courseDescEn) && (
                    <p className="text-white/40 text-sm truncate">
                      {lang === "ru" ? courseDescRu : courseDescEn}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Plan selection */}
            <div className="px-5 mb-4 space-y-2.5">
              {plans.map((plan) => {
                const isSelected = selectedPlan === plan.id;
                return (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`w-full text-left rounded-xl px-4 py-3.5 flex items-center gap-3 transition-all relative overflow-hidden ${
                      isSelected
                        ? "border-2 border-[hsl(var(--violet-light))] bg-white/10"
                        : "border border-[hsl(280_25%_14%)] bg-white/5 hover:border-white/25"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-lg font-normal">{lang === "ru" ? plan.titleRu : plan.titleEn}</p>
                    </div>
                    <div className="flex flex-col items-end flex-shrink-0">
                      {"badgeRu" in plan && (
                        <span className="text-xs bg-[hsl(var(--violet-mid))] text-[hsl(var(--violet-super-dark))] rounded-full px-2.5 py-0.5 whitespace-nowrap font-semibold mb-1">
                          {lang === "ru" ? plan.badgeRu : plan.badgeEn}
                        </span>
                      )}
                      <div className="flex items-baseline gap-2">
                        {"oldPriceRu" in plan && plan.oldPriceRu && (
                          <span className="text-white/30 text-sm line-through">
                            {lang === "ru" ? plan.oldPriceRu : plan.oldPriceEn}
                          </span>
                        )}
                        <span className="text-xl font-normal text-white whitespace-nowrap">
                          {lang === "ru" ? plan.priceRu : plan.priceEn}
                          {"subRu" in plan && (
                            <span className="text-white/40 text-sm">{lang === "ru" ? plan.subRu : plan.subEn}</span>
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[hsl(var(--violet-light))] flex items-center justify-center">
                          <Check className="w-3 h-3 text-[hsl(var(--violet-super-dark))]" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Benefits */}
            <div className="px-5 mb-5">
              <div className="rounded-xl border border-[hsl(280_25%_14%)] bg-white/5 px-5 py-4">
                <div className="space-y-3">
                  {benefits.map((b, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[hsl(var(--violet-dark)/0.4)] to-[hsl(var(--violet-dark)/0.2)] border border-[hsl(var(--violet-light)/0.6)] flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 text-[#E8DCFB]" strokeWidth={3} />
                      </div>
                      <span className="text-base text-white/80">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA - sticky on mobile */}
            <div className="sticky bottom-0 z-10 px-5 pb-4 pt-3 bg-gradient-to-t from-[hsl(280_92%_3%)] via-[hsl(280_92%_3%)] to-transparent">
              <button
                onClick={() => setStep("payment")}
                className="w-full h-[52px] rounded-2xl text-[hsl(var(--violet-super-dark))] bg-[hsl(var(--violet-mid))] hover:bg-[hsl(var(--violet-light))] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 text-xl font-medium"
              >
                {lang === "ru" ? "Продолжить" : "Continue"}
              </button>
              <div className="flex items-center justify-center gap-3 pt-3 pb-1 text-sm text-white/40">
                <span className="underline hover:text-white/60 cursor-pointer transition-colors">
                  {lang === "ru" ? "Условия" : "Terms"}
                </span>
                <span>·</span>
                <span className="underline hover:text-white/60 cursor-pointer transition-colors">
                  {lang === "ru" ? "Конфиденциальность" : "Privacy"}
                </span>
              </div>
            </div>
          </>
        ) : (
          /* Payment step */
          <div className="px-5 pt-6 pb-4 space-y-3">
            {(() => { return null; })()}
            <button
              disabled={appliedPromo?.kind === "free_months"}
              className={`w-full rounded-xl px-5 py-5 flex flex-col items-center gap-2 transition-all ${
                appliedPromo?.kind === "free_months"
                  ? "border border-white/10 bg-white/[0.03] opacity-50 cursor-not-allowed"
                  : paymentMethod === "card"
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
                disabled={appliedPromo?.kind === "free_months"}
                className={`w-full rounded-xl px-5 py-5 flex flex-col items-center gap-2 transition-all ${
                  appliedPromo?.kind === "free_months"
                    ? "border border-white/10 bg-white/[0.03] opacity-50 cursor-not-allowed"
                    : paymentMethod === "crypto"
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

            {/* Auto-billing discount checkbox — only for card, hidden when free_months */}
            {paymentMethod === "card" && (selectedPlan === "monthly" || selectedPlan === "yearly") && appliedPromo?.kind !== "free_months" && (
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


            {/* Promo code input */}
            <div>
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
                    <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-lg bg-[hsl(140_45%_92%)] px-2 py-1 text-[11px] font-medium text-[hsl(140_70%_20%)]">
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
                      ? `Этот код работает только для тарифа «${promoError.requiredPlan === "yearly" ? "На год" : promoError.requiredPlan === "monthly" ? "На месяц" : "Один курс"}»`
                      : `This code works for ${promoError.requiredPlan === "yearly" ? "Yearly" : promoError.requiredPlan === "monthly" ? "Monthly" : "Single course"} only`
                  )}
                </p>
              )}
            </div>

            <div className="rounded-xl bg-white/5 px-4 py-3.5 flex items-center justify-between">
              <span className="text-white/60 text-lg font-normal">
                {lang === "ru" ? "Итого" : "Total"}
              </span>
              <div className="flex items-baseline gap-2">
                {(() => {
                  const basePrice = lang === "ru" ? selectedPlanData.priceRu : selectedPlanData.priceEn;
                  const afterAuto = autoBilling && (selectedPlan === "monthly" || selectedPlan === "yearly")
                    ? applyDiscount(basePrice)
                    : basePrice;
                  const finalPrice = applyPromoToPrice(afterAuto);
                  const showStrike = appliedPromo || (autoBilling && (selectedPlan === "monthly" || selectedPlan === "yearly"));
                  return (
                    <>
                      {showStrike && finalPrice !== basePrice && (
                        <span className="text-white/30 text-sm line-through">{basePrice}</span>
                      )}
                      <span className="text-white text-xl font-normal">{finalPrice}</span>
                    </>
                  );
                })()}
              </div>
            </div>

            {appliedPromo?.kind === "free_months" && (
              <p className="text-center text-xs text-white/50 -mt-1">
                {lang === "ru" ? `${appliedPromo.months} мес бесплатно` : `${appliedPromo.months} months free`}
              </p>
            )}

            <button
              onClick={() => {
                const basePrice = lang === "ru" ? selectedPlanData.priceRu : selectedPlanData.priceEn;
                const afterAuto = autoBilling && selectedPlan !== "single" ? applyDiscount(basePrice) : basePrice;
                const priceLabel = applyPromoToPrice(afterAuto);
                if (selectedPlan === "single") {
                  purchaseCourse(courseId, courseTitleRu, courseTitleEn, priceLabel);
                } else {
                  purchaseSubscription(selectedPlan, priceLabel);
                }
                setStep("success");
              }}
              className="w-full h-[52px] rounded-2xl text-[hsl(var(--violet-super-dark))] bg-[hsl(var(--violet-mid))] hover:bg-[hsl(var(--violet-light))] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 text-xl font-medium"
            >
              {appliedPromo?.kind === "free_months"
                ? (lang === "ru"
                    ? `Активировать ${appliedPromo.months} мес. бесплатно`
                    : `Activate ${appliedPromo.months} months free`)
                : (lang === "ru" ? "Подтвердить оплату" : "Confirm payment")}
            </button>


            {/* Auto-billing terms */}
            {autoBilling && (selectedPlan === "monthly" || selectedPlan === "yearly") && (
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
    </div>
  );

  // Success screen
  if (step === "success") {
    if (isMobile) {
      return (
        <Drawer open={open} onOpenChange={handleClose}>
          <DrawerContent hideHandle className="border-0 rounded-t-2xl max-h-[95vh] bg-white">
            <div className="mx-auto mt-3 mb-0 h-1 w-12 rounded-full bg-[#EBE9EA] flex-shrink-0" />
            <div className="overflow-y-auto max-h-[90vh]">
              {successContent}
            </div>
          </DrawerContent>
        </Drawer>
      );
    }
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[576px] max-h-[90vh] p-0 gap-0 overflow-y-auto border-0 rounded-2xl [&>button.absolute]:hidden bg-white">
          {successContent}
        </DialogContent>
      </Dialog>
    );
  }

  // Main modal
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleClose}>
        <DrawerContent hideHandle className="border-0 rounded-t-3xl max-h-[95vh] bg-gradient-to-b from-[hsl(280_92%_1%)] to-[hsl(280_92%_5%)] overflow-hidden flex flex-col">
          {/* Custom handle */}
          <div className="mx-auto mt-3 mb-0 h-1 w-12 rounded-full bg-white/20 flex-shrink-0" />
          <div className="overflow-y-auto flex-1 relative">
            {mainContent}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100vw-32px)] max-w-[440px] max-h-[90vh] p-0 gap-0 border-0 rounded-3xl overflow-hidden [&>button.absolute]:hidden bg-gradient-to-b from-[hsl(280_92%_1%)] to-[hsl(280_92%_5%)]">
        {mainContent}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
