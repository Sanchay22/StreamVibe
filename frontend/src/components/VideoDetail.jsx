import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const VideoDetail = () => {
  const location = useLocation();
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  const queryParams = new URLSearchParams(location.search);
  const videoId = queryParams.get('id');

  // Fetch video details using videoId (replace with your actual fetch logic)
  const video = {
    id: videoId,
    url: 'https://path/to/video.mp4',
    thumbnail: 'https://path/to/thumbnail.jpg',
    title: 'Sample Video',
    description: 'This is a sample video description.',
  };

  useEffect(() => {
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
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [video.url, video.thumbnail]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
      <div data-vjs-player>
        <video
          ref={videoRef}
          className="video-js vjs-default-skin vjs-big-play-centered"
        ></video>
      </div>
      <p className="mt-4">{video.description}</p>
    </div>
  );
};

export default VideoDetail;