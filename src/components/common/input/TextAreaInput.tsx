import React, { TextareaHTMLAttributes } from 'react';

interface ITextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  width?: "small" | "medium" | "large" | "xlarge";
  height?: "small" | "large";
  onTextChange?: (text: string) => void;
}

const TextAreaInput = ({ 
  error, 
  width = "medium",
  height = "small",
  onTextChange,
  ...props
}: ITextAreaProps) => {
  const baseStyles = "border rounded-lg text-medium p-3 focus:outline-none focus:border-2 resize-none";
  const borderStyle = error ? "border-danger" : "border-grey2";

  const widthSize = {
    small: "w-72", /* 288px */
    medium: "w-96", /* 384px */
    large: "w-[660px]",
    xlarge: "w-[800px]"
  };

  const heightSize = {
    small: "h-20", /* 80px */
    large: "h-32", /* 128px */
  };

  const inputClass = `${baseStyles} ${borderStyle} ${heightSize[height]}`;
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onTextChange) {
      onTextChange(e.target.value);
    }
  };

  return (
    <div className={`relative flex flex-col ${widthSize[width]}`}>
      <textarea
        {...props}
        className={inputClass} 
        onChange={handleChange}
      />
      {error && (
        <span className="text-danger mt-1">{error}</span>
      )}
    </div>
  );
};

export default TextAreaInput;