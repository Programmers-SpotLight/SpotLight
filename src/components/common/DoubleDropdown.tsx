"use client";

import { QUERY_STRING_NAME } from "@/constants/queryString.constants";
import useClickOutside from "@/hooks/useClickOutside";
import {
  IDoubleDropdownOption,
} from "@/models/selection.model";
import { addQueryString, deleteQueryString } from "@/utils/updateQueryString";
import React, { useState, useRef, useEffect } from "react";
import { FaCaretDown } from "react-icons/fa";
import { MdNavigateNext } from "react-icons/md";

interface DropdownProps {
  title: string;
  query?: string;
  contents: IDoubleDropdownOption[];
  onFirstOptionClick?: (id: number | string, name: string) => void;
  onSecondOptionClick?: (id: number | string, name: string) => void;
  initialValue?: string;
}

const DoubleDropdown = ({
  title,
  contents,
  query,
  onFirstOptionClick,
  onSecondOptionClick,
  initialValue
}: DropdownProps) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [items, setItems] = useState<
    IDoubleDropdownOption[]
  >([]);
  const [currentItem, setCurrentItem] = useState<string>(title);
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
    if (query) {
      const addOption = { id: 0, name: `${title} 전체`, options: [] };
      setItems([addOption, ...contents]);
    } else {
      setItems([...contents]);
    }
  }, [contents, query, title]);

  useEffect(() => {
    if (initialValue) {
      setCurrentItem(initialValue);
    }
  }, [initialValue]);

  const handleDropdownToggle = () => {
    setIsClicked((prev) => !prev);
  };

  const handleItemClick = (
    name: string,
    id: number,
    options: { id: number; name: string }[]
  ) => {
    setSubOptions(options);
    if (onFirstOptionClick && name) { // 셀렉션 생성에서 subOption 접근, => 지역 카테고리 접근값 반환
      onFirstOptionClick(id, name);
    }
    setCurrentItem(name); 
    if (query) { // 쿼리가 있는 경우, 검색창에서 접근, => 쿼리스트링 추가 
      deleteQueryString(query);
      deleteQueryString(QUERY_STRING_NAME.page);
      addQueryString(query, id.toString());
    }
  };

  const handleSubItemClick = (name: string, id: number) => {    
    if (onSecondOptionClick) { // 셀렉션 생성에서 subOption 접근, => 지역 카테고리 접근값 반환
      onSecondOptionClick(id, name);
    }
    setCurrentItem(name);
    setIsClicked(false);
    if (query) { // 쿼리가 있는 경우, 검색창에서 접근, => 쿼리스트링 추가 
      deleteQueryString(query);
      deleteQueryString(QUERY_STRING_NAME.page);
      addQueryString(query, id.toString());
    }
    setSubOptions(null);
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
          {currentItem}
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
              {items.map((content : IDoubleDropdownOption) => (
                <li
                  key={content.id}
                  className="p-2 hover:bg-grey1 flex justify-between rounded-lg text-grey4 cursor-pointer"
                  onClick={() => {
                    handleItemClick(
                      content.name,
                      content.id,
                      content.options
                    );
                  }}
                >
                  {content.name}
                  {content.options ? (
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

export default DoubleDropdown;
