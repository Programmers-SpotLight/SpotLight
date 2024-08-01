import { ReactNode } from "react";

interface IButtonProps {
  children: ReactNode;
  onClick?: () => void;
}

const BannerButton = ({ 
  children, 
  onClick, 
}: IButtonProps) => {
  return (
    <button
      type="button"
      className={"bg-white text-Large text-primary font-extrabold w-[234px] h-[46px] rounded-[20px]"}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default BannerButton;
