import Image from 'next/image'
import React from 'react';
import githubIcon from '../../../public/gitsvg.svg';
import notionIcon from '../../../public/notionsvg.svg';
import Link from 'next/link';

const Footer = () => {
  return (
    <div className="none:container py-10 border-solid border-2 border-gray-200 bg-gray-100">
      <div className='footer-content text-slate-500 font-sans'>
        <h2 className='pb-3 text-2xl text-center font-bold'>Spotlight</h2>
        <p className='text-lg text-center font-medium pb-3'>Spotlight를 통해 일상 속 특별함을 더하세요!</p>
        <div className='flex link-box'>
          <div className='m-auto flex'>
            <Link href={'https://github.com/Programmers-SpotLight/SpotLight'} className='mr-2'>
              <Image 
                src={githubIcon}
                alt={'github image'}
                width={20}
                height={20}
              />
            </Link>
            <Link href={'https://www.notion.so/prgrms/95a04e9503c849a292bdf04f7fcf50e2'}>
              <Image 
                src={notionIcon}
                alt={'github image'}
                width={20}
                height={20}
                />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer