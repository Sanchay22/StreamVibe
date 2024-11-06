import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import User from './User';

function Header() {
  const location = useLocation();

  return (
    <div className='bg-custom-gradient text-amber-500 h-max'>
      <div className='flex justify-between items-center p-4'>
        <div>
          <Link to="/" className='font-bold text-4xl'>
            StreamVibe
          </Link>
          <div className='text-2xl font-semibold'>
            Stream Your Story, Share the Vibe
          </div>
        </div>
        <div className='flex items-center space-x-4'>
          {location.pathname !== '/uploadvideo' && (
            <Link to="/uploadvideo">
              <button className='bg-amber-600 text-white font-bold py-2 px-4 rounded hover:bg-amber-700 transition-colors duration-300'>
                Upload Video
              </button>
            </Link>
          )}
          <User />
        </div>
      </div>
    </div>
  );
}

export default Header;
