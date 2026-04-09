import { useState } from "react";
import mascotSuccess from "@/assets/mascot-success.png";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, Sparkles, Zap, Check, Crown, CreditCard, ChevronLeft, Bitcoin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { purchaseCourse, purchaseSubscription } from "@/hooks/usePurchaseStore";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseTitleRu: string;
  courseTitleEn: string;
  courseId: string;
}

type PlanId = "single" | "monthly" | "yearly";
type Step = "plan" | "payment" | "success";

const PaymentModal = ({ open, onOpenChange, courseTitleRu, courseTitleEn, courseId }: PaymentModalProps) => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("single");
  const [step, setStep] = useState<Step>("plan");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "crypto">("card");

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

  const selectedPlanData = plans.find((p) => p.id === selectedPlan)!;

  const benefits = lang === "ru"
    ? ["Навсегда доступ", "Все материалы курса", "Сертификат о завершении"]
    : ["Lifetime access", "All course materials", "Certificate of completion"];

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

            {/* Mascot illustration */}
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
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] p-0 gap-0 overflow-y-auto border-0 rounded-2xl [&>button.absolute]:hidden">
        {/* Header */}
        <div className="bg-gradient-to-b from-[hsl(var(--primary))] to-[hsl(var(--primary)/0.8)] px-5 pt-6 pb-4 text-center relative">
          {step === "payment" && (
            <button
              onClick={() => setStep("plan")}
              className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-primary-foreground hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => handleClose(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-primary-foreground hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
            {step === "plan" ? (
              <Crown className="w-5 h-5 text-primary-foreground" />
            ) : (
              <CreditCard className="w-5 h-5 text-primary-foreground" />
            )}
          </div>
          <h2 className="text-[18px] font-bold text-primary-foreground mb-0.5">
            {step === "plan"
              ? (lang === "ru" ? "Получить доступ" : "Get Access")
              : (lang === "ru" ? "Выберите способ оплаты" : "Choose payment method")
            }
          </h2>
          <p className="text-[13px] text-primary-foreground/80">
            {step === "plan"
              ? (lang === "ru" ? "Выберите, как вы хотите получить доступ к курсу" : "Choose how you want to access the course")
              : (lang === "ru" ? "Выберите, как вы хотите оплатить" : "Choose how you want to pay")
            }
          </p>
        </div>

        {step === "plan" ? (
          <div className="px-5 py-4 space-y-2.5">
            <div className="border border-border rounded-xl px-4 py-2.5 text-center">
              <span className="text-[14px] font-medium text-foreground">{courseTitle}</span>
            </div>

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
                    <span className="text-[11px] font-semibold bg-[hsl(var(--success))] text-white rounded px-2 py-0.5 mb-1">
                      {plan.badge}
                    </span>
                  )}
                  <span className="text-[16px] font-bold text-foreground whitespace-nowrap">
                    {lang === "ru" ? plan.priceRu : plan.priceEn}
                  </span>
                </div>
              </button>
            ))}

            <div className="bg-muted/50 rounded-xl px-4 py-3 space-y-2">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-[14px] text-foreground">{b}</span>
                </div>
              ))}
            </div>

            <Button
              className="w-full h-11 rounded-xl text-[15px] font-semibold gap-2"
              onClick={() => setStep("payment")}
            >
              <Zap className="w-4 h-4" />
              {lang === "ru" ? "Продолжить" : "Continue"}
            </Button>
          </div>
        ) : (
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
                <Bitcoin className="w-6 h-6 text-primary" />
                <span className="text-[15px] font-semibold text-foreground">Cryptocurrency</span>
                <span className="text-[13px] text-muted-foreground">BTC, ETH, USDT, TON</span>
              </button>
            )}

            <div className="bg-muted/50 rounded-xl px-4 py-3.5 flex items-center justify-between">
              <span className="text-[15px] text-foreground">
                {lang === "ru" ? "Итого" : "Total"}
              </span>
              <span className="text-[18px] font-bold text-foreground">
                {lang === "ru" ? selectedPlanData.priceRu : selectedPlanData.priceEn}
              </span>
            </div>

            <Button
              className="w-full h-11 rounded-xl text-[15px] font-semibold gap-2"
              onClick={() => {
                const priceLabel = lang === "ru" ? selectedPlanData.priceRu : selectedPlanData.priceEn;
                if (selectedPlan === "single") {
                  purchaseCourse(courseId, courseTitleRu, courseTitleEn, priceLabel);
                } else {
                  purchaseSubscription(selectedPlan, priceLabel);
                }
                setStep("success");
              }}
            >
              <Zap className="w-4 h-4" />
              {lang === "ru" ? "Подтвердить оплату" : "Confirm payment"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
