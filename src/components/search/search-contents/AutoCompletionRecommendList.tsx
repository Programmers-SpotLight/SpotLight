import useFetchRecommendAutoCompletion from '@/hooks/queries/useFetchRecommendAutoCompletion'
import React from 'react'
import SearchLoading from './SearchLoading'
import Hashtag from '@/components/common/Hashtag'
import { Ihashtags } from '@/models/hashtag.model'

interface IAutoCompletionRecommendList {
  setTagValue : React.Dispatch<React.SetStateAction<string>>
}

const AutoCompletionRecommendList = ({setTagValue} : IAutoCompletionRecommendList) => {
  const {data, isError, isLoading} = useFetchRecommendAutoCompletion()
  if(isError) return <div>Error</div>
  if(isLoading) return <SearchLoading height='medium'/>


  return (
    <div className='p-5'>
    <h1 className='font-bold p-2 text-primary'># 요즘 인기 태그 👍</h1>
    <div className='flex flex-wrap gap-2 mt-[10px]'>
    {
      data &&
      data.map((item : Ihashtags)=>(
        <div className='cursor-pointer hover:scale-105' 
        onClick={()=>setTagValue(item.htag_name)}><Hashtag size='big' name={item.htag_name} key={item.htag_id}/></div>
      ))
    }
    </div>
    </div>
  )
}

export default AutoCompletionRecommendList