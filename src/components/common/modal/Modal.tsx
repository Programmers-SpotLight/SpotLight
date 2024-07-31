'use client';

import React, { ReactNode } from 'react';
import { IoClose } from 'react-icons/io5';

export type TModalSize = "small" | "medium" | "large";

interface ModalProps {
    size: TModalSize;
    title: string;
    children: ReactNode;
}

const Modal = ({ size, title, children }: ModalProps) => {
  const getModalSize = () => {
    switch (size) {
      case "small":
        return "w-[335px]";
      case "medium":
        return "w-[514px]";
      case "large":
        return "w-[691px]";
      default:
        return "";
    }
  };

  return (
      <div className={`bg-white rounded p-5 ${getModalSize()} relative max-h-[980px] overflow-y-auto`}>
        <div className='flex justify-between items-center mb-4'>
          {size !== "small" && <div className='mt-[10px] font-bold text-extraLarge'>{title}</div>}
          <div className='top-[10px] right-[10px] absolute'><IoClose className='w-6 h-6' style={{ color: '#063D60' }} /></div>
        </div>
        {size !== "small" && <hr className='mt-4 mb-4'/> }
        <div>
          {children}
        </div>
    </div>
  );
};

export default Modal;
