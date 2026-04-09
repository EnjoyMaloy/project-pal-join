import { ReactNode } from "react";

interface PremiumAvatarWrapperProps {
  isPremium: boolean;
  size?: "sm" | "lg";
  children: ReactNode;
}

const PremiumAvatarWrapper = ({ isPremium, size = "sm", children }: PremiumAvatarWrapperProps) => {
  if (!isPremium) return <>{children}</>;

  const borderWidth = size === "lg" ? 3 : 2;

  return (
    <div
      className="rounded-full animate-gradient-border"
      style={{
        padding: borderWidth,
        background: "linear-gradient(270deg, #924CFE, #BF96FF, #D9C0FF, #A66CFF, #924CFE)",
        backgroundSize: "300% 300%",
      }}
    >
      {children}
    </div>
  );
};

export default PremiumAvatarWrapper;
