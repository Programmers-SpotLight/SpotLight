"use client";
import { QUERY_STRING_NAME } from "@/constants/queryString";
import useClickOutside from "@/hooks/useClickOutside";
import {
  ISelectionCategory,
  ISelectionLocation
} from "@/models/selection.model";
import { addQueryString, deleteQueryString } from "@/utils/updateQueryString";
import React, { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import { FaCaretDown } from "react-icons/fa";
import { MdNavigateNext } from "react-icons/md";

interface SearchDropdownProps {
  title: string;
  query?: string;
  contents: ISelectionCategory[] | ISelectionLocation[] | any;
  setCategory?: React.Dispatch<
    React.SetStateAction<ISelectionCategory | undefined>
  >;
  setLocation?: Dispatch<SetStateAction<{
    location: undefined | {
        id: number;
        name: string;
    };
    subLocation: undefined | {
        id: number;
        name: string;
    };
}>>
}

const SearchDropdown = ({
  title,
  contents,
  query,
  setCategory,
  setLocation
}: SearchDropdownProps) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [categoryList, setCategoryList] = useState<
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
    if (query) {
      const addOption = { id: 0, name: `${title} 전체` };
      setCategoryList([addOption, ...contents]);
    } else {
      setCategoryList([...contents]);
    }
  }, []);

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
      if (setLocation && name) { // 셀렉션 생성에서 subOption 접근, => 지역 카테고리 접근값 반환
        setLocation((prevState) => ({
          ...prevState,
          location: { id, name }
        }));
      }
    } else {
      setCurrentCategory(name); 
      if (setCategory && name) setCategory({ id, name }); // 셀렉션 생성에서 접근, => 셀렉션 카테고리 접근값 반환
      if (query) { // 쿼리가 있는 경우, 검색창에서 접근, => 쿼리스트링 추가 
        deleteQueryString(query);
        deleteQueryString(QUERY_STRING_NAME.page);
        addQueryString(query, id.toString());
      }
      setIsClicked(false);
      setSubOptions(null);
    }
  };

  const handleSubItemClick = (name: string, id: number) => {    
    if (setLocation && name) { // 셀렉션 생성에서 subOption 접근, => 지역 카테고리 접근값 반환
      setLocation((prevState) => ({
        ...prevState,
        subLocation: { id, name }
      }));
    }
    setCurrentCategory(name);
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
          {currentCategory}
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
              {categoryList.map((content) => (
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
