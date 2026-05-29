import { Link } from "react-router-dom";
import { ArrowLeft, Download, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import emojiPreview from "@/assets/brand-emoji-preview.png";

type Swatch = {
  name: string;
  hex: string;
  rgb: string;
  cmyk: string;
  textDark?: boolean; // dark text on light bg
  pill?: boolean;
  // scattered (resting) transform
  rest: string;
  // grid position (column / row spans for the neat layout)
  gridClass: string;
};

const swatches: Swatch[] = [
  {
    name: "OA Purple", hex: "#A66CFF", rgb: "166, 108, 255", cmyk: "35, 58, 0, 0",
    rest: "translate(-4%, 8%) rotate(5.86deg)",
    gridClass: "col-start-1 row-start-1",
  },
  {
    name: "Active Orange", hex: "#FF8645", rgb: "255, 134, 69", cmyk: "0, 47, 73, 0",
    rest: "translate(-14%, -4%) rotate(-4.12deg)",
    gridClass: "col-start-2 row-start-1",
  },
  {
    name: "Bright Yellow", hex: "#FFDD31", rgb: "255, 221, 49", cmyk: "0, 13, 81, 0",
    rest: "translate(-24%, 12%) rotate(17.17deg)",
    gridClass: "col-start-3 row-start-1",
  },
  {
    name: "Fresh Lime", hex: "#CCEF40", rgb: "204, 239, 64", cmyk: "15, 0, 73, 6",
    rest: "translate(8%, -12%) rotate(-17.65deg)",
    gridClass: "col-start-1 row-start-2",
  },
  {
    name: "Sky Blue", hex: "#88C5FD", rgb: "136, 197, 253", cmyk: "46, 22, 0, 1",
    rest: "translate(-6%, -10%) rotate(12.81deg)",
    gridClass: "col-start-2 row-start-2",
  },
  {
    name: "Soft Pink", hex: "#FF96C8", rgb: "255, 150, 200", cmyk: "0, 41, 22, 0",
    rest: "translate(-18%, -8%) rotate(-11.68deg)",


    gridClass: "col-start-3 row-start-2",
  },
];

const pills: Swatch[] = [
  {
    name: "Warm Neutral", hex: "#FFFCF5", rgb: "255, 252, 245", cmyk: "0, 1, 4, 0",
    textDark: true, pill: true,
    rest: "translate(6%, 28%) rotate(-2deg)",
    gridClass: "col-start-1 row-start-3 col-span-1",
  },
  {
    name: "Graphite Black", hex: "#202020", rgb: "32, 32, 32", cmyk: "0, 0, 0, 87",
    pill: true,
    rest: "translate(-18%, -6%) rotate(4deg)",
    gridClass: "col-start-2 row-start-3 col-span-2",
  },
];

const soon = () => toast("Файл скоро будет доступен", { description: "Мы готовим архив — загляните чуть позже." });

const BrandResources = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-caption-12 text-muted-foreground hover:text-foreground transition-colors mb-12"
        >
          <ArrowLeft size={14} /> На главную
        </Link>

        {/* Hero */}
        <header className="mb-20 max-w-2xl">
          <h1 className="text-h1 text-foreground mb-5">Айдентика нашего бренда</h1>
          <p className="text-body-14 text-muted-foreground leading-relaxed">
            Привет! Здесь собраны материалы, которые помогут вам красиво и единообразно рассказывать о нас.
            Скачивайте логотип, цветовую палитру и эмодзи-иллюстрации — всё в хорошем качестве и в фирменных цветах.
          </p>
        </header>

        {/* Logo */}
        <section className="mb-20">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-14 items-start">
            <div>
              <h2 className="text-h2 text-foreground mb-4">Логотип</h2>
              <p className="text-body-14 text-muted-foreground leading-relaxed mb-6">
                Вы можете использовать логотип для партнёрских материалов. Скачивайте в хорошем качестве
                и фирменных цветах — мы подготовили версии в SVG и PNG для светлых и тёмных подложек.
              </p>
              <Button onClick={soon} className="gap-2">
                <Download size={16} /> Скачать .ZIP
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-2xl bg-muted border border-dashed border-border flex items-center justify-center"
                >
                  <span className="text-caption-12 text-muted-foreground">Скоро</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Palette */}
        <section className="mb-20">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 items-center">
            <div>
              <h2 className="text-h2 text-foreground mb-6">Цветовая палитра</h2>
              <div className="space-y-4 text-body-14 text-muted-foreground leading-relaxed">
                <p>Цветовая система поможет вам сохранить оригинальные цвета нашего бренда.</p>
                <p>Основные цвета – сиреневый и оранжевый.</p>
                <p>Четыре дополнительных оттенка мы используем для разнообразия в графике.</p>
                <p>Нейтральную пару — кремовый и графитовый чёрный — можно использовать для текста, монохромных акцентов или фона.</p>
              </div>
            </div>

            <div className="group/palette w-full max-w-[490px] justify-self-end py-6">
              <div className="grid grid-cols-3 gap-0 [grid-template-rows:auto_auto_auto]">
                {[...swatches, ...pills].map((s, i) => {
                  const isPill = s.pill;
                  const textColor = s.textDark ? "#202020" : (isPill ? "#FFFCF5" : "#202020");
                  return (
                    <div
                      key={s.hex}
                      className={`${s.gridClass} ${isPill ? "h-14 rounded-full px-5 flex items-center justify-center" : "aspect-square rounded-[20px] p-4 flex flex-col items-center justify-center text-center"} transition-transform duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform [transform:var(--rest)] group-hover/palette:[transform:translate(0,0)_rotate(0deg)]`}
                      style={{
                        backgroundColor: s.hex,
                        ["--rest" as string]: s.rest,
                        zIndex: 10 + i,
                        color: textColor,
                      }}
                    >
                      {isPill ? (
                        <span className="font-mono text-[13px] select-all">{s.hex}</span>
                      ) : (
                        <div className="leading-tight text-center">
                          <div className="text-[13px] font-medium">{s.name}</div>
                          <div className="font-mono text-[13px] select-all" title={`RGB ${s.rgb} · CMYK ${s.cmyk}`}>{s.hex}</div>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>



        {/* Emoji */}
        <section className="mb-10">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-center">
            <div>
              <h2 className="text-h2 text-foreground mb-4">Эмодзи-иллюстрации</h2>
              <p className="text-body-14 text-muted-foreground leading-relaxed mb-6">
                Набор объёмных 3D-эмодзи для соцсетей, презентаций и сообщений в Telegram.
                Используйте их, чтобы добавить тёплый характер брендовым материалам и сделать
                общение с аудиторией живее.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button onClick={soon} className="gap-2">
                  <Download size={16} /> Скачать
                </Button>
                <Button asChild variant="outline" className="gap-2">
                  <a href="https://t.me/" target="_blank" rel="noreferrer">
                    <Send size={16} /> Добавить в Telegram
                  </a>
                </Button>
              </div>
            </div>

            <div className="rounded-2xl bg-card border border-border p-6 lg:p-8">
              <img
                src={emojiPreview}
                alt="Превью эмодзи-иллюстраций бренда"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BrandResources;
