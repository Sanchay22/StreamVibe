import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const VideoCard = ({ video }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/video?id=${video.id}`);
  };

  return (
    <div className="video-card" onClick={handleClick}>
      <div className="video-container relative group">
        <div data-vjs-player>
          <video
            className="video-js vjs-default-skin vjs-big-play-centered"
            controls
            preload="auto"
            poster={video.thumbnail}
          >
            <source src={video.url} type="video/mp4" />
          </video>
        </div>
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-amber-500 text-xs px-2 py-1 rounded-md">
          {formatDuration(video.duration)}
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-white text-center px-4">{video.description}</span>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4">
        <div className="flex items-center space-x-2">
          <img
            src={video.owner.avatar}
            alt={video.owner.username}
            className="w-10 h-10 rounded-full border-2 border-gray-200"
          />
          <div className="text-amber-500 font-semibold">{video.owner.username}</div>
        </div>

        <h3 className="mt-2 text-lg font-bold text-gray-900 line-clamp-2">
          {video.title}
        </h3>
      </div>
    </div>
  );
};

// Utility function to format duration (example: 75 seconds -> "1:15")
const formatDuration = (duration) => {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export default VideoCard;
