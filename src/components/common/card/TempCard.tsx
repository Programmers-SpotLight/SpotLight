import React from 'react'

interface ITempCard {
  title : string,
  category? : string,
  region? : string,
  description? : string,
  selectionId? : number,
  created_at? : string,

}

const TempCard = ({title, category, region, description, selectionId, created_at} : ITempCard) => {
  return (
    <div className='flex gap-5'>
    <div className='flex-[0.8] h-[110px] p-5 bg-white border border-solid border-grey2 rounded-lg'>
      <div className='flex justify-between'>
      <h1 className='font-bold text-medium text-black'>{title}</h1>
      <h4 className='font-light text-extraSmall text-grey3'>{created_at}</h4>
      </div>
      <div className='flex gap-[5px]'>
        <h3 className='text-extraSmall font-semibold text-grey3'>{category}</h3>
        <h3 className='text-extraSmall font-semibold text-grey3'>{region}</h3>
      </div>
      <div className='text-extraSmall font-medium text-grey4 h-[30px]'>
    {description}
      </div>
    </div>
    <div className='flex-[0.2] bg-yellow-300'>

    </div>
    </div>
  )
}

export default TempCard