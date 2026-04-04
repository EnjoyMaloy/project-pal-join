import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Eye, Clock, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import avatarSychev from "@/assets/avatar-sychev.jpg";
import avatarAnna from "@/assets/avatar-anna.jpg";
import avatarDmitry from "@/assets/avatar-dmitry.jpg";
import avatarAlex from "@/assets/avatar-alex.jpg";
import img3dSecurity from "@/assets/3d-security.png";
import img3dNft from "@/assets/3d-nft.png";
import img3dRocket from "@/assets/3d-rocket.png";
import img3dCoin from "@/assets/3d-coin.png";

interface StaticArticle {
  id: string;
  title: string;
  author: string;
  avatar: string;
  views: number;
  gradient: string;
  borderColor: string;
  image?: string;
  content: string;
  readTime: string;
  updatedAt: string;
}

const STATIC_ARTICLES: Record<string, StaticArticle> = {
  "static-1": {
    id: "static-1",
    title: "Как установить Open Claw?",
    author: "Dmitry Volkov",
    avatar: avatarDmitry,
    views: 3104,
    gradient: "linear-gradient(to left, #924CFE 0%, #D9C0FF 100%)",
    borderColor: "rgba(191, 150, 255, 0.4)",
    image: img3dSecurity,
    readTime: "8 мин",
    updatedAt: "2025-03-15",
    content: `
      <h2>Основные угрозы в Web3</h2>
      <p>Мир Web3 открывает невероятные возможности, но также сопряжён с уникальными рисками безопасности. В отличие от традиционного веба, здесь вы несёте полную ответственность за свои активы.</p>
      <h3>1. Фишинг и социальная инженерия</h3>
      <p>Мошенники создают поддельные сайты, которые выглядят идентично оригинальным платформам. Всегда проверяйте URL в адресной строке и никогда не вводите сид-фразу на сторонних сайтах.</p>
      <h3>2. Вредоносные смарт-контракты</h3>
      <p>Перед тем как взаимодействовать с контрактом, убедитесь, что он прошёл аудит. Используйте инструменты вроде Etherscan для проверки верифицированного кода контракта.</p>
      <h3>3. Безопасное хранение ключей</h3>
      <p>Используйте аппаратные кошельки для хранения значительных сумм. Никогда не храните приватные ключи в текстовых файлах или облачных хранилищах.</p>
      <h3>Рекомендации</h3>
      <ul>
        <li>Используйте отдельный кошелёк для тестирования новых проектов</li>
        <li>Включите двухфакторную аутентификацию везде, где это возможно</li>
        <li>Регулярно проверяйте разрешения (approvals) ваших токенов</li>
        <li>Не переходите по ссылкам из непроверенных источников</li>
      </ul>
    `,
  },
  "static-2": {
    id: "static-2",
    title: "Анализ NFT проектов",
    author: "Alex Kim",
    avatar: avatarAlex,
    views: 956,
    gradient: "linear-gradient(to left, #E08A00 0%, #FFF3C4 100%)",
    borderColor: "#FFCC47",
    image: img3dNft,
    readTime: "6 мин",
    updatedAt: "2025-02-20",
    content: `
      <h2>Как оценивать NFT проекты</h2>
      <p>Рынок NFT полон как перспективных проектов, так и мошеннических схем. Научитесь отличать одно от другого.</p>
      <h3>1. Команда проекта</h3>
      <p>Исследуйте основателей и разработчиков. Публичная команда с доказанным опытом — хороший знак. Анонимные создатели — повод для осторожности.</p>
      <h3>2. Активность сообщества</h3>
      <p>Здоровое сообщество в Discord и Twitter — один из главных индикаторов жизнеспособности проекта. Обратите внимание на качество обсуждений, а не только количество участников.</p>
      <h3>3. Дорожная карта</h3>
      <p>Реалистичная и последовательная дорожная карта с конкретными сроками говорит о серьёзности намерений команды.</p>
      <h3>Красные флаги</h3>
      <ul>
        <li>Обещания гарантированной прибыли</li>
        <li>Отсутствие чёткой утилити</li>
        <li>Накрученная активность ботами</li>
        <li>Копирование арта у других проектов</li>
      </ul>
    `,
  },
  "static-3": {
    id: "static-3",
    title: "Запуск токена",
    author: "Anna Petrova",
    avatar: avatarAnna,
    views: 1842,
    gradient: "linear-gradient(to left, #D63384 0%, #FFD6E0 100%)",
    borderColor: "#FF8A80",
    image: img3dCoin,
    readTime: "10 мин",
    updatedAt: "2025-01-10",
    content: `
      <h2>Пошаговый гайд по запуску токена</h2>
      <p>Запуск собственного токена — это серьёзный шаг, который требует технической подготовки и понимания регуляторных аспектов.</p>
      <h3>1. Выбор блокчейна</h3>
      <p>Ethereum, BNB Chain, Solana, TON — у каждого свои преимущества. Выбор зависит от вашей целевой аудитории и бюджета на газ.</p>
      <h3>2. Создание смарт-контракта</h3>
      <p>Используйте проверенные стандарты (ERC-20, SPL) и обязательно проведите аудит перед деплоем. Начните с тестовой сети.</p>
      <h3>3. Токеномика</h3>
      <p>Продумайте распределение токенов, механизмы сжигания и стимулирования. Прозрачная токеномика повышает доверие инвесторов.</p>
      <h3>4. Листинг и маркетинг</h3>
      <p>Подготовьте стратегию листинга на DEX и CEX. Создайте сильное комьюнити до запуска.</p>
    `,
  },
  "static-4": {
    id: "static-4",
    title: "Настройка TON Wallet",
    author: "Sychev Pavel",
    avatar: avatarSychev,
    views: 2738,
    gradient: "linear-gradient(to left, #4A8C1C 0%, #E8F5C8 100%)",
    borderColor: "#A0D468",
    image: img3dRocket,
    readTime: "5 мин",
    updatedAt: "2025-04-01",
    content: `
      <h2>Начало работы с TON Wallet</h2>
      <p>TON — один из самых быстрорастущих блокчейнов, тесно интегрированный с Telegram. Настройка кошелька займёт всего несколько минут.</p>
      <h3>1. Установка</h3>
      <p>Откройте Telegram и найдите бота @wallet. Это официальный кастодиальный кошелёк от Telegram. Для некастодиального варианта используйте Tonkeeper или MyTonWallet.</p>
      <h3>2. Создание кошелька</h3>
      <p>При создании некастодиального кошелька вам будет предложена сид-фраза из 24 слов. Запишите её на бумаге и храните в безопасном месте.</p>
      <h3>3. Пополнение</h3>
      <p>Вы можете купить TON через P2P в Telegram Wallet, на биржах или через обменники. Переведите TON на адрес вашего кошелька.</p>
      <h3>4. Использование</h3>
      <ul>
        <li>Отправка и получение TON и жетонов</li>
        <li>Покупка и продажа Telegram Gifts</li>
        <li>Участие в DeFi протоколах на TON</li>
        <li>Оплата услуг через Telegram</li>
      </ul>
    `,
  },
};

interface DbArticle {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

const ArticleView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [dbArticle, setDbArticle] = useState<DbArticle | null>(null);
  const [loading, setLoading] = useState(true);

  const staticArticle = id ? STATIC_ARTICLES[id] : null;

  useEffect(() => {
    if (!id || staticArticle) {
      setLoading(false);
      return;
    }
    supabase
      .from("articles")
      .select("id, title, content, created_at")
      .eq("id", id)
      .eq("published", true)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          navigate("/instructions");
        } else {
          setDbArticle(data);
        }
        setLoading(false);
      });
  }, [id, navigate, staticArticle]);

  if (loading) return null;

  if (staticArticle) {
    return (
      <div className="min-h-screen bg-background p-6">
        {/* Back button */}
        <div className="max-w-4xl mx-auto mb-4">
          <button
            onClick={() => navigate("/instructions")}
            className="flex items-center gap-2 text-primary text-body-14 py-2 px-3 -ml-3 rounded-lg hover:bg-primary/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2} />
            {t("article.back")}
          </button>
        </div>

        {/* Hero banner */}
        <div className="relative w-full h-[220px] overflow-hidden rounded-2xl max-w-4xl mx-auto" style={{ background: staticArticle.gradient }}>
          <div className="absolute right-[15%] bottom-2 flex items-end justify-end">
            {staticArticle.image && (
              <img src={staticArticle.image} alt="" className="w-[200px] h-[200px] object-contain drop-shadow-lg" />
            )}
          </div>
          <div className="absolute inset-0 flex items-center px-8 max-w-3xl mx-auto">
            <h1 className="text-foreground text-[36px] font-medium leading-[110%]">{staticArticle.title}</h1>
          </div>
        </div>

        {/* Meta bar */}
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-6 border-b border-border">
          <div className="flex items-center gap-3">
            <img
              src={staticArticle.avatar}
              alt={staticArticle.author}
              className="w-9 h-9 rounded-full object-cover"
            />
            <span className="text-body-14 text-foreground">{staticArticle.author}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Eye className="w-4 h-4" strokeWidth={1.5} />
            <span className="text-body-14">{staticArticle.views.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="w-4 h-4" strokeWidth={1.5} />
            <span className="text-body-14">{staticArticle.readTime}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CalendarDays className="w-4 h-4" strokeWidth={1.5} />
            <span className="text-body-14">
              {new Date(staticArticle.updatedAt).toLocaleDateString(t("instructions.all") === "Все" ? "ru-RU" : "en-US", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <article
            className="prose prose-neutral max-w-none text-body-14 text-foreground/80 leading-relaxed
              prose-headings:text-foreground prose-headings:font-normal
              prose-h2:text-h2 prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-h3 prose-h3:mt-6 prose-h3:mb-3
              prose-p:mb-4 prose-li:mb-1
              prose-ul:pl-5 prose-ul:list-disc"
            dangerouslySetInnerHTML={{ __html: staticArticle.content }}
          />
        </div>
      </div>
    );
  }

  if (!dbArticle) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate("/instructions")}
        className="text-body-14 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        {t("sidebar.instructions")}
      </Button>

      <h1 className="text-h1 text-foreground mb-2">{dbArticle.title}</h1>
      <p className="text-caption-12 text-muted-foreground mb-8">
        {new Date(dbArticle.created_at).toLocaleDateString("ru-RU")}
      </p>

      <article
        className="prose prose-neutral max-w-none text-body-14 text-foreground/80 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: dbArticle.content }}
      />
    </div>
  );
};

export default ArticleView;
