import { ReactNode } from "react";

interface PremiumAvatarWrapperProps {
  isPremium: boolean;
  size?: "sm" | "lg";
  children: ReactNode;
}

const PremiumAvatarWrapper = ({ isPremium, size = "sm", children }: PremiumAvatarWrapperProps) => {
  if (!isPremium) return <>{children}</>;

  const ringSize = size === "lg" ? "p-[3px]" : "p-[2px]";

  return (
    <div className={`relative rounded-full bg-gradient-to-tr from-[#A66CFF] via-[#BF96FF] to-[#D9C0FF] ${ringSize}`}>
      {children}
      <div className="absolute -bottom-0.5 -right-0.5 bg-gradient-to-tr from-[#A66CFF] to-[#D9C0FF] rounded-full flex items-center justify-center shadow-sm"
        style={{ width: size === "lg" ? 28 : 18, height: size === "lg" ? 28 : 18 }}
      >
        <span className="text-white" style={{ fontSize: size === "lg" ? 14 : 10 }}>👑</span>
      </div>
    </div>
  );
};

export default PremiumAvatarWrapper;
