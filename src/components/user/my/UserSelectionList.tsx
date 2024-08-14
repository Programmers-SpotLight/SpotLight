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
}

const UserSelectionList: React.FC<IUserSelectionList> = ({ userId, userSelectionType, sort, page, limit }) => {    
    const {
        data,
        isLoading,
        isError
    } = useFetchUserSelectionList({
        userId,
        userSelectionType,
        sort,
        page,
        limit
    });

    if (isLoading) return <SearchLoading />;
    if (isError) return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
    if (!data) return null;
    const selectionList = data as unknown as IsearchResult;
    return (
        <>
          {selectionList.data.length > 0 ? (
            <>
              <div className="grid grid-cols-3 gap-[20px]">
                {selectionList.data.map((item) => (
                  <ColCard
                    key={item.slt_id}
                    thumbnail={item.slt_img}
                    category={item.slt_category_name}
                    region={item.slt_location_option_name}
                    selectionId={item.slt_id}
                    hashtags={item.slt_hashtags}
                    description={item.slt_description}
                    title={item.slt_title}
                    userName={item.user_nickname}
                    userImage={item.user_img}
                    status={item.slt_status}
                  />
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
