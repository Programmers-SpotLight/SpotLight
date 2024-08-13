import React from 'react'
import { IUserSelectionList } from './UserSelectionList'
import useFetchUserSelectionList from '@/hooks/queries/useFetchUserSelectionList';
import { ItempSelectionResult } from '@/models/searchResult.model';
import TempCard from '@/components/common/card/TempCard';

const UserSelectionTempList: React.FC<IUserSelectionList> = ({ userId, userSelectionType, sort, page, limit }) => {
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

    const tempSelectionList = data as unknown as ItempSelectionResult;
    console.log(tempSelectionList)
    return (
    <div>
        {
            tempSelectionList.data.map((item, index)=>(
                <TempCard
                key={item.slt_temp_id}
                title={item.slt_temp_title}
                category={"책"}
                region={"미국"}
                description={"반갑습니다 다시 만나서 더 "}
                selectionId={1}
                created_at='23023-24023-'
            />
            ))
        }

    </div>
  )
}

export default UserSelectionTempList