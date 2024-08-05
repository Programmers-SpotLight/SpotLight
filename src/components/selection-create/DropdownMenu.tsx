'use client';

import useOutsideClick from "@/hooks/useOutsideClick";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";


interface IDropdownMenuProps {
  onChange: (categoryId: string) => void;
  options: Array<{
    value: any,
    label: string
  }> | undefined;
  currentChoice?: any;
}

const DropdownMenu : React.FC<IDropdownMenuProps> = ({
  onChange,
  options,
  currentChoice
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>("선택하세요");
  
  const categoryMenuElement = useRef<HTMLDivElement>(null);

  // 만약에 바깥을 클릭하면 닫히게 하기
  useOutsideClick({
    ref: categoryMenuElement,
    isVisible: isOpen,
    onClose: () => setIsOpen(false)
  });

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelected(e.currentTarget.textContent || "");
    onChange(e.currentTarget.id);
  }

  useEffect(() => {
    if (currentChoice !== undefined) {
      setSelected(currentChoice);
    }
  }, [currentChoice]);

  return (
    <div 
      className="relative w-fit"
      ref={categoryMenuElement}
    >
      <button 
        className="text-medium font-bold flex gap-2 items-center text-[#02588E] relative min-w-[50px]"
        onClick={toggleDropdown}
      >
        {selected}
        <Image 
          src={isOpen ? "/icons/arrow_drop_down_02588E.svg" : "/icons/arrow_drop_up_02588E.svg"} 
          width={48} 
          height={48} 
          alt={isOpen ? "arrow-down" : "arrow-up"} 
          className="p-0 absolute right-[-75px]"
        />
      </button>
      {(isOpen && options) && (
        <div 
          className="w-[170px] max-h-[175px] p-4 bg-white absolute top-[25px] rounded-[8px] border-solid border border-grey2 text-small text-grey4 overflow-y-auto z-20"
        >
          {options.map((option, index) => (
            <button 
              key={index}
              id={option.value}
              className="w-full font-bold text-left flex justify-between items-center py-1"
              onClick={handleSelect}
            >
              {option.label}
              <Image src="/icons/arrow_forward_7C7C7C.svg" width={20} height={20} alt="check"/>
            </button>
          ))}
        </div>
      )}
    </div>
  )
};

export default DropdownMenu;