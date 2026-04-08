import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, Sparkles, Zap, Check, Crown, CreditCard, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { purchaseCourse, purchaseSubscription } from "@/hooks/usePurchaseStore";
import { toast } from "sonner";

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
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            ) : (
              <Crown className="w-5 h-5 text-primary-foreground" />
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
          /* Plan selection */
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
          /* Payment method selection */
          <div className="px-5 py-5 space-y-4">
            {/* Bank card option */}
            <button
              className="w-full border-2 border-primary rounded-xl px-5 py-5 flex flex-col items-center gap-2 bg-primary/5 transition-all"
            >
              <CreditCard className="w-6 h-6 text-primary" />
              <span className="text-[15px] font-semibold text-foreground">
                {lang === "ru" ? "Банковская карта" : "Bank card"}
              </span>
              <span className="text-[13px] text-muted-foreground">Visa, Mastercard, Maestro</span>
            </button>

            {/* Total */}
            <div className="bg-muted/50 rounded-xl px-4 py-3.5 flex items-center justify-between">
              <span className="text-[15px] text-foreground">
                {lang === "ru" ? "Итого" : "Total"}
              </span>
              <span className="text-[18px] font-bold text-foreground">
                {lang === "ru" ? selectedPlanData.priceRu : selectedPlanData.priceEn}
              </span>
            </div>

            {/* Confirm */}
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
        ) : (
          /* Success screen */
          <div className="px-5 py-10 flex flex-col items-center text-center">
            {/* Title */}
            <h2 className="text-[28px] font-medium text-foreground leading-[90%] mb-4">
              {lang === "ru" ? "Спасибо!" : "Thank you!"}
            </h2>
            <h2 className="text-[28px] font-medium text-foreground leading-[90%] mb-9">
              {lang === "ru" ? "Оплата получена" : "Your payment has been received"}
            </h2>
            <p className="text-[18px] text-[hsl(var(--muted-foreground))] leading-[100%] max-w-[502px] mb-12">
              {lang === "ru"
                ? "Купленный курс добавлен в Мои курсы. Вы получите подтверждение на email."
                : "The purchased course has been added to My Courses. You will receive a confirmation receipt by email."}
            </p>

            {/* Mascot illustration */}
            <div className="relative w-[300px] h-[270px] mb-10">
              {/* Green circle */}
              <div
                className="absolute rounded-full"
                style={{
                  width: 175,
                  height: 175,
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%) rotate(16deg)",
                  background: "#C5F700",
                }}
              />
              {/* Decorative lines */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 270" fill="none">
                {/* Sparkle top-left */}
                <path d="M90 60 L95 45 L100 60 L95 75 Z" stroke="#000" strokeWidth="2" fill="none" />
                {/* Lines top-right */}
                <line x1="200" y1="50" x2="230" y2="30" stroke="#000" strokeWidth="2" />
                <line x1="210" y1="40" x2="240" y2="55" stroke="#000" strokeWidth="2" />
                <line x1="220" y1="60" x2="245" y2="75" stroke="#000" strokeWidth="2" />
                {/* Hands left */}
                <path d="M40 120 Q30 100 50 90 Q60 85 70 95 L85 115" stroke="#000" strokeWidth="2" fill="none" />
                <path d="M50 95 Q45 88 55 82" stroke="#000" strokeWidth="2" fill="none" />
                <path d="M60 90 Q58 82 65 78" stroke="#000" strokeWidth="2" fill="none" />
                {/* Hands right */}
                <path d="M260 120 Q270 100 250 90 Q240 85 230 95 L215 115" stroke="#000" strokeWidth="2" fill="none" />
                <path d="M250 95 Q255 88 245 82" stroke="#000" strokeWidth="2" fill="none" />
                <path d="M240 90 Q242 82 235 78" stroke="#000" strokeWidth="2" fill="none" />
                {/* Face */}
                <path d="M130 130 Q125 122 135 120" stroke="#000" strokeWidth="2" fill="none" />
                <path d="M170 130 Q175 122 165 120" stroke="#000" strokeWidth="2" fill="none" />
                <path d="M135 148 Q150 158 165 148" stroke="#000" strokeWidth="2" fill="none" />
                {/* Coins bottom-right */}
                <ellipse cx="240" cy="220" rx="12" ry="8" stroke="#000" strokeWidth="2" fill="none" />
                <ellipse cx="250" cy="235" rx="10" ry="6" stroke="#000" strokeWidth="2" fill="none" />
                {/* Feet */}
                <path d="M110 220 Q100 240 115 250 Q130 255 135 240" stroke="#000" strokeWidth="2" fill="none" />
                <path d="M190 220 Q200 240 185 250 Q170 255 165 240" stroke="#000" strokeWidth="2" fill="none" />
              </svg>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 w-full">
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-lg text-[16px] font-medium bg-[hsl(var(--muted))] border-0 text-foreground hover:bg-[hsl(var(--muted)/0.8)]"
                onClick={() => {
                  handleClose(false);
                  navigate("/catalog");
                }}
              >
                {lang === "ru" ? "В каталог" : "Back to Catalog"}
              </Button>
              <Button
                className="flex-1 h-12 rounded-lg text-[16px] font-medium bg-[#232323] hover:bg-[#464646] text-white"
                onClick={() => {
                  handleClose(false);
                }}
              >
                {lang === "ru" ? "К курсу" : "Go the course"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
