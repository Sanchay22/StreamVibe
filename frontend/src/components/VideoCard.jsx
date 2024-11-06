import React from "react";

const VideoCard = ({ video }) => {
  // Dynamic accent color (mocking a dynamic color extraction; use libraries like vibrant.js if needed)
  const accentColor = "#ff6347"; // Replace with a color extracted from the thumbnail if possible

  return (
    <div
      className="video-card max-w-xs bg-transparent rounded-lg shadow-lg border-2 hover:shadow-xl hover:scale-105 transition-all duration-300"
      style={{ borderColor: accentColor }}
    >
      {/* Thumbnail */}
      <div className="relative group">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-48 rounded-t-lg object-cover"
        />
        <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-amber-500 text-xs px-2 py-1 rounded-md">
          {video.views} views
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

        <h3 className="mt-2 text-lg font-bold text-amber-500 line-clamp-2">
          {video.title}
        </h3>

        <div className="flex items-center mt-2 space-x-4 text-amber-500 text-sm">
          <span>{new Date(video.createdAt).toLocaleDateString()}</span>

        </div>
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
