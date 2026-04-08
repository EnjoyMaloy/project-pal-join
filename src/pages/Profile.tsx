import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupaUser } from "@supabase/supabase-js";
import { useLanguage } from "@/contexts/LanguageContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Mail,
  Send,
  Wallet,
  Crown,
  LogOut,
  Pencil,
  Receipt,
} from "lucide-react";
import { usePurchaseStore } from "@/hooks/usePurchaseStore";

const Profile = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [user, setUser] = useState<SupaUser | null>(null);
  const store = usePurchaseStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) navigate("/auth");
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) navigate("/auth");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const userInitials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : "U";

  const subscription_data = store.subscription;
  const transactions = store.transactions;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-10">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-[14px] text-muted-foreground hover:text-foreground transition-colors mb-8 border border-border rounded-full px-4 py-2"
      >
        <ArrowLeft className="w-4 h-4" />
        {lang === "ru" ? "Назад" : "Back"}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left — Profile details */}
        <div>
          <h2 className="text-[22px] font-bold text-foreground mb-5">
            {lang === "ru" ? "Детали профиля" : "Profile Details"}
          </h2>

          <div className="border border-border rounded-2xl p-6">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-muted text-foreground text-[28px] font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full text-[13px] gap-1.5"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  {lang === "ru" ? "Изменить аватар" : "Change avatar"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full text-[13px] gap-1.5"
                  onClick={handleLogout}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {lang === "ru" ? "Выйти" : "Log out"}
                </Button>
              </div>
            </div>

            {/* Info fields */}
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[13px] text-muted-foreground">Email</p>
                  <p className="text-[15px] font-medium text-foreground">
                    {user?.email || "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <Send className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[13px] text-muted-foreground">Telegram</p>
                  <p className="text-[15px] font-medium text-foreground">—</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <Wallet className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[13px] text-muted-foreground">
                    {lang === "ru" ? "Кошелёк" : "Wallet"}
                  </p>
                  <p className="text-[15px] font-medium text-foreground">—</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Subscriptions */}
        <div>
          <h2 className="text-[22px] font-bold text-foreground mb-5">
            {lang === "ru" ? "Подписки" : "Subscriptions"}
          </h2>

          <div className="border border-border rounded-2xl p-6">
            {subscription_data?.active ? (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-dark to-violet-light flex items-center justify-center">
                    <Crown className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-[16px] font-semibold text-foreground">
                      {subscription_data.plan === "yearly"
                        ? (lang === "ru" ? "Годовой план" : "Yearly Plan")
                        : (lang === "ru" ? "Месячный план" : "Monthly Plan")}
                    </p>
                    <span className="inline-block mt-0.5 text-[12px] font-medium text-primary bg-primary/10 rounded-full px-2 py-0.5">
                      {lang === "ru" ? "Активна" : "Active"}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-[14px]">
                    <span className="text-muted-foreground">{lang === "ru" ? "Стоимость" : "Price"}</span>
                    <span className="font-medium text-foreground">{subscription_data.price}</span>
                  </div>
                  <div className="flex justify-between text-[14px]">
                    <span className="text-muted-foreground">{lang === "ru" ? "Начало" : "Started"}</span>
                    <span className="font-medium text-foreground">{subscription_data.startDate}</span>
                  </div>
                  <div className="flex justify-between text-[14px]">
                    <span className="text-muted-foreground">{lang === "ru" ? "Окончание" : "Expires"}</span>
                    <span className="font-medium text-foreground">{subscription_data.endDate}</span>
                  </div>
                </div>
              </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center py-8">
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Crown className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-[16px] font-semibold text-foreground mb-1">
                  {lang === "ru" ? "Нет активной подписки" : "No active subscription"}
                </p>
              </div>
            )}
          </div>

          {/* Transaction history */}
          <h2 className="text-[22px] font-bold text-foreground mt-8 mb-5">
            {lang === "ru" ? "История транзакций" : "Transaction History"}
          </h2>

          <div className="border border-border rounded-2xl p-6">
            {transactions.length === 0 ? (
              <div className="flex flex-col items-center text-center py-8">
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Receipt className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-[16px] font-semibold text-foreground mb-1">
                  {lang === "ru" ? "Нет транзакций" : "No transactions"}
                </p>
                <p className="text-[14px] text-muted-foreground">
                  {lang === "ru"
                    ? "Здесь будет история ваших покупок и подписок"
                    : "Your purchase and subscription history will appear here"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between py-3 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="text-[14px] font-medium text-foreground">
                        {lang === "ru" ? tx.descRu : tx.descEn}
                      </p>
                      <p className="text-[12px] text-muted-foreground">
                        {lang === "ru" ? tx.dateRu : tx.dateEn}
                      </p>
                    </div>
                    <span className="text-[15px] font-semibold text-foreground">
                      {tx.amount}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
