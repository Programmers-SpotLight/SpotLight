"use client";

import useClickOutside from "@/hooks/useClickOutside";
import {
  ISelectionCategory,
  ISelectionLocation
} from "@/models/selection.model";
import { addQueryString, deleteQueryString } from "@/utils/updateQueryString";
import React, { useState, useRef, useEffect } from "react";
import { FaCaretDown } from "react-icons/fa";
import { MdNavigateNext } from "react-icons/md";

interface SearchDropdownProps {
  title: string;
  query: string;
  contents: ISelectionCategory[] | ISelectionLocation[];
}

const SearchDropdown = ({ title, contents, query }: SearchDropdownProps) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [searchContents, setSearchContents] = useState<
    ISelectionLocation[] | ISelectionCategory[]
  >([]);
  const [currentCategory, setCurrentCategory] = useState<string>(title);
  const [subOptions, setSubOptions] = useState<
    { id: number; name: string }[] | null
  >(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const subOptionsRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => {
    setIsClicked(false);
    setSubOptions(null);
  });

  useEffect(() => {
    const allOption = { id: 0, name: `${title} 전체` };
    setSearchContents([allOption, ...contents]);
  }, [contents, title]);

  const handleDropdownToggle = () => {
    setIsClicked((prev) => !prev);
  };

  const handleItemClick = (
    name: string,
    id: number,
    options?: { id: number; name: string }[]
  ) => {
    if (options && options.length > 0) {
      setSubOptions(options);
    } else {
      setCurrentCategory(name);
      setIsClicked(false);
      deleteQueryString(query);
      addQueryString(query, id.toString());
      setSubOptions(null);
    }
  };

  const handleSubItemClick = (name: string, id: number) => {
    setCurrentCategory(name);
    setIsClicked(false);
    deleteQueryString(query);
    addQueryString(query, id.toString());
    setSubOptions(null);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <div
        className="relative flex gap-[10px] cursor-pointer"
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
      {isClicked && (
        <div className="absolute top-full mt-2 bg-white z-10 border border-solid border-grey2 rounded-lg flex">
          <div className="p-5 w-[369px]">
            <h1 className="text-large font-extrabold">{title}</h1>
            <hr className="mt-5 mb-[10px] border-grey2" />
            <ul className="list-none p-2 min-h-[200px] overflow-y-auto">
              {searchContents.map((content) => (
                <li
                  key={content.id}
                  className="p-2 hover:bg-grey1 flex justify-between rounded-lg text-grey4 cursor-pointer"
                  onClick={() => {
                    handleItemClick(
                      content.name,
                      content.id,
                      (content as ISelectionLocation).options
                    );
                  }}
                >
                  {content.name}
                  {(content as ISelectionLocation).options ? (
                    <MdNavigateNext className="w-[15px] h-[20px] font-bold" />
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
          {subOptions && (
            <div
              ref={subOptionsRef}
              className="p-5 w-[369px] white rounded-r-lg"
            >
              <h1 className="text-large font-extrabold">지역 상세</h1>
              <hr className="mt-5 mb-[10px] border-grey2" />
              <ul className="list-none p-2 max-h-[200px] overflow-y-auto">
                {subOptions.map((option) => (
                  <li
                    key={option.id}
                    className="p-2 hover:bg-grey2 flex justify-between rounded-lg text-grey4 cursor-pointer"
                    onClick={() => handleSubItemClick(option.name, option.id)}
                  >
                    {option.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
