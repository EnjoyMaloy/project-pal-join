import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Circle, BookOpen, FileText, User, ArrowLeft, GraduationCap, Trophy } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const isMyCourses = location.pathname === "/my-courses";
  const currentTab = new URLSearchParams(location.search).get("tab");

  const defaultItems = [
    { label: t("sidebar.home"), icon: Home, path: "/", disabled: true },
    { label: t("sidebar.catalog"), icon: Circle, path: "/catalog", disabled: true },
    { label: t("sidebar.myCourses"), icon: BookOpen, path: "/my-courses" },
    { label: t("sidebar.instructions"), icon: FileText, path: "/instructions" },
    { label: t("bottomNav.profile"), icon: User, path: "/profile", disabled: true },
  ];

  const courseItems = [
    { label: "Назад", icon: ArrowLeft, path: "back", action: () => navigate("/") },
    { label: "Курс", icon: GraduationCap, path: "/my-courses" },
    { label: "Инструкции", icon: FileText, path: "/my-courses?tab=instructions" },
    { label: "Квест", icon: Swords, path: "/quest", disabled: true },
  ];

  const items = isMyCourses ? courseItems : defaultItems;

  const isActive = (item: any) => {
    if (item.disabled) return false;
    if (isMyCourses && item.path === "/my-courses?tab=instructions") return currentTab === "instructions";
    if (isMyCourses && item.path === "/my-courses") return !currentTab;
    if (item.path === "/") return location.pathname === "/";
    return location.pathname.startsWith(item.path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item: any) => {
          const active = isActive(item);
          const Icon = item.icon;

          const content = (
            <div className="flex flex-col items-center gap-0.5">
              <Icon className={`w-5 h-5 ${active ? "text-[#924CFE]" : item.disabled ? "text-muted-foreground/40" : "text-muted-foreground"}`} />
              <span className={`text-[11px] leading-tight ${active ? "text-[#924CFE] font-medium" : item.disabled ? "text-muted-foreground/40" : "text-muted-foreground"}`}>
                {item.label}
              </span>
            </div>
          );

          if (item.action) {
            return (
              <button key={item.path} onClick={item.action} className="flex-1 flex justify-center py-2">
                {content}
              </button>
            );
          }

          if (item.disabled) {
            return (
              <div key={item.path} className="flex-1 flex justify-center py-2 cursor-default">
                {content}
              </div>
            );
          }

          return (
            <Link key={item.path} to={item.path} className="flex-1 flex justify-center py-2">
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
