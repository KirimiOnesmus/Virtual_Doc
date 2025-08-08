import React from 'react'

const Card = ({title,value}) => {
  return (
    <div>
        <div className=' flex flex-col bg-gray-100 shadow-md rounded-xl p-6 gap-4 justify-between hover:shadow-lg transition-shadow duration-200 cursor-pointer'>
            <h2 className='text-md font-medium text-gray-700 '>{title}</h2>
            <p className='text-lg font-semibold'>{value}</p>
        </div>
        
    </div>
  )
}

export default Card