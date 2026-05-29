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
  light?: boolean;
};

const swatches: Swatch[] = [
  { name: "OA Purple",      hex: "#A66CFF", rgb: "166, 108, 255", cmyk: "35, 58, 0, 0" },
  { name: "Active Orange",  hex: "#FF8645", rgb: "255, 134, 69",  cmyk: "0, 47, 73, 0" },
  { name: "Warm Neutral",   hex: "#FFFCF5", rgb: "255, 252, 245", cmyk: "0, 1, 4, 0", light: true },
  { name: "Graphite Black", hex: "#202020", rgb: "32, 32, 32",    cmyk: "0, 0, 0, 87" },
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
          <div className="max-w-2xl mb-8">
            <h2 className="text-h2 text-foreground mb-4">Цветовая палитра</h2>
            <p className="text-body-14 text-muted-foreground leading-relaxed">
              Наша палитра построена на контрасте насыщенного фиолетового, тёплого оранжевого
              и спокойных нейтралей. Используйте эти цвета как основу любых визуальных материалов о бренде.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {swatches.map((s) => (
              <div
                key={s.hex}
                className="rounded-2xl overflow-hidden border border-border bg-background"
              >
                <div
                  className="h-40 w-full"
                  style={{
                    backgroundColor: s.hex,
                    boxShadow: s.light ? "inset 0 0 0 1px hsl(var(--border))" : undefined,
                  }}
                />
                <div className="p-5 space-y-3">
                  <div className="text-subh-14 text-foreground">{s.name}</div>
                  <dl className="space-y-1.5 font-mono text-[11px] leading-[1.4] text-muted-foreground">
                    <div className="flex justify-between gap-3">
                      <dt>HEX</dt>
                      <dd className="text-foreground">{s.hex}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt>RGB</dt>
                      <dd className="text-foreground">{s.rgb}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt>CMYK</dt>
                      <dd className="text-foreground">{s.cmyk}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            ))}
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
