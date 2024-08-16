import ColCard from '@/components/common/card/ColCard';
import Pagination from '@/components/search/Pagination';
import SearchEmptyResults from '@/components/search/search-contents/SearchEmptyResults';
import SearchLoading from '@/components/search/search-contents/SearchLoading';
import useFetchUserSelectionList from '@/hooks/queries/useFetchUserSelectionList';
import { IsearchResult, TsortType } from '@/models/searchResult.model';
import { TuserSelection } from '@/models/user.model';
import React from 'react';


export interface IUserSelectionList {
    userId: string;
    userSelectionType: TuserSelection;
    sort: TsortType;
    page: string;
    limit: string;
    isMyPage : boolean
}

const UserSelectionList: React.FC<IUserSelectionList> = ({ userId, userSelectionType, sort, page, limit, isMyPage }) => {    
    const {
        data,
        isLoading,
        isError
    } = useFetchUserSelectionList({
        userId,
        userSelectionType,
        sort,
        page,
        limit,
    });
    if (isLoading) return <SearchLoading height='search' />;
    if (isError) return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
    if (!data) return null;
    
    const selectionList = data as unknown as IsearchResult;
    return (
        <>
          {selectionList.data.length > 0 ? (
            <>
              <div className="grid grid-cols-3 gap-[20px]">
                {selectionList.data.map((item) => (
                  <ColCard key={item.selectionId} {...item} isMyPage={isMyPage}/>
                ))}
              </div>
              <Pagination pagination={selectionList.pagination} />
            </>
          ) : (
            <SearchEmptyResults />
          )}
        </>
    );
};

export default UserSelectionList;
