import React, { ReactNode } from 'react';

interface IButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const Button: React.FC<IButtonProps> = ({ 
  children, 
  onClick, 
  type = 'button', 
  className = '' 
}) => {
  return (
    <button
      type={type}
      className={`btn btn-primary ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
