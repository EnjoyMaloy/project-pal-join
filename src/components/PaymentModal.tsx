import { useState } from "react";
import mascotSuccess from "@/assets/mascot-success.png";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, Check, CreditCard, ChevronLeft, Bitcoin } from "lucide-react";
import PremiumStarIcon from "@/components/icons/PremiumStarIcon";
import { useNavigate } from "react-router-dom";
import { purchaseCourse, purchaseSubscription } from "@/hooks/usePurchaseStore";

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
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("single");
  const [step, setStep] = useState<Step>("plan");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "crypto">("card");

  const courseTitle = lang === "ru" ? courseTitleRu : courseTitleEn;

  const plans = [
    {
      id: "single" as PlanId,
      titleRu: "Один курс",
      titleEn: "Single course",
      descRu: "Навсегда доступ только к этому курсу",
      descEn: "Lifetime access to this course only",
      priceRu: "₽2,400",
      priceEn: "$29",
    },
    {
      id: "monthly" as PlanId,
      titleRu: "Премиум на месяц",
      titleEn: "Premium Monthly",
      descRu: "Доступ к этому курсу и всем функциям подписки",
      descEn: "Access to this course and all subscription features",
      priceRu: "₽1,200",
      priceEn: "$14",
      subRu: "/мес",
      subEn: "/mo",
    },
    {
      id: "yearly" as PlanId,
      titleRu: "Премиум на год",
      titleEn: "Premium Yearly",
      descRu: "Доступ к этому курсу и всем функциям подписки",
      descEn: "Access to this course and all subscription features",
      priceRu: "₽9,600",
      priceEn: "$99",
      subRu: "/год",
      subEn: "/yr",
      badgeRu: "Скидка 45%",
      badgeEn: "45% off",
    },
  ];

  const selectedPlanData = plans.find((p) => p.id === selectedPlan)!;

  const singleBenefits = lang === "ru"
    ? ["Доступ к курсу навсегда", "Обновления курса", "Закрытое сообщество курса"]
    : ["Lifetime course access", "Course updates", "Private course community"];

  const premiumBenefits = lang === "ru"
    ? [
        "Все платные курсы без ограничений",
        "Доступ в приватные каналы внутри курсов",
        "Premium статус в профиле",
        "AI-генерация — 3 курса в месяц",
      ]
    : [
        "All paid courses with no limits",
        "Access to private channels inside courses",
        "Premium profile status",
        "AI generation — 3 courses per month",
      ];

  const benefits = selectedPlan === "single" ? singleBenefits : premiumBenefits;

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
                ? "Купленный курс добавлен в Мои курсы. Вы получите подтверждение на email."
                : "The purchased course has been added to My Courses. You will receive a confirmation receipt by email."}
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
                {lang === "ru" ? "К курсу" : "Go the course"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[440px] max-h-[90vh] p-0 gap-0 border-0 rounded-3xl shadow-[0_0_120px_40px_hsl(var(--violet-dark)/0.4)] overflow-hidden [&>button.absolute]:hidden bg-gradient-to-b from-[hsl(280_92%_1%)] to-[hsl(280_92%_5%)]">
        {/* Background glow */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[70%] h-[200px] rounded-full bg-[hsl(var(--violet-mid)/0.3)] blur-[80px] pointer-events-none z-0" />
        <div className="overflow-y-auto max-h-[90vh] relative z-[1]">
          {/* Header area */}
          <div className="relative px-6 pt-6 pb-6 text-center">
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

            {/* Icon with soft glow */}
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
                ? (lang === "ru" ? "Получить доступ" : "Get Access")
                : (lang === "ru" ? "Способ оплаты" : "Payment method")
              }
            </h2>
          </div>

          {step === "plan" ? (
            <>
              {/* Course info */}
              <div className="px-5 mb-4">
                <div className="rounded-xl border border-[hsl(280_25%_14%)] bg-[hsl(280_40%_8%)] px-4 py-3 flex items-center gap-3">
                  {courseImage && (
                    <img src={courseImage} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
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
                      className={`w-full text-left rounded-xl px-4 py-3.5 flex items-center justify-between transition-all relative ${
                        isSelected
                          ? "border-2 border-[hsl(var(--violet-light))] bg-white/10"
                          : "border border-[hsl(280_25%_14%)] bg-white/5 hover:border-white/25"
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-white font-normal text-base">{lang === "ru" ? plan.titleRu : plan.titleEn}</p>
                        <p className="text-white/40 text-sm">{lang === "ru" ? plan.descRu : plan.descEn}</p>
                      </div>
                      <div className="flex flex-col items-end flex-shrink-0 ml-3">
                        <div className="flex items-center gap-2 mb-1">
                          {"badgeRu" in plan && (
                            <span className="text-xs font-medium bg-[hsl(var(--violet-mid))] text-[hsl(var(--violet-super-dark))] rounded-full px-2.5 py-0.5 whitespace-nowrap">
                              {lang === "ru" ? plan.badgeRu : plan.badgeEn}
                            </span>
                          )}
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-[hsl(var(--violet-light))] flex items-center justify-center flex-shrink-0">
                              <Check className="w-3 h-3 text-[hsl(var(--violet-super-dark))]" />
                            </div>
                          )}
                        </div>
                        <span className="text-xl font-normal text-white whitespace-nowrap">
                          {lang === "ru" ? plan.priceRu : plan.priceEn}
                          {"subRu" in plan && (
                            <span className="text-white/40 text-sm">{lang === "ru" ? plan.subRu : plan.subEn}</span>
                          )}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Benefits */}
              <div className="px-5 mb-5">
                <div className="rounded-xl border border-[hsl(280_25%_14%)] bg-[hsl(280_40%_8%)] px-5 py-4">
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

              {/* CTA */}
              <div className="px-5 pb-5">
                <button
                  onClick={() => setStep("payment")}
                  className="w-full h-[52px] rounded-2xl text-[hsl(var(--violet-super-dark))] bg-[hsl(var(--violet-mid))] hover:bg-[hsl(var(--violet-light))] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 text-xl font-medium"
                >
                  {lang === "ru" ? "Продолжить" : "Continue"}
                </button>
              </div>

              {/* Footer */}
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
                  <span className="text-white font-normal text-2xl">Cryptocurrency</span>
                  <span className="text-white/40 font-normal text-base">BTC, ETH, USDT, TON</span>
                </button>
              )}

              <div className="rounded-xl bg-white/5 px-4 py-3.5 flex items-center justify-between">
                <span className="text-white/60 text-lg font-normal">
                  {lang === "ru" ? "Итого" : "Total"}
                </span>
                <span className="text-white text-xl font-normal">
                  {lang === "ru" ? selectedPlanData.priceRu : selectedPlanData.priceEn}
                  {"subRu" in selectedPlanData && selectedPlanData.subRu && (
                    <span className="text-white/40 text-sm">{lang === "ru" ? selectedPlanData.subRu : selectedPlanData.subEn}</span>
                  )}
                </span>
              </div>

              <button
                onClick={() => {
                  const priceLabel = lang === "ru" ? selectedPlanData.priceRu : selectedPlanData.priceEn;
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
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
