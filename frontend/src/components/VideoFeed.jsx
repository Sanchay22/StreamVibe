import React, { useState, useEffect } from 'react';
import * as apiClient from '../apiClient';  // Adjust path as needed
import VideoCard from './VideoCard';
const VideoFeed = () => {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // Tracks if more videos are available

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const { videos: newVideos, totalPages } = await apiClient.getAllVideos(page, 10); // Fetch 10 videos per call
      setHasMore(page < totalPages);
  
      // Prevent adding duplicate videos
      setVideos(prevVideos => {
        const newVideoIds = newVideos.map(video => video._id);
        const filteredNewVideos = newVideos.filter(video => !prevVideos.some(v => v._id === video._id));
        return [...prevVideos, ...filteredNewVideos];
      });
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchVideos(); // Initial fetch
  }, []);

  // Handle infinite scroll by listening for scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.scrollHeight - 10 && hasMore && !loading) {
        fetchVideos();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Clean up on component unmount
  }, [loading, hasMore]);

  return (
    <div className="video-feed bg-custom-gradient text-amber-500 h-max">
      {/* Tailwind Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map(video => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
      {loading && <p>Loading more videos...</p>}
    </div>
  )
};

export default VideoFeed;
