import { Star, Users, LayoutGrid, Bookmark, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

interface CourseCardProps {
  id: string;
  titleRu: string;
  titleEn: string;
  categoryLabel: string;
  rating: number;
  students: number;
  image: string;
  premium?: boolean;
  price?: number;
  isNew?: boolean;
  trending?: boolean;
  isOwned?: boolean;
}

const CourseCard = ({
  id,
  titleRu,
  titleEn,
  categoryLabel,
  rating,
  students,
  image,
  premium,
  isNew,
  trending,
  isOwned,
}: CourseCardProps) => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const title = lang === "ru" ? titleRu : titleEn;

  return (
    <div
      onClick={() => navigate(`/course/${id}`)}
      className="flex flex-col gap-3 cursor-pointer group"
    >
      {/* Image container */}
      <div className="relative w-full aspect-[328/181] rounded-[10px] overflow-hidden bg-muted">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top bar with badges & bookmark */}
        <div className="absolute top-1 left-2 right-1 flex items-center justify-between">
          <div className="flex items-center gap-[5px]">
            {isOwned && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#2EAD6D] px-2 py-[5px] text-body-12 font-semibold text-primary-foreground">
                <CheckCircle className="w-3.5 h-3.5" />
                {lang === "ru" ? "Куплено" : "Purchased"}
              </span>
            )}
            {!isOwned && isNew && (
              <span className="inline-flex items-center justify-center rounded-full bg-[#F65C39] border border-[rgba(76,1,1,0.06)] px-2 py-[5px] text-body-12 font-semibold text-primary-foreground">
                NEW
              </span>
            )}
            {!isOwned && trending && (
              <span className="inline-flex items-center justify-center gap-[3px] rounded-full border border-[rgba(146,76,254,0.1)] px-2 py-[5px] text-body-12 font-medium text-violet-super-dark"
                style={{ background: "linear-gradient(0deg, rgba(217, 192, 255, 0.5), rgba(217, 192, 255, 0.5)), #FFFFFF" }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 1.75C6.65 1.75 6.3175 1.89 6.07 2.1375L5.25 2.9575L4.43 2.1375C3.9025 1.61 3.0975 1.61 2.57 2.1375C2.0425 2.665 2.0425 3.47 2.57 3.9975L5.25 6.6775L3.5 8.4275V10.5H5.5725L7 9.0725L8.4275 10.5H10.5V8.4275L8.75 6.6775L11.43 3.9975C11.9575 3.47 11.9575 2.665 11.43 2.1375C10.9025 1.61 10.0975 1.61 9.57 2.1375L8.75 2.9575L7.93 2.1375C7.6825 1.89 7.35 1.75 7 1.75Z" fill="hsl(280 92% 21%)" />
                </svg>
                Trending
              </span>
            )}
          </div>

          {/* Bookmark */}
          <button
            onClick={(e) => e.stopPropagation()}
            className="w-[38px] h-[38px] rounded-full bg-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Bookmark className="w-[14px] h-[18px] text-foreground" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Category token */}
      <div className="flex items-center gap-1.5 px-2 py-[5px] bg-muted rounded-[6px] w-fit">
        <LayoutGrid className="w-2.5 h-2.5 text-foreground" strokeWidth={2} />
        <span className="text-body-14 text-foreground" style={{ color: "hsl(0 0% 27.5%)" }}>
          {categoryLabel}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-h3 text-foreground line-clamp-2" style={{ color: "hsl(0 0% 0%)" }}>
        {title}
      </h3>

      {/* Rating & students */}
      <div className="flex items-center gap-1.5">
        {/* Star + rating */}
        <div className="flex items-center gap-1">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 1L8.854 4.756L13 5.362L10 8.284L10.708 12.412L7 10.468L3.292 12.412L4 8.284L1 5.362L5.146 4.756L7 1Z" fill="#FF7D60" />
          </svg>
          <span className="text-body-14 text-foreground tracking-[0.01em]">
            {rating}
          </span>
        </div>

        {/* Users pill */}
        <div className="flex items-center gap-1.5 bg-muted rounded-full px-1.5 py-1">
          <Users className="w-[18px] h-[18px]" style={{ color: "hsl(0 0% 27.5%)" }} strokeWidth={1.25} />
          <span className="text-body-14" style={{ color: "hsl(0 0% 27.5%)" }}>
            {students.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
