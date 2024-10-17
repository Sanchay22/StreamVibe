import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div>
      <h1 className='text-3xl ring-offset-indigo-600 bg-neutral-500'>Home Page</h1>
      <img src="../" alt="" />
      <Link to={"/login"}>login</Link>
      <Link to={"/uploadVideo"} > Upload Video</Link>
    </div>
  )
}

export default Home