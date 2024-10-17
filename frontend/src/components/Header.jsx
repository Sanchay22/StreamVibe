import React from 'react'
import User from './User';
function Header() {
  return (
    <div className='bg-custom-gradient text-amber-500 h-max'>
     <div className='flex'>
        <div>
            <div className='font-bold text-4xl'>
            StreamVibe
            </div>
            <div className='text-2xl font-semibold'>
            Stream Your Story, Share the Vibe
            </div>
        </div>
        <div className='absolute top-4 right-4'>
            <User />
        </div>
     </div>
    </div>
  )
}

export default Header;
