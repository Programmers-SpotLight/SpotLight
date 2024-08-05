import React from 'react';


interface IOneLineInputProps {
  placeholder?: string;
  className?: string;
  id?: string;
  name?: string;
  type?: "text" | "password";
  value?: string;
  isError?: boolean;
  width?: string;
  flexGrow?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
} 

const OneLineInput: React.FC<IOneLineInputProps> = ({ 
  placeholder,
  id,
  name,
  type,
  value,
  isError,
  width,
  flexGrow,
  onChange,
  onBlur,
  onFocus,
  onKeyDown
}) => {
  let className = "border-solid border p-3 rounded-[8px] placeholder:font-medium";
  if (isError) {
    className += " border-red-400";
  } else {
    className += " border-grey2";
  }

  if (width) {
    className += ` ${width}`;
  }
  if (flexGrow) {
    className += " grow";
  }

  return (
    <input 
      className={className}
      placeholder={placeholder}
      id={id}
      name={name}
      type={type || "text"}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
    />
  );
};

export default OneLineInput;