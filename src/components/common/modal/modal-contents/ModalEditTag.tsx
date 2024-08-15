import { Ihashtags } from '@/models/hashtag.model'
import React from 'react'
import TextInput from '../../input/TextInput';
import { FaSearch } from 'react-icons/fa';
import Hashtag from '../../Hashtag';

interface ModalAddTagProps {
  hashtags: Ihashtags[]
}
const ModalEditTag = ({hashtags} :ModalAddTagProps) => {

  return (
    <div className='flex flex-col gap-[10px]'>
      <TextInput className='text-grey2' width='full' icon={<FaSearch className='fill-grey3' />} placeholder='검색어를 입력해주세요'/>
      <div className='flex-wrap flex list-none gap-[5px]'>
        {hashtags.map((htag, index)=>(
          <li key={htag.user_htag_id}><Hashtag name={htag.htag_name} size='big' cancelHashtag={()=>{}}/></li>
        ))}

      </div>
    </div>
  )
}

export default ModalEditTag