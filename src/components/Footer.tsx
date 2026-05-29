import { Link } from "react-router-dom";
import { Send, Youtube, Github, Twitter } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type Col = {
  titleRu: string;
  titleEn: string;
  links: { ru: string; en: string; to: string }[];
};

const columns: Col[] = [
  {
    titleRu: "Продукт",
    titleEn: "Product",
    links: [
      { ru: "Каталог", en: "Catalog", to: "/catalog" },
      { ru: "Мои курсы", en: "My courses", to: "/my-courses" },
      { ru: "Инструкции", en: "Guides", to: "/instructions" },
      { ru: "Профиль", en: "Profile", to: "/profile" },
    ],
  },
  {
    titleRu: "Обучение",
    titleEn: "Learn",
    links: [
      { ru: "Категории", en: "Categories", to: "/catalog" },
      { ru: "Новые курсы", en: "New courses", to: "/catalog" },
      { ru: "Гайды", en: "Guides", to: "/instructions" },
      { ru: "FAQ", en: "FAQ", to: "/instructions" },
    ],
  },
  {
    titleRu: "Компания",
    titleEn: "Company",
    links: [
      { ru: "О нас", en: "About", to: "#" },
      { ru: "Блог", en: "Blog", to: "#" },
      { ru: "Ресурсы бренда", en: "Brand resources", to: "/brand" },
      { ru: "Партнёрство", en: "Partners", to: "#" },
    ],
  },
  {
    titleRu: "Поддержка",
    titleEn: "Support",
    links: [
      { ru: "Помощь", en: "Help center", to: "#" },
      { ru: "Контакты", en: "Contact", to: "#" },
      { ru: "Статус", en: "Status", to: "#" },
      { ru: "Сообщество", en: "Community", to: "#" },
    ],
  },
];

const Footer = () => {
  const { lang } = useLanguage();

  return (
    <footer role="contentinfo" className="bg-background border-t border-border mt-20">
      <h2 className="sr-only">Footer</h2>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        {/* Top: brand + columns */}
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <div className="max-w-sm">
            <div className="text-h2 text-foreground mb-3">Lovable</div>
            <p className="text-body-14 text-muted-foreground leading-relaxed">
              {lang === "ru"
                ? "Платформа коротких курсов о крипте, AI и Web3. Учись в своём темпе."
                : "Short, focused courses on crypto, AI and Web3. Learn at your own pace."}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {columns.map((col) => (
              <div key={col.titleEn}>
                <div className="text-caption-12-caps text-muted-foreground mb-5">
                  {lang === "ru" ? col.titleRu : col.titleEn}
                </div>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l.en}>
                      <Link
                        to={l.to}
                        className="text-body-14 text-foreground/80 hover:text-foreground transition-colors relative inline-block after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-[#B889FF] after:origin-left after:scale-x-0 after:rotate-[-3.5deg] hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out"
                      >
                        {lang === "ru" ? l.ru : l.en}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-border my-12" />

        {/* Big contacts + socials */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="space-y-3">
            <div className="text-caption-12-caps text-muted-foreground">
              {lang === "ru" ? "Связаться" : "Get in touch"}
            </div>
            <a
              href="mailto:hello@lovable.app"
              className="block text-h2 text-foreground hover:underline underline-offset-4"
            >
              hello@lovable.app
            </a>
            <a
              href="https://t.me/lovable"
              className="block text-h3 text-muted-foreground hover:text-foreground transition-colors"
            >
              @lovable
            </a>
          </div>

          <div className="flex items-center gap-2">
            {[
              { href: "#", Icon: Twitter, label: "Twitter" },
              { href: "#", Icon: Send, label: "Telegram" },
              { href: "#", Icon: Youtube, label: "Youtube" },
              { href: "#", Icon: Github, label: "Github" },
            ].map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Icon size={18} strokeWidth={1.75} />
              </a>
            ))}
          </div>
        </div>

        <div className="h-px bg-border my-12" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-caption-12 text-muted-foreground">
            © {new Date().getFullYear()} Lovable. {lang === "ru" ? "Все права защищены." : "All rights reserved."}
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-caption-12 text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">{lang === "ru" ? "Политика конфиденциальности" : "Privacy"}</a>
            <a href="#" className="hover:text-foreground transition-colors">{lang === "ru" ? "Условия" : "Terms"}</a>
            <a href="#" className="hover:text-foreground transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
