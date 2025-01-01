import React, { useRef, useEffect } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const VideoCard = ({ video }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    // Initialize Video.js player
    if (!playerRef.current) {
      playerRef.current = videojs(videoRef.current, {
        autoplay: false,
        controls: true,
        responsive: true,
        fluid: true,
        preload: 'auto',
        poster: video.thumbnail,
        sources: [
          {
            src: video.url,
            type: 'video/mp4',
          },
        ],
      });
    }

    return () => {
      // Dispose Video.js player on unmount
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [video.url, video.thumbnail]);

  return (
    <div className="video-card">
      <div className="video-container">
        <div data-vjs-player>
          <video
            ref={videoRef}
            className="video-js vjs-default-skin vjs-big-play-centered"
          ></video>
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
          <div className="text-gray-900 font-semibold">{video.owner.username}</div>
        </div>

        <h3 className="mt-2 text-lg font-bold text-gray-900 line-clamp-2">
          {video.title}
        </h3>
      </div>
    </div>
  );
};

export default VideoCard;