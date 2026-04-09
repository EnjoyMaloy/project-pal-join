import { Link, useLocation, useSearchParams } from "react-router-dom";
import { LogIn, Search, StarHalf, Sun, Moon, ChevronDown, Flame } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import type { User as SupaUser } from "@supabase/supabase-js";
import { useLanguage } from "@/contexts/LanguageContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SubscriptionModal from "@/components/SubscriptionModal";
import PremiumAvatarWrapper from "@/components/PremiumAvatarWrapper";
import { usePurchaseStore } from "@/hooks/usePurchaseStore";
import defaultAvatar from "@/assets/default-avatar.jpg";
import { useTheme } from "next-themes";
import flagEn from "@/assets/flag-en.png";
import flagRu from "@/assets/flag-ru.png";

const Navbar = () => {
  const [user, setUser] = useState<SupaUser | null>(null);
  const [subModalOpen, setSubModalOpen] = useState(false);
  const store = usePurchaseStore();
  const hasSubscription = store.subscription?.active;
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const isInstructions = location.pathname === "/instructions";
  const isArticleView = location.pathname.startsWith("/instructions/");
  const isMyCourses = location.pathname === "/my-courses";
  const isCatalog = location.pathname === "/catalog" || location.pathname === "/";
  const searchValue = searchParams.get("q") || "";
  const { lang, setLang, t } = useLanguage();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const userInitials = user?.email ? user.email.substring(0, 2).toUpperCase() : "U";

  return (
    <nav
      className={`sticky top-0 z-50 bg-background border-b border-border ${isArticleView || isMyCourses ? 'hidden md:block' : ''}`}
      style={{ height: 80 }}
    >
      <div className="max-w-full mx-auto px-9 flex items-center justify-between h-full gap-4">
        {/* Left: Search */}
        {isInstructions || isCatalog ? (
          <div className="flex items-center gap-4">
            <div className="relative" style={{ width: 260 }}>
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val) {
                    setSearchParams({ q: val });
                  } else {
                    setSearchParams({});
                  }
                }}
                placeholder={isCatalog ? t("nav.searchCourse") : t("nav.search")}
                className="w-full pl-10 pr-4 py-2.5 rounded-[10px] bg-muted border-none text-[18px] font-normal text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                style={{ height: 48 }}
              />
            </div>
            {/* Streak button */}
            <button className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity">
              <Flame className="w-5 h-5" style={{ color: "#F65C39" }} />
              <span className="text-[20px] font-semibold">56</span>
            </button>
          </div>
        ) : (
          <div />
        )}

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {/* Group: Lang + Theme */}
          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <button
              onClick={() => setLang(lang === "ru" ? "en" : "ru")}
              className="flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg border border-border bg-background text-foreground hover:bg-muted transition-colors"
              style={{ height: 48, minWidth: 102 }}
            >
              <img src={lang === "ru" ? flagRu : flagEn} alt="" className="w-[27px] h-[18px] rounded-[3px] object-cover" />
              <span className="text-[16px] font-normal" style={{ color: "hsl(var(--foreground))" }}>
                {lang === "ru" ? "RU" : "EN"}
              </span>
              <ChevronDown className="w-3 h-3 text-foreground" />
            </button>

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center justify-center rounded-lg border border-border bg-background text-foreground hover:bg-muted transition-colors"
              style={{ width: 48, height: 48 }}
            >
              {theme === "dark" ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
            </button>
          </div>

          {/* Unified currency block */}
          <div className="flex items-center bg-muted border border-border rounded-[10px] gap-3 cursor-pointer hover:bg-accent transition-colors" style={{ height: 48, padding: "6px 16px" }}>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#A66CFF]/80 flex items-center justify-center text-[11px] font-bold text-white">A</div>
              <span className="text-[14px] font-normal text-foreground">212,384</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#E07450]/80 flex items-center justify-center text-[11px] font-bold text-white">S</div>
              <span className="text-[14px] font-normal text-foreground">2,126,771</span>
            </div>
          </div>

          {/* Buy subscription button */}
          {!hasSubscription && (
            <div className="rounded-[10px] p-[2px] animate-gradient-border" style={{ height: 48, background: "linear-gradient(270deg, #924CFE, #BF96FF, #D9C0FF, #A66CFF, #924CFE)", backgroundSize: "300% 300%" }}>
              <button
                onClick={() => setSubModalOpen(true)}
                className="flex items-center gap-2 rounded-[8px] bg-[#A66CFF] text-white text-[16px] font-normal hover:brightness-110 transition-all w-full h-full"
                style={{ padding: "6px 16px 6px 10px" }}
              >
              <StarHalf className="w-4 h-4" />
              {lang === "ru" ? "Подписаться" : "Subscribe"}
              </button>
            </div>
          )}
          <SubscriptionModal open={subModalOpen} onOpenChange={setSubModalOpen} />

          {/* Profile avatar / Auth */}
          {user ? (
            <Link to="/profile">
              <PremiumAvatarWrapper isPremium={!!hasSubscription} size="sm">
                <Avatar className="w-11 h-11 cursor-pointer">
                  <AvatarImage src={user.user_metadata?.avatar_url || defaultAvatar} />
                  <AvatarFallback className="bg-muted text-foreground text-[13px] font-medium">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </PremiumAvatarWrapper>
            </Link>
          ) : (
            <Link to="/profile">
              <Avatar className="w-11 h-11 cursor-pointer">
                <AvatarImage src={defaultAvatar} />
                <AvatarFallback className="bg-muted text-muted-foreground text-[13px] font-medium">
                  <LogIn className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
