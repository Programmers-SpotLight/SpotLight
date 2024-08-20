"use client";

import { useModalStore } from "@/stores/modalStore";
import React, { ReactNode } from "react";

interface IButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  color?: "white" | "primary" | "danger" | "default";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  // 인증 필요시 isRequiredAuthCheck true 후 useSession의 status 값 할당
  isRequiredAuthCheck?: boolean;
  authStatus?: "loading" | "authenticated" | "unauthenticated";
}

const Button = ({
  children,
  onClick,
  type = "button",
  color = "primary",
  size = "medium",
  disabled = false,
  isRequiredAuthCheck = false,
  authStatus
}: IButtonProps) => {
  const baseStyles = "h-9 rounded-lg text-small";

  const colorStyles = {
    white: "bg-white text-grey4 border border-grey2 hover:bg-grey1",
    primary: "bg-primary text-white hover:bg-[#063D60]",
    danger: "bg-danger text-white hover:bg-[#C2364E]",
    default: "bg-grey4 text-white"
  };

  const sizeStyles = {
    small: "w-20",
    medium: "w-40",
    large: "w-52"
  };

  const buttonClass = `${baseStyles} ${colorStyles[color]} ${sizeStyles[size]}`;

  const { openModal } = useModalStore();
  const handleOnclick = () => {
    if (isRequiredAuthCheck && authStatus === "unauthenticated") {
      openModal;
    }
    onClick;
  };

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={handleOnclick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
