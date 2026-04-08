import { Link, useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { LogIn, LogOut, Search, Sun, Moon, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import type { User as SupaUser } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const [user, setUser] = useState<SupaUser | null>(null);
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const userInitials = user?.email ? user.email.substring(0, 2).toUpperCase() : "U";

  return (
    <nav className={`sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-16 md:h-14 border-b-0 md:border-b md:border-border ${isArticleView || isMyCourses ? 'hidden md:block' : ''}`}>
      <div className="max-w-full mx-auto px-4 flex items-center justify-between h-16 md:h-14 gap-4 pt-1 md:pt-0">
        {isInstructions || isCatalog ? (
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 md:w-4 md:h-4 text-muted-foreground" />
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
              className="w-full pl-10 pr-4 py-2.5 md:py-2 rounded-lg bg-muted border-none text-[16px] md:text-body-14 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>
        ) : (
          <div />
        )}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Language switcher */}
          <div className="flex items-center bg-muted rounded-md p-0.5">
            <button
              onClick={() => setLang("ru")}
              className={`px-2 py-1 rounded text-caption-12 font-medium transition-colors ${lang === "ru" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              RU
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-2 py-1 rounded text-caption-12 font-medium transition-colors ${lang === "en" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              EN
            </button>
          </div>

          {/* Buy subscription button */}
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-dark via-violet-mid to-violet-light text-primary-foreground text-[14px] font-semibold shadow-md hover:shadow-lg hover:brightness-110 transition-all"
          >
            <Crown className="w-4 h-4" />
            {lang === "ru" ? "Купить подписку" : "Buy subscription"}
          </button>

          {/* Profile avatar / Auth */}
          {user ? (
            <Avatar className="w-9 h-9 cursor-pointer ring-2 ring-border hover:ring-primary/40 transition-all" onClick={handleLogout}>
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-muted text-foreground text-[13px] font-medium">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          ) : (
            <Link to="/auth">
              <Avatar className="w-9 h-9 cursor-pointer ring-2 ring-border hover:ring-primary/40 transition-all">
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
