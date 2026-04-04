import { Link, useLocation } from "react-router-dom";
import { Home, Circle, BookOpen, ClipboardList, Coins, Users, FileText, PanelLeftClose, PanelLeft } from "lucide-react";
import { useState } from "react";

const menuGroup1 = [
  { label: "Главная", icon: Home, path: "/" },
  { label: "Каталог", icon: Circle, path: "/catalog" },
  { label: "Мои курсы", icon: BookOpen, path: "/my-courses" },
];

const menuGroup2 = [
  { label: "Задания", icon: ClipboardList, path: "/tasks", badge: 12 },
  { label: "Мой токен", icon: Coins, path: "/token" },
  { label: "Реферальная программа", icon: Users, path: "/referral" },
];

const menuGroup3 = [
  { label: "AI Ассистент", icon: Sparkles, path: "/ai" },
];

const menuGroup4 = [
  { label: "Рабочее пространство", icon: PenTool, path: "/articles" },
];

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const renderItem = (item: { label: string; icon: React.ElementType; path: string; badge?: number }) => {
    const active = isActive(item.path);
    const Icon = item.icon;

    return (
      <Link
        key={item.path}
        to={item.path}
        className={`flex items-center gap-3 px-3 h-9 rounded-lg text-[16px] font-normal leading-none transition-colors relative ${
          active
            ? "bg-primary text-primary-foreground font-medium"
            : "text-foreground/70 hover:text-foreground hover:bg-muted"
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
      className="h-screen flex-shrink-0 border-r transition-all duration-200"
      style={{
        width: collapsed ? 60 : 249,
        background: '#F7F7F8',
        borderColor: 'hsl(var(--border))',
      }}
    >
      <div className="flex flex-col h-full px-3 pt-6">
        {/* Logo */}
        <div className="flex items-center justify-between mb-6 px-1">
          {!collapsed && (
            <span className="text-[20px] font-bold leading-none">
              <span style={{ color: '#924CFE' }}>A</span>
              <span className="text-foreground">cademy</span>
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-foreground/60 hover:text-foreground transition-colors p-1"
          >
            {collapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>
        </div>

        {/* Menu Group 1 */}
        <div className="flex flex-col gap-1.5">
          {menuGroup1.map(renderItem)}
        </div>

        {/* Divider */}
        <div className="my-3 border-t" style={{ borderColor: '#EBE9EA' }} />

        {/* Menu Group 2 */}
        <div className="flex flex-col gap-1.5">
          {menuGroup2.map(renderItem)}
        </div>

        {/* Divider */}
        <div className="my-3 border-t" style={{ borderColor: '#EBE9EA' }} />

        {/* AI Assistant */}
        <div className="flex flex-col gap-1.5">
          {menuGroup3.map(renderItem)}
        </div>

        {/* Divider */}
        <div className="my-3 border-t" style={{ borderColor: '#EBE9EA' }} />

        {/* Create section */}
        {!collapsed && (
          <p className="text-[16px] font-medium leading-none px-1 mb-2" style={{ color: '#8D8D8D' }}>
            Создать
          </p>
        )}
        <div className="flex flex-col gap-1.5">
          {menuGroup4.map(renderItem)}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
