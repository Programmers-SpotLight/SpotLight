"use client";

import useClickOutside from "@/hooks/useClickOutside";
import { addQueryString, deleteQueryString } from "@/utils/updateQueryString";
import React, { useState, useRef, useEffect } from "react";
import { FaCaretDown } from "react-icons/fa";
import { MdNavigateNext } from "react-icons/md";

interface SearchDropdownProps {
  title: string;
  query : string;
  contents: {
    name: string;
    id: number;
  }[];
}

const SearchDropdown = ({ title, contents, query }: SearchDropdownProps) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<string>(title);
  const dropdownRef = useRef<HTMLDivElement>(null); 
  useClickOutside(dropdownRef, setIsClicked)

  const handleDropdownToggle = () => {
    setIsClicked((prev) => !prev);
  };

  const handleItemClick = (name: string, id: number) => {
    setCurrentCategory(name);
    setIsClicked(false);
    deleteQueryString(query);
    addQueryString(query,id.toString());
  };


  return (
    <div ref={dropdownRef} className="relative">
      <div
        className="relative flex gap-[10px] cursor-pointer "
        onClick={handleDropdownToggle}
      >
        <div
          className={`text-extraLarge font-extrabold ${
            isClicked ? "text-primary" : "text-black"
          }`}
        >
          {currentCategory}
        </div>
        <FaCaretDown
          className={`w-6 h-6 ${isClicked ? "text-primary" : "text-black"}`}
        />
      </div>
      {isClicked && ( // 드롭다운 클릭시 출력
        <div className="absolute top-full p-5 mt-2 bg-white w-[369px] h-[315px] z-10 border border-solid border-grey2 rounded-lg">
          <h1 className="text-large font-extrabold">{title}</h1>
          <hr className="mt-5 mb-[10px] border-grey2" />
          <ul className="list-none p-2 h-[200px] overflow-y-auto">
            {contents.map((content) => (
              <li
                key={content.id}
                className="p-2 hover:bg-grey1 flex justify-between rounded-lg text-grey4 cursor-pointer"
                onClick={() => {
                  handleItemClick(content.name, content.id);
                }}
              >
                {content.name}
                <MdNavigateNext className="w-[15px] h-[20px] font-bold" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
