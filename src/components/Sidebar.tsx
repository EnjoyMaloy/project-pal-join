import { Link, useLocation } from "react-router-dom";
import { Home, LayoutGrid, BookOpen, ClipboardList, Coins, Users, FileText, PanelLeftClose, PanelLeft, RotateCcw } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { resetPurchaseStore } from "@/hooks/usePurchaseStore";
import logo from "@/assets/logo.png";

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { t, lang } = useLanguage();

  const menuGroup1 = [
    { label: t("sidebar.home"), icon: Home, path: "/" },
    { label: t("sidebar.catalog"), icon: LayoutGrid, path: "/catalog", disabled: true },
    { label: t("sidebar.myCourses"), icon: BookOpen, path: "/my-courses" },
  ];

  const menuGroup2 = [
    { label: t("sidebar.tasks"), icon: ClipboardList, path: "/tasks", badge: 12, disabled: true },
    { label: t("sidebar.myToken"), icon: Coins, path: "/token", disabled: true },
    { label: t("sidebar.referral"), icon: Users, path: "/referral", disabled: true },
  ];

  const menuGroup3 = [
    { label: t("sidebar.instructions"), icon: FileText, path: "/instructions" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const renderItem = (item: { label: string; icon: React.ElementType; path: string; badge?: number; disabled?: boolean }) => {
    const active = !item.disabled && isActive(item.path);
    const Icon = item.icon;

    if (item.disabled) {
      return (
        <div
          key={item.path}
          className="flex items-center gap-3 px-3 h-9 rounded-lg text-[16px] font-normal leading-none text-muted-foreground/50 cursor-default relative"
        >
          <Icon className="w-[18px] h-[18px] flex-shrink-0" />
          {!collapsed && <span className="truncate">{item.label}</span>}
        </div>
      );
    }

    return (
      <Link
        key={item.path}
        to={item.path}
        className={`flex items-center gap-3 px-3 h-9 rounded-lg text-[16px] font-normal leading-none transition-colors relative ${
          active
            ? "bg-primary text-primary-foreground font-medium"
            : "text-foreground/70 hover:text-foreground hover:bg-sidebar-accent"
        }`}
      >
        <Icon className="w-[18px] h-[18px] flex-shrink-0" />
        {!collapsed && <span className="truncate">{item.label}</span>}
        {item.badge && !collapsed && (
          <span
            className="absolute -top-1.5 left-5 min-w-[17px] h-[15px] flex items-center justify-center rounded-full text-[11px] font-medium text-white px-1"
            style={{ background: '#F65C39' }}
          >
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside
      className="h-screen flex-shrink-0 bg-sidebar transition-all duration-200 hidden md:block"
      style={{
        width: collapsed ? 60 : 249,
      }}
    >
      <div className="flex flex-col h-full px-3 pt-6">
        <div className="flex items-center justify-between mb-6 px-1">
          {!collapsed && (
            <img src={logo} alt="Open Academy" className="h-7 object-contain" />
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-foreground/60 hover:text-foreground transition-colors p-1"
          >
            {collapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          {menuGroup1.map(renderItem)}
        </div>

        <div className="my-3 border-t border-border" />

        <div className="flex flex-col gap-1.5">
          {menuGroup2.map(renderItem)}
        </div>

        <div className="my-3 border-t border-border" />

        <div className="flex flex-col gap-1.5">
          {menuGroup3.map(renderItem)}
        </div>

        <div className="mt-auto pb-6">
          <button
            onClick={() => {
              if (window.confirm(lang === "ru" ? "Сбросить данные подписок и курсов?" : "Reset subscriptions and courses data?")) {
                resetPurchaseStore();
              }
            }}
            className={`flex items-center gap-3 px-3 h-9 rounded-lg text-[16px] font-normal leading-none transition-colors text-destructive hover:bg-destructive/10 w-full ${collapsed ? "justify-center" : ""}`}
          >
            <RotateCcw className="w-[18px] h-[18px] flex-shrink-0" />
            {!collapsed && <span className="truncate">{lang === "ru" ? "Сбросить всё" : "Reset all"}</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
