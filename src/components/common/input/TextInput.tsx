import React, { InputHTMLAttributes, ReactNode } from 'react';

interface ITextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  width?: "small" | "medium" | "large" | "xlarge";
  height?: "small" | "medium" | "large";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

const TextInput = ({ 
  error, 
  width = "medium",
  height = "small",
  icon,
  iconPosition = "left",
  ...props
}: ITextInputProps) => {
  const baseStyles = "border rounded-lg text-medium p-3 focus:outline-none focus:border-2";
  const borderStyle = error ? "border-danger" : "border-grey2";
  const iconPadding = icon ? (iconPosition === "left" ? 'left-0 pl-3' : 'right-0 pr-3') : '';
  const inputPadding = icon ? (iconPosition === "left" ? 'pl-8' : 'pr-8') : '';

  const widthSize = {
    small: "w-72", /* 288px */
    medium: "w-96", /* 384px */
    large: "w-[660px]",
    xlarge: "w-[800px]"
  };

  const heightSize = {
    small: "h-9", /* 36px */
    medium: "h-20", /* 80px */
    large: "h-36", /* 144px */
  };

  const inputClass = `${baseStyles} ${borderStyle} ${inputPadding} ${heightSize[height]}`;

  return (
    <div className={`relative flex flex-col ${widthSize[width]}`}>
      {icon && (
        <div className={`absolute inset-y-0 flex items-center ${iconPadding}`}>
          {icon}
        </div>
      )}
      <input
        {...props}
        className={inputClass} 
      />
      {error && (
        <span className="text-danger mt-1">{error}</span>
      )}
    </div>
  );
};

export default TextInput;