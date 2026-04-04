import { Link, useLocation, useSearchParams } from "react-router-dom";
import { LogIn, LogOut, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import type { User as SupaUser } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [user, setUser] = useState<SupaUser | null>(null);
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const isInstructions = location.pathname === "/instructions";
  const searchValue = searchParams.get("q") || "";

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

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-14">
      <div className="max-w-full mx-auto px-4 flex items-center justify-between h-14 gap-4">
        {isInstructions ? (
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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
              placeholder="Найти инструкцию..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border-none text-body-14 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>
        ) : (
          <div />
        )}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="text-caption-12 text-muted-foreground hidden sm:block">{user.email}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-body-14">
                <LogOut className="w-4 h-4 mr-1" />
                Выйти
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="text-body-14">
                <LogIn className="w-4 h-4 mr-1" />
                Войти
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
