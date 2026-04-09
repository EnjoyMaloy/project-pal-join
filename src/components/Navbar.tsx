import { Link, useLocation, useSearchParams } from "react-router-dom";
import { LogIn, Search, Sun, Moon, ChevronDown, Flame } from "lucide-react";
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
          <div className="flex items-stretch bg-muted border border-border rounded-[10px] cursor-pointer hover:bg-accent transition-colors overflow-hidden" style={{ height: 48 }}>
            <div className="flex items-center gap-2">
              <div className="w-[48px] h-full rounded-l-[9px] flex items-center justify-center text-[13px] font-bold text-white shrink-0" style={{ background: "#C4A0FF", boxShadow: "inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.15)" }}>A</div>
              <span className="text-[14px] font-normal text-foreground pr-3">212,384</span>
            </div>
            <div className="w-px self-center h-4 bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-[48px] h-full rounded-none bg-[#E07450] flex items-center justify-center text-[13px] font-bold text-white shrink-0">S</div>
              <span className="text-[14px] font-normal text-foreground pr-3">2,126,771</span>
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
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M230.08,78.26l-31.84,26.88L208,145.33a5.46,5.46,0,0,1-8.19,5.86L164,129.66l-35.78,21.53a5.46,5.46,0,0,1-8.19-5.86l9.73-40.19L97.92,78.26a5.38,5.38,0,0,1,3.13-9.48l41.79-3.31,16.1-38.14a5.51,5.51,0,0,1,10.12,0l16.1,38.14L227,68.78A5.38,5.38,0,0,1,230.08,78.26Z" opacity="0.2"/><path d="M239.35,70.08a13.41,13.41,0,0,0-11.77-9.28l-36.94-2.92L176.43,24.22a13.51,13.51,0,0,0-24.86,0L137.36,57.88,100.42,60.8a13.39,13.39,0,0,0-7.66,23.58l28.06,23.68-8.56,35.39a13.32,13.32,0,0,0,5.1,13.91,13.51,13.51,0,0,0,15,.69L164,139l31.65,19.06a13.54,13.54,0,0,0,15-.69,13.34,13.34,0,0,0,5.09-13.91l-8.56-35.39,28.06-23.68A13.32,13.32,0,0,0,239.35,70.08ZM193.08,99a8,8,0,0,0-2.61,8l8.28,34.21L168.13,122.8a8,8,0,0,0-8.25,0l-30.62,18.43L137.54,107a8,8,0,0,0-2.62-8L108,76.26l35.52-2.81a8,8,0,0,0,6.74-4.87L164,35.91l13.79,32.67a8,8,0,0,0,6.74,4.87l35.53,2.81Zm-105,24.18L29.66,181.66a8,8,0,0,1-11.32-11.32l58.45-58.45a8,8,0,0,1,11.32,11.32Zm10.81,49.87a8,8,0,0,1,0,11.31L45.66,237.66a8,8,0,0,1-11.32-11.32l53.27-53.26A8,8,0,0,1,98.92,173.08Zm73-1a8,8,0,0,1,0,11.32l-54.28,54.28a8,8,0,0,1-11.32-11.32l54.29-54.28A8,8,0,0,1,171.94,172.06Z"/></svg>
              {lang === "ru" ? "Премиум" : "Premium"}
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
