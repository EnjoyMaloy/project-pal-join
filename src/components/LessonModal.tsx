import { useLanguage } from "@/contexts/LanguageContext";
import { BookOpen } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";

interface LessonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lessonNumber: number;
  titleRu: string;
  titleEn: string;
  descriptionRu: string;
  descriptionEn: string;
  totalLessons: number;
  progress: number;
  onStart: () => void;
}

const LessonModal = ({
  open,
  onOpenChange,
  lessonNumber,
  titleRu,
  titleEn,
  descriptionRu,
  descriptionEn,
  totalLessons,
  progress,
  onStart,
}: LessonModalProps) => {
  const { lang } = useLanguage();
  const isMobile = useIsMobile();
  const title = lang === "ru" ? titleRu : titleEn;
  const description = lang === "ru" ? descriptionRu : descriptionEn;

  const content = (
    <div className="p-6 pb-8">
      <p className="text-[13px] text-muted-foreground mb-2 uppercase tracking-wide">
        {lang === "ru" ? "Урок" : "Lesson"} {lessonNumber}
      </p>
      <div className="flex items-start gap-2 mb-3">
        <BookOpen className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
        <h3 className="text-[20px] font-bold text-foreground leading-tight">{title}</h3>
      </div>
      <p className="text-[14px] text-muted-foreground leading-relaxed mb-6">{description}</p>

      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[13px] text-muted-foreground mb-0.5">{lang === "ru" ? "Пройдено:" : "Completed:"}</p>
          <p className="text-[20px] font-bold text-foreground">{progress}%</p>
        </div>
        <div>
          <p className="text-[13px] text-muted-foreground mb-0.5">{lang === "ru" ? "Награда" : "Reward"}</p>
          <div className="flex items-center gap-2">
            <span className="text-[15px]">🎁 1/{totalLessons}</span>
            <span className="text-[15px]">🪙 500</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          onStart();
          onOpenChange(false);
        }}
        className="w-full h-[52px] rounded-xl bg-foreground text-background text-[16px] font-semibold transition-colors hover:opacity-90"
      >
        {lang === "ru" ? "Начать" : "Start"}
      </button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="rounded-t-2xl">
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0 rounded-2xl overflow-hidden">
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default LessonModal;
