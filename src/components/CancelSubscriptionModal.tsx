import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, Check, AlertTriangle, Gift } from "lucide-react";
import PremiumStarIcon from "@/components/icons/PremiumStarIcon";
import { useIsMobile } from "@/hooks/use-mobile";

interface CancelSubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  endDate: string;
  onConfirmCancel: () => void;
}

type Step = "survey" | "confirm" | "offer" | "done";

const CancelSubscriptionModal = ({ open, onOpenChange, endDate, onConfirmCancel }: CancelSubscriptionModalProps) => {
  const { lang } = useLanguage();
  const isMobile = useIsMobile();
  const [step, setStep] = useState<Step>("survey");
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  const reasons = lang === "ru"
    ? [
        "Слишком дорого",
        "Не хватает контента",
        "Нашёл альтернативу",
        "Временно не нужно",
        "Другое",
      ]
    : [
        "Too expensive",
        "Not enough content",
        "Found an alternative",
        "Don't need it right now",
        "Other",
      ];

  const handleClose = (value: boolean) => {
    onOpenChange(value);
    if (!value) {
      setStep("survey");
      setSelectedReason(null);
    }
  };

  const content = (
    <div className="relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[70%] h-[200px] rounded-full bg-[hsl(var(--violet-mid)/0.3)] blur-[80px] pointer-events-none z-0" />
      <div className="overflow-y-auto max-h-[85vh] sm:max-h-[90vh] relative z-[1]">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-6 text-center">
          <button
            onClick={() => handleClose(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative w-20 h-20 mx-auto mb-5 mt-4 flex items-center justify-center">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-16 rounded-full bg-[hsl(var(--violet-super-light)/0.25)] blur-3xl pointer-events-none" />
            <div className="relative">
              {step === "done" ? (
                <Check className="w-14 h-14 text-[hsl(var(--violet-super-light))]" />
              ) : step === "offer" ? (
                <Gift className="w-14 h-14 text-[hsl(var(--violet-super-light))]" />
              ) : (
                <AlertTriangle className="w-14 h-14 text-[hsl(var(--violet-super-light))]" />
              )}
            </div>
          </div>

          <h2 className="text-white leading-[22px] text-2xl sm:text-3xl font-normal">
            {step === "survey" && (lang === "ru" ? "Почему вы уходите?" : "Why are you leaving?")}
            {step === "confirm" && (lang === "ru" ? "Вы уверены?" : "Are you sure?")}
            {step === "offer" && (lang === "ru" ? "Подождите!" : "Wait!")}
            {step === "done" && (lang === "ru" ? "Подписка отменена" : "Subscription cancelled")}
          </h2>
          {step === "offer" && (
            <p className="text-white/50 text-base mt-3">
              {lang === "ru"
                ? "У нас есть для вас специальное предложение"
                : "We have a special offer for you"}
            </p>
          )}
        </div>

        {step === "survey" && (
          <div className="px-5 pb-5 space-y-2.5">
            {reasons.map((reason, i) => (
              <button
                key={i}
                onClick={() => setSelectedReason(reason)}
                className={`w-full text-left rounded-xl px-4 py-3.5 flex items-center gap-3 transition-all ${
                  selectedReason === reason
                    ? "border-2 border-[hsl(var(--violet-light))] bg-white/10"
                    : "border border-[hsl(280_25%_14%)] bg-white/5 hover:border-white/25"
                }`}
              >
                <span className="text-white text-lg font-normal flex-1">{reason}</span>
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                  {selectedReason === reason && (
                    <div className="w-5 h-5 rounded-full bg-[hsl(var(--violet-light))] flex items-center justify-center">
                      <Check className="w-3 h-3 text-[hsl(var(--violet-super-dark))]" />
                    </div>
                  )}
                </div>
              </button>
            ))}

            <div className="pt-3">
              <button
                onClick={() => selectedReason && setStep("confirm")}
                disabled={!selectedReason}
                className="w-full h-[52px] rounded-2xl text-[hsl(var(--violet-super-dark))] bg-[hsl(var(--violet-mid))] hover:bg-[hsl(var(--violet-light))] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 text-xl font-medium disabled:opacity-40 disabled:hover:translate-y-0"
              >
                {lang === "ru" ? "Продолжить" : "Continue"}
              </button>
            </div>
          </div>
        )}

        {step === "confirm" && (
          <div className="px-5 pb-5 space-y-4">
            {/* What you'll lose */}
            <div className="rounded-xl border border-[hsl(280_25%_14%)] bg-white/5 px-5 py-4">
              <p className="text-white/60 text-sm mb-3">
                {lang === "ru" ? "Вы потеряете доступ к:" : "You will lose access to:"}
              </p>
              <div className="space-y-3">
                {(lang === "ru"
                  ? ["Все платные курсы без ограничений", "Закрытые сообщества внутри курсов", "Premium статус в профиле"]
                  : ["All paid courses with no limits", "Private communities inside courses", "Premium profile status"]
                ).map((b, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center flex-shrink-0">
                      <X className="w-3 h-3 text-red-400" strokeWidth={3} />
                    </div>
                    <span className="text-base text-white/70">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-white/50 text-center text-sm">
              {lang === "ru"
                ? `Подписка будет активна до ${endDate}`
                : `Subscription will remain active until ${endDate}`}
            </p>

            <button
              onClick={() => setStep("offer")}
              className="w-full h-[52px] rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-all duration-200 flex items-center justify-center gap-2 text-xl font-medium"
            >
              {lang === "ru" ? "Отменить подписку" : "Cancel subscription"}
            </button>

            <button
              onClick={() => handleClose(false)}
              className="w-full h-[52px] rounded-2xl text-[hsl(var(--violet-super-dark))] bg-[hsl(var(--violet-mid))] hover:bg-[hsl(var(--violet-light))] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 text-xl font-medium"
            >
              {lang === "ru" ? "Оставить подписку" : "Keep subscription"}
            </button>
          </div>
        )}

        {step === "offer" && (
          <div className="px-5 pb-5 space-y-4">
            {/* Free month offer card */}
            <div className="rounded-2xl border border-[hsl(var(--violet-light)/0.4)] bg-gradient-to-br from-[hsl(var(--violet-dark)/0.25)] to-[hsl(var(--violet-mid)/0.1)] px-5 py-6 text-center">
              <div className="inline-flex items-center gap-2 bg-[hsl(var(--violet-mid))] text-[hsl(var(--violet-super-dark))] rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
                <Gift className="w-4 h-4" />
                {lang === "ru" ? "Специальное предложение" : "Special offer"}
              </div>
              <h3 className="text-white text-2xl font-medium mb-2">
                {lang === "ru" ? "1 месяц бесплатно" : "1 month free"}
              </h3>
              <p className="text-white/50 text-base leading-relaxed">
                {lang === "ru"
                  ? "Останьтесь с нами — мы дарим вам бесплатный месяц Premium подписки. Без обязательств."
                  : "Stay with us — we're giving you a free month of Premium subscription. No strings attached."}
              </p>
            </div>

            {/* Accept offer */}
            <button
              onClick={() => handleClose(false)}
              className="w-full h-[52px] rounded-2xl text-[hsl(var(--violet-super-dark))] bg-[hsl(var(--violet-mid))] hover:bg-[hsl(var(--violet-light))] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 text-xl font-medium"
            >
              {lang === "ru" ? "Получить бесплатный месяц" : "Get free month"}
            </button>

            {/* Still cancel */}
            <button
              onClick={() => {
                onConfirmCancel();
                setStep("done");
              }}
              className="w-full h-[44px] rounded-2xl text-white/40 hover:text-white/60 transition-colors flex items-center justify-center text-base font-normal"
            >
              {lang === "ru" ? "Нет, всё равно отменить" : "No, cancel anyway"}
            </button>
          </div>
        )}

        {step === "done" && (
          <div className="px-5 pb-5 space-y-4">
            <div className="rounded-xl border border-[hsl(280_25%_14%)] bg-white/5 px-5 py-4 text-center">
              <p className="text-white/80 text-lg mb-1">
                {lang === "ru" ? "Доступ сохранится до" : "Access remains until"}
              </p>
              <p className="text-white text-2xl font-medium">{endDate}</p>
            </div>

            <p className="text-white/40 text-center text-sm">
              {lang === "ru"
                ? "Вы можете возобновить подписку в любой момент"
                : "You can resubscribe at any time"}
            </p>

            <button
              onClick={() => handleClose(false)}
              className="w-full h-[52px] rounded-2xl text-[hsl(var(--violet-super-dark))] bg-[hsl(var(--violet-mid))] hover:bg-[hsl(var(--violet-light))] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 text-xl font-medium"
            >
              {lang === "ru" ? "Понятно" : "Got it"}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleClose}>
        <DrawerContent className="border-0 rounded-t-3xl max-h-[95vh] bg-gradient-to-b from-[hsl(280_92%_1%)] to-[hsl(280_92%_5%)] overflow-hidden">
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[440px] max-h-[90vh] p-0 gap-0 border-0 rounded-3xl overflow-hidden [&>button.absolute]:hidden bg-gradient-to-b from-[hsl(280_92%_1%)] to-[hsl(280_92%_5%)]">
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default CancelSubscriptionModal;
