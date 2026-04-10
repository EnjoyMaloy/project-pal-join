import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import PaymentSettings from "@/components/PaymentSettings";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupaUser } from "@supabase/supabase-js";
import { useLanguage } from "@/contexts/LanguageContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import PremiumAvatarWrapper from "@/components/PremiumAvatarWrapper";
import {
  LogOut,
  Pencil,
  Globe,
  Volume2,
  Bell,
  ChevronDown,
  Mail,
  Send,
  Wallet,
  Sun,
  Moon,
} from "lucide-react";
import { usePurchaseStore } from "@/hooks/usePurchaseStore";
import { Switch } from "@/components/ui/switch";
import defaultAvatar from "@/assets/default-avatar.jpg";

const Profile = () => {
  const { lang, setLang } = useLanguage();
  const navigate = useNavigate();
  const [user, setUser] = useState<SupaUser | null>(null);
  const store = usePurchaseStore();
  const hasSubscription = store.subscription?.active;

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

  return (
    <div className="w-full px-9 py-6 md:py-10">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left column */}
        <div>
          <h2 className="text-[24px] font-medium leading-[90%] text-foreground mb-5">
            {lang === "ru" ? "Детали профиля" : "Profile Details"}
          </h2>

          {/* Avatar + Name + Buttons */}
          <div className="flex items-center gap-6 mb-6">
            <PremiumAvatarWrapper isPremium={!!hasSubscription} size="lg">
              <Avatar className="w-[100px] h-[100px] flex-shrink-0">
                <AvatarImage src={user?.user_metadata?.avatar_url || defaultAvatar} />
                <AvatarFallback className="bg-muted text-foreground text-[28px] font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </PremiumAvatarWrapper>

            <p className="text-[22px] font-bold text-foreground whitespace-nowrap">
              {user?.email?.split("@")[0] || "User"}
            </p>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="default"
                className="rounded-full text-[14px] gap-2 px-5 py-2.5 h-auto"
              >
                <Pencil className="w-4 h-4" />
                {lang === "ru" ? "Изменить аватар" : "Change the avatar"}
              </Button>
              <Button
                variant="outline"
                size="default"
                className="rounded-full text-[14px] gap-2 px-5 py-2.5 h-auto"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                {lang === "ru" ? "Выйти" : "Log out"}
              </Button>
            </div>
          </div>

          {/* Contact info card */}
          <div className="bg-[hsl(var(--muted))] rounded-2xl divide-y divide-border/50 mb-8">
            <div className="flex items-center justify-between px-6 py-5">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-foreground" />
                <span className="text-[20px] font-normal leading-[20px] text-foreground">Email</span>
              </div>
              <span className="text-[20px] font-normal leading-[20px] text-foreground">{user?.email || "—"}</span>
            </div>
            <div className="flex items-center justify-between px-6 py-5">
              <div className="flex items-center gap-3">
                <Send className="w-5 h-5 text-foreground" />
                <span className="text-[20px] font-normal leading-[20px] text-foreground">Telegram</span>
              </div>
              <span className="text-[20px] font-normal leading-[20px] text-foreground">{user?.email?.split("@")[0] || "—"}</span>
            </div>
            <div className="flex items-center justify-between px-6 py-5">
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 text-foreground" />
                <span className="text-[20px] font-normal leading-[20px] text-foreground">Wallet</span>
              </div>
              <span className="text-[20px] font-normal leading-[20px] text-foreground">-</span>
            </div>
          </div>

          {/* Payment Settings */}
          <PaymentSettings />

          {/* Settings */}
          <h2 className="text-[24px] font-medium leading-[90%] text-foreground mb-5">
            {lang === "ru" ? "Настройки" : "Settings"}
          </h2>

          <div className="bg-[hsl(var(--muted))] rounded-2xl divide-y divide-border/50">
            {/* Language */}
            <div className="flex items-center justify-between px-6 py-5">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-foreground" />
                <span className="text-[20px] font-normal leading-[20px] text-foreground">
                  {lang === "ru" ? "Язык" : "Language"}
                </span>
              </div>
              <button
                onClick={() => setLang(lang === "ru" ? "en" : "ru")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background border border-border/50 text-[15px] font-semibold text-foreground hover:bg-background/80 transition-colors"
              >
                <span>{lang === "ru" ? "🇷🇺" : "🇬🇧"}</span>
                {lang.toUpperCase()}
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>

            {/* Sounds */}
            <div className="flex items-center justify-between px-6 py-5">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-foreground" />
                <span className="text-[20px] font-normal leading-[20px] text-foreground">
                  {lang === "ru" ? "Звуки" : "Sounds"}
                </span>
              </div>
              <Switch />
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between px-6 py-5">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-foreground" />
                <span className="text-[20px] font-normal leading-[20px] text-foreground">
                  {lang === "ru" ? "Оповещения" : "Notifications"}
                </span>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-[60px]">
          {/* Portfolio */}
          <div className="flex flex-col gap-6">
            <h2 className="text-[24px] font-medium leading-[90%] text-[#000000]">
              {lang === "ru" ? "Портфолио" : "Portfolio"}
            </h2>
            <p className="text-[18px] font-normal leading-[120%] text-[#8D8D8D]">
              {lang === "ru" ? "Ваше портфолио пусто" : "Your portfolio is empty"}
            </p>
          </div>

          {/* Training statistics */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h2 className="text-[24px] font-medium leading-[90%] text-[#000000]">
                {lang === "ru" ? "Статистика обучения" : "Training statistics"}
              </h2>
              <button className="flex items-center justify-center gap-1 px-4 h-9 w-fit border border-[#EBE9EA] rounded-[10px] text-[18px] font-normal leading-[120%] text-[#464646] hover:bg-muted transition-colors">
                {lang === "ru" ? "За 30 дней" : "Last 30 days"}
                <ChevronDown className="w-3.5 h-3.5 text-[#464646]" />
              </button>
            </div>

            <div className="flex flex-col gap-5">
              <p className="text-[18px] font-normal leading-[120%] text-[#8D8D8D]">
                {lang === "ru"
                  ? "Вы ещё не прошли ни одного урока. Начните обучение прямо сейчас:"
                  : <>You haven't completed any lessons yet. <span className="text-[#000000] font-medium">Start your learning</span> right now:</>}
              </p>

              <div className="flex flex-wrap gap-2">
                {[
                  { label: lang === "ru" ? "Торговля криптой" : "Trading in Crypto", bg: "hsl(var(--tag-trading-bg) / 0.5)", color: "hsl(var(--tag-trading))" },
                  { label: lang === "ru" ? "Финансовая безопасность" : "Financial Security", bg: "hsl(var(--tag-security-bg) / 0.5)", color: "hsl(var(--tag-security))" },
                  { label: lang === "ru" ? "Web3 технологии" : "Web3 Technologies", bg: "hsl(var(--tag-web3-bg) / 0.5)", color: "hsl(var(--tag-web3))" },
                  { label: lang === "ru" ? "Инвестиции" : "Investments", bg: "hsl(var(--tag-invest-bg) / 0.5)", color: "hsl(var(--tag-invest))" },
                ].map((cat, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center justify-center px-5 py-4 rounded-full text-[22px] font-normal leading-[100%]"
                    style={{ background: cat.bg, color: cat.color }}
                  >
                    {cat.label}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                {[
                  { label: lang === "ru" ? "Мемкоины и NFT" : "Memecoins & NFTs", bg: "hsl(var(--tag-meme-bg) / 0.5)", color: "hsl(var(--tag-meme))" },
                  { label: lang === "ru" ? "Telegram и TON" : "Telegram & TON", bg: "hsl(var(--tag-telegram-bg) / 0.5)", color: "hsl(var(--tag-telegram))" },
                ].map((cat, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center justify-center px-5 py-4 rounded-full text-[22px] font-normal leading-[100%]"
                    style={{ background: cat.bg, color: cat.color }}
                  >
                    {cat.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="flex flex-col gap-6">
            <h2 className="text-[24px] font-medium leading-[90%] text-[#000000]">
              {lang === "ru" ? "Достижения" : "Achievements"}
            </h2>
            <p className="text-[18px] font-normal leading-[120%] text-[#8D8D8D]">
              {lang === "ru" ? "Вы ещё не заработали ни одного достижения" : "You haven't earned any achievements yet"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
