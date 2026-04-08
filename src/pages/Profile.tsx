import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupaUser } from "@supabase/supabase-js";
import { useLanguage } from "@/contexts/LanguageContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Crown,
  LogOut,
  Pencil,
  Globe,
  Volume2,
  Bell,
  ChevronDown,
  Mail,
  Send,
  Wallet,
  BookOpen,
  Clock,
  Trophy,
} from "lucide-react";
import { usePurchaseStore } from "@/hooks/usePurchaseStore";
import { Switch } from "@/components/ui/switch";

const Profile = () => {
  const { lang, setLang } = useLanguage();
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
        {/* Left column */}
        <div>
          <h2 className="text-[22px] font-bold text-foreground mb-5">
            {lang === "ru" ? "Детали профиля" : "Profile Details"}
          </h2>

          {/* Avatar + Name + Buttons */}
          <div className="flex items-center gap-6 mb-6">
            <Avatar className="w-24 h-24 flex-shrink-0">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-muted text-foreground text-[28px] font-semibold">
                {userInitials}
              </AvatarFallback>
            </Avatar>

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
          <div className="border border-border rounded-2xl divide-y divide-border mb-8">
            <div className="flex items-center justify-between px-6 py-5">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-foreground" />
                <span className="text-[16px] font-medium text-foreground">Email</span>
              </div>
              <span className="text-[15px] text-foreground">{user?.email || "—"}</span>
            </div>
            <div className="flex items-center justify-between px-6 py-5">
              <div className="flex items-center gap-3">
                <Send className="w-5 h-5 text-foreground" />
                <span className="text-[16px] font-medium text-foreground">Telegram</span>
              </div>
              <span className="text-[15px] text-foreground">{user?.email?.split("@")[0] || "—"}</span>
            </div>
            <div className="flex items-center justify-between px-6 py-5">
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 text-foreground" />
                <span className="text-[16px] font-medium text-foreground">Wallet</span>
              </div>
              <span className="text-[15px] text-foreground">—</span>
            </div>
          </div>

          {/* Settings */}
          <h2 className="text-[22px] font-bold text-foreground mb-5">
            {lang === "ru" ? "Настройки" : "Settings"}
          </h2>

          <div className="border border-border rounded-2xl divide-y divide-border">
            {/* Language */}
            <div className="flex items-center justify-between px-6 py-5">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-foreground" />
                <span className="text-[16px] font-medium text-foreground">
                  {lang === "ru" ? "Язык" : "Language"}
                </span>
              </div>
              <button
                onClick={() => setLang(lang === "ru" ? "en" : "ru")}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-[14px] font-medium text-foreground hover:bg-muted transition-colors"
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
                <span className="text-[16px] font-medium text-foreground">
                  {lang === "ru" ? "Звуки" : "Sounds"}
                </span>
              </div>
              <Switch />
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between px-6 py-5">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-foreground" />
                <span className="text-[16px] font-medium text-foreground">
                  {lang === "ru" ? "Оповещения" : "Notifications"}
                </span>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        {/* Right column */}
        <div>
          {/* Portfolio */}
          <h2 className="text-[22px] font-bold text-foreground mb-5">
            {lang === "ru" ? "Портфолио" : "Portfolio"}
          </h2>

          <div className="mb-8">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <span className="text-[18px]">🎨</span>
            </div>
          </div>

          {/* Learning statistics */}
          <h2 className="text-[22px] font-bold text-foreground mb-5">
            {lang === "ru" ? "Статистика обучения" : "Learning Statistics"}
          </h2>

          <div className="mb-4">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-border text-[14px] font-medium text-foreground hover:bg-muted transition-colors">
              {lang === "ru" ? "За все время" : "All time"}
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="border border-border rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[hsl(var(--destructive)/0.1)] flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-[hsl(var(--destructive))]" />
              </div>
              <div>
                <p className="text-[13px] text-muted-foreground leading-tight">
                  {lang === "ru" ? "Пройдено уроков" : "Lessons completed"}
                </p>
                <p className="text-[24px] font-bold text-foreground">24</p>
              </div>
            </div>
            <div className="border border-border rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[hsl(var(--primary)/0.1)] flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-[hsl(var(--primary))]" />
              </div>
              <div>
                <p className="text-[13px] text-muted-foreground leading-tight">
                  {lang === "ru" ? "Минут образования" : "Minutes of learning"}
                </p>
                <p className="text-[24px] font-bold text-foreground">120</p>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <h2 className="text-[22px] font-bold text-foreground mb-5">
            {lang === "ru" ? "Достижения" : "Achievements"}
          </h2>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {[
              { emoji: "🛒", bg: "bg-red-50 dark:bg-red-950/30" },
              { emoji: "🏔️", bg: "bg-blue-50 dark:bg-blue-950/30" },
              { emoji: "💯", bg: "bg-yellow-50 dark:bg-yellow-950/30" },
              { emoji: "🧭", bg: "bg-pink-50 dark:bg-pink-950/30" },
            ].map((item, i) => (
              <div
                key={i}
                className={`w-24 h-24 rounded-2xl ${item.bg} flex items-center justify-center flex-shrink-0`}
              >
                <span className="text-[40px]">{item.emoji}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
