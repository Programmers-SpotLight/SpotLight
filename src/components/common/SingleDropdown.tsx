"use client";

import { QUERY_STRING_NAME } from "@/constants/queryString.constants";
import useClickOutside from "@/hooks/useClickOutside";
import {
  ISingleDropdownOption
} from "@/models/selection.model";
import { addQueryString, deleteQueryString } from "@/utils/updateQueryString";
import React, { useState, useRef, useEffect } from "react";
import { FaCaretDown } from "react-icons/fa";


interface IDropdownProps {
  title: string;
  query?: string;
  contents: ISingleDropdownOption[];
  initialValue?: string;
  onClick?: (id: string | number, name: string) => void;
}

const SingleDropdown = ({
  title,
  contents,
  query,
  initialValue,
  onClick
}: IDropdownProps) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [items, setItems] = useState<
    ISingleDropdownOption[]
  >([]);
  const [currentValue, setCurrentValue] = useState<string>(title);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => {
    setIsClicked(false);
  });

  useEffect(() => {
    if (query) {
      const addOption = { id: 0, name: `${title} 전체` };
      setItems([addOption, ...contents]);
    } 
    else {
      setItems(contents);
    }
  }, [contents, query, title]);

  useEffect(() => {
    if (initialValue) {
      setCurrentValue(initialValue);
    }
  }, [initialValue]);

  const handleDropdownToggle = () => {
    setIsClicked((prev) => !prev);
  };

  const handleItemClick = (
    name: string,
    id: number | string,
  ) => {
    onClick && onClick(id, name);
    setCurrentValue(name); 
    if (query) { // 쿼리가 있는 경우, 검색창에서 접근, => 쿼리스트링 추가 
      deleteQueryString(query);
      deleteQueryString(QUERY_STRING_NAME.page);
      addQueryString(query, id.toString());
    }
    setIsClicked(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <div
        className="relative flex gap-[10px] cursor-pointer"
        onClick={handleDropdownToggle}
      >
        <div
          className={`${
            query
              ? "text-extraLarge font-extrabold text-black"
              : "text-medium text-black font-bold"
          }
          ${isClicked ? "text-primary" : "text-black"}
          `}
        >
          {currentValue}
        </div>
        <FaCaretDown
          className={` ${isClicked ? "text-primary" : "text-black"} ${
            query ? "w-6 h-6" : "w-3 h-3"
          }`}
        />
      </div>
      {isClicked && (
        <div className="absolute top-full mt-2 bg-white z-10 border border-solid border-grey2 rounded-lg flex">
          <div className="p-5 w-[369px]">
            <h1 className="text-large font-extrabold">{title}</h1>
            <hr className="mt-5 mb-[10px] border-grey2" />
            <ul className="list-none p-2 min-h-[200px] overflow-y-auto">
              {items.map((content) => (
                <li
                  key={content.id}
                  className="p-2 hover:bg-grey1 flex justify-between rounded-lg text-grey4 cursor-pointer"
                  onClick={() => {
                    handleItemClick(
                      content.name,
                      content.id,
                    );
                  }}
                >
                  {content.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleDropdown;
