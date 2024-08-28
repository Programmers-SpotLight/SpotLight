import React, { InputHTMLAttributes, ReactNode, forwardRef } from 'react';

interface ITextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  width?: "small" | "medium" | "large" | "xlarge" | "full";
  height?: "small" | "smallPlus" | "medium" | "large";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  onClick? : () => void
}

const TextInput = forwardRef<HTMLInputElement, ITextInputProps>(({
  error,
  width = "medium",
  height = "small",
  icon,
  iconPosition = "left",
  onClick,
  ...props
}, ref) => {
  const baseStyles = "border rounded-lg text-medium p-3 focus:outline-none focus:border-2";
  const borderStyle = error ? "border-danger" : "border-grey2";
  const iconPadding = icon ? (iconPosition === "left" ? 'left-0 pl-3' : 'right-0 pr-3') : '';
  const inputPadding = icon ? (iconPosition === "left" ? 'pl-8' : 'pr-8') : '';

  const widthSize = {
    small: "w-72", /* 288px */
    medium: "w-96", /* 384px */
    large: "w-[660px]",
    xlarge: "w-[800px]",
    full: "w-full"
  };

  const heightSize = {
    small: "h-9", /* 36px */
    smallPlus: "h-[50px]",
    medium: "h-20", /* 80px */
    large: "h-36", /* 144px */
  };

  const inputClass = `${baseStyles} ${borderStyle} ${inputPadding} ${heightSize[height]}`;

  return (
    <div className={`relative flex flex-col ${widthSize[width]}`}>
      {icon && (
        <div className={`absolute inset-y-0 flex items-center ${onClick ? `cursor-pointer` : ``} ${iconPadding}`}
        onClick={onClick}>
          {icon}
        </div>
      )}
      <input
        ref={ref}
        {...props}
        className={inputClass}
      />
      {error && (
        <span className="text-danger mt-1">{error}</span>
      )}
    </div>
  );
});

TextInput.displayName = 'TextInput'; // This line is required for better debugging and should be added

export default TextInput;
