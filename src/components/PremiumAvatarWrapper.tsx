import { ReactNode } from "react";
import { Crown } from "lucide-react";

interface PremiumAvatarWrapperProps {
  isPremium: boolean;
  size?: "sm" | "lg";
  children: ReactNode;
}

const PremiumAvatarWrapper = ({ isPremium, size = "sm", children }: PremiumAvatarWrapperProps) => {
  if (!isPremium) return <>{children}</>;

  const badgeSize = size === "lg" ? 30 : 20;
  const iconSize = size === "lg" ? 16 : 10;
  const borderWidth = size === "lg" ? 3 : 2;

  return (
    <div className="relative inline-flex">
      {/* Gradient ring around avatar */}
      <div
        className="rounded-full bg-gradient-to-tr from-[#A66CFF] via-[#BF96FF] to-[#D9C0FF]"
        style={{ padding: borderWidth }}
      >
        <div className="rounded-full bg-background" style={{ padding: borderWidth }}>
          {children}
        </div>
      </div>

      {/* Crown badge at bottom-right */}
      <div
        className="absolute flex items-center justify-center rounded-full bg-gradient-to-tr from-[#924CFE] to-[#BF96FF] shadow-md ring-2 ring-background"
        style={{
          width: badgeSize,
          height: badgeSize,
          bottom: size === "lg" ? 2 : 0,
          right: size === "lg" ? 2 : -1,
        }}
      >
        <Crown className="text-white" style={{ width: iconSize, height: iconSize }} fill="white" strokeWidth={0} />
      </div>
    </div>
  );
};

export default PremiumAvatarWrapper;
