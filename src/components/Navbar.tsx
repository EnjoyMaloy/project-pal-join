import { Link, useLocation } from "react-router-dom";
import { BookOpen, FileText, LogIn, LogOut, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import type { User as SupaUser } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const location = useLocation();
  const [user, setUser] = useState<SupaUser | null>(null);

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

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-subh-16 text-foreground hover:text-primary transition-colors">
            TG Gifts
          </Link>
          <div className="flex items-center gap-1">
            <Link
              to="/"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-body-14 transition-colors ${
                isActive("/") ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Курс
            </Link>
            <Link
              to="/articles"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-body-14 transition-colors ${
                isActive("/articles") || isActive("/articles/new") ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <FileText className="w-4 h-4" />
              Статьи
            </Link>
          </div>
        </div>
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
