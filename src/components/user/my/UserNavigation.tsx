'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const userNavigationListData = [
  { name: '셀렉션 관리', url: '/' },
  { name: '리뷰 관리', url: '/review' }];

const UserNavigation: React.FC = () => {
  const currentPath = usePathname();

  const getUserIdFromPath = (path: string) => {
    const parts = path.split('/');
    return parts[2];
  };

  const userId = getUserIdFromPath(currentPath);
  const currentEndpoint = currentPath.split('/').pop();

  return (
    <div className='w-[180px] px-10 flex flex-col h-full gap-10 list-none pt-[20px] box-border'>
      {userNavigationListData.map((item) => {
        const itemEndpoint = item.url.split('/').pop();
        const fullUrl = item.url === '/' ? `/user/${userId}` : `/user/${userId}${item.url}`;
        const isActive = (item.url === '/' && currentPath === `/user/${userId}`) || currentEndpoint === itemEndpoint;

        return (
          <li key={item.url}>
            <Link
              href={fullUrl}
              className={`${
                isActive ? 'text-medium text-center text-black font-bold' : 'text-medium text-grey3 font-bold text-center hover:text-black'
              }`}
            >
              {item.name}
            </Link>
          </li>
        );
      })}
    </div>
  );
}

export default UserNavigation;
