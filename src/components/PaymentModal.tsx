import { useState } from "react";
import mascotSuccess from "@/assets/mascot-success.png";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, Check, CreditCard, ChevronLeft, Bitcoin } from "lucide-react";
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
    if (!value) setStep("plan");
  };

  // Success content
  const successContent = (
    <div className="px-6 sm:px-8 py-8 sm:py-12 flex flex-col items-center text-center">
      <h2 className="text-[24px] sm:text-[28px] font-medium text-foreground leading-[90%] mb-4">
        {lang === "ru" ? "Спасибо!" : "Thank you!"}
      </h2>
      <h2 className="text-[24px] sm:text-[28px] font-medium text-foreground leading-[90%] mb-6 sm:mb-9">
        {lang === "ru" ? "Оплата получена" : "Your payment has been received"}
      </h2>
      <p className="text-[16px] sm:text-[18px] text-muted-foreground leading-[120%] max-w-[502px] mb-8 sm:mb-12">
        {lang === "ru"
          ? "Купленный курс добавлен в Мои курсы. Вы получите подтверждение на email."
          : "The purchased course has been added to My Courses. You will receive a confirmation receipt by email."}
      </p>
      <img src={mascotSuccess} alt="" className="w-[200px] sm:w-[300px] mb-8 sm:mb-10" />
      {selectedPlan === "single" ? (
        <div className="flex items-center gap-3 w-full max-w-[492px]">
          <Button
            variant="outline"
            className="flex-1 h-12 rounded-lg text-[18px] sm:text-[20px] font-medium bg-[hsl(var(--muted))] border-0 text-foreground hover:bg-[hsl(var(--muted)/0.8)]"
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
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[180%] h-24 rounded-full bg-[hsl(var(--violet-super-light)/0.1)] blur-[90px] pointer-events-none" />
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
              ? (lang === "ru" ? "Открыть доступ" : "Get Access")
              : (lang === "ru" ? "Способ оплаты" : "Payment method")
            }
          </h2>
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
                        <Check className="w-3.5 h-3.5 text-[hsl(var(--violet-super-light))]" strokeWidth={3} />
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
                <span className="text-white font-normal text-2xl">Cryptocurrency</span>
                <span className="text-white/40 font-normal text-base">BTC, ETH, USDT, TON</span>
              </button>
            )}

            {/* Auto-billing discount checkbox */}
            {(selectedPlan === "monthly" || selectedPlan === "yearly") && (
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

            <div className="rounded-xl bg-white/5 px-4 py-3.5 flex items-center justify-between">
              <span className="text-white/60 text-lg font-normal">
                {lang === "ru" ? "Итого" : "Total"}
              </span>
              <div className="flex items-baseline gap-2">
                {autoBilling && (selectedPlan === "monthly" || selectedPlan === "yearly") && (
                  <span className="text-white/30 text-sm line-through">
                    {lang === "ru" ? selectedPlanData.priceRu : selectedPlanData.priceEn}
                  </span>
                )}
                <span className="text-white text-xl font-normal">
                  {autoBilling && (selectedPlan === "monthly" || selectedPlan === "yearly")
                    ? applyDiscount(lang === "ru" ? selectedPlanData.priceRu : selectedPlanData.priceEn)
                    : (lang === "ru" ? selectedPlanData.priceRu : selectedPlanData.priceEn)
                  }
                  {"subRu" in selectedPlanData && selectedPlanData.subRu && (
                    <span className="text-white/40 text-sm">{lang === "ru" ? selectedPlanData.subRu : selectedPlanData.subEn}</span>
                  )}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                const basePrice = lang === "ru" ? selectedPlanData.priceRu : selectedPlanData.priceEn;
                const priceLabel = autoBilling && selectedPlan !== "single" ? applyDiscount(basePrice) : basePrice;
                if (selectedPlan === "single") {
                  purchaseCourse(courseId, courseTitleRu, courseTitleEn, priceLabel);
                } else {
                  purchaseSubscription(selectedPlan, priceLabel);
                }
                setStep("success");
              }}
              className="w-full h-[52px] rounded-2xl text-[hsl(var(--violet-super-dark))] bg-[hsl(var(--violet-mid))] hover:bg-[hsl(var(--violet-light))] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 text-xl font-medium"
            >
              {lang === "ru" ? "Подтвердить оплату" : "Confirm payment"}
            </button>

            {/* Auto-billing terms */}
            {autoBilling && (selectedPlan === "monthly" || selectedPlan === "yearly") && (
              <p className="text-sm text-white/40 text-center pt-1 pb-2">
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
          <DrawerContent hideHandle className="border-0 rounded-t-2xl max-h-[95vh]">
            <div className="mx-auto mt-3 mb-0 h-1 w-12 rounded-full bg-border flex-shrink-0" />
            <div className="overflow-y-auto max-h-[90vh]">
              {successContent}
            </div>
          </DrawerContent>
        </Drawer>
      );
    }
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[576px] max-h-[90vh] p-0 gap-0 overflow-y-auto border-0 rounded-2xl [&>button.absolute]:hidden">
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
