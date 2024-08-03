'use client';

import React, { useState } from 'react'
import { FaCaretDown } from 'react-icons/fa'

interface SearchDropdownProps {
    title: string,
    contents: {
        name: string,
        id: number
    }[]
}

const SearchDropdown = ({ title, contents }: SearchDropdownProps) => {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div 
      className='relative flex gap-[10px] cursor-pointer'
      onClick={() => setIsClicked((prev) => !prev)}
    >
      <div className={`text-extraLarge font-extrabold ${isClicked ? 'text-primary' : 'text-black'}`}>{title}</div>
      <FaCaretDown className={`w-6 h-6 ${isClicked ? 'text-primary' : 'text-black'}`}/>
      {isClicked && (
        <div className='absolute top-full p-5 mt-2 bg-white w-[369px] z-50 border border-solid border-grey2 rounded-lg'>
          <h1 className='text-large'></h1>
          <ul className='list-none p-2'>
            {contents.map(content => (
              <li key={content.id} className='p-2 hover:bg-gray-200'>
                {content.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchDropdown;
