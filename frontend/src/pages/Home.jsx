import React from 'react'
import { Link } from 'react-router-dom'
import VideoFeed from '../components/VideoFeed';
function Home() {
  // console.log(apiClient.getAllVideos());
  return (
      <div>
      
      <VideoFeed />
    </div>
  )
}

export default Home

//Video uplaod hoti hai to uska result nahi aaata