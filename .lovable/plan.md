# Footer для главной страницы

Добавить минималистичный светлый футер на страницу `/` (Catalog) в стиле современных SaaS/edtech продуктов.

## Что делаем

1. Создаём новый компонент `src/components/Footer.tsx`.
2. Подключаем его в конец `src/pages/Catalog.tsx` (под существующим контентом).
3. Используем только семантические токены из `index.css` (`bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`) и шрифт TT Commons из проекта. Без новых цветов.
4. Поддержка двух языков через `useLanguage` (ru/en).

## Структура футера

```text
┌───────────────────────────────────────────────────────────────┐
│  LOGO + краткий слоган        │  4 колонки ссылок            │
│  (1 колонка слева, на десктопе)│  Product · Learn · Company · │
│                                │  Support                      │
├───────────────────────────────────────────────────────────────┤  ← тонкий разделитель
│  Крупные контакты (email, телефон)      │   Соцсети справа    │
│  text-h2 / text-h3                       │   (иконки lucide)   │
├───────────────────────────────────────────────────────────────┤  ← тонкий разделитель
│  © 2026 Brand        Privacy · Terms · Cookies   RU / EN      │
└───────────────────────────────────────────────────────────────┘
```

### Колонки ссылок (заголовки + по 4–5 пунктов)

- **Product**: Каталог, Мои курсы, Инструкции, Профиль
- **Learn**: Категории, Новые курсы, Гайды, FAQ
- **Company**: О нас, Блог, Карьера, Партнёрство
- **Support**: Помощь, Контакты, Статус, Сообщество

### Контакты (крупно)

- Email: `hello@brand.com` — `text-h2`, hover подчёркивание
- Telegram: `@brand` — `text-h3`, muted

### Соцсети (справа от контактов)

Иконки `lucide-react`: Twitter (X), Send (Telegram), Youtube, Github. Размер 20px, `text-muted-foreground` → hover `text-foreground`.

## Технические детали

- Layout: `max-w-7xl mx-auto px-6 lg:px-10 py-16` с большими вертикальными отступами (much white space).
- Сетка ссылок: `grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12`.
- Верхняя секция: `grid lg:grid-cols-[1fr_2fr] gap-12`.
- Контактная секция: `flex flex-col md:flex-row md:items-end md:justify-between gap-8`.
- Разделители: `<div className="h-px bg-border" />` между секциями, отступы `my-12`.
- Типографика заголовков колонок: `text-caption-12-caps text-muted-foreground mb-4`.
- Ссылки: `text-body-14 text-foreground/80 hover:text-foreground transition-colors`, по одной на строку с `space-y-3`.
- Низ копирайта: `text-caption-12 text-muted-foreground`, на мобилке стакается.
- Адаптив: 1 колонка на мобильном, 2 на sm, 4 на md+. Логотип/слоган уезжает над ссылками на <lg.
- Footer как `<footer role="contentinfo">` с `<h2 className="sr-only">Footer</h2>`.

## Файлы

- Создать: `src/components/Footer.tsx`
- Изменить: `src/pages/Catalog.tsx` — импорт и `<Footer />` в самом низу JSX.

Никаких изменений бизнес-логики, роутинга, бэкенда. Чисто презентационный компонент.
