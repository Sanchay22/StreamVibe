import { useState } from 'react';
import * as apiClient from "../apiClient";
import Button from '../components/Button'; // Import your Button component

const VideoUploadForm = () => {
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoFile: null,
    thumbnail: null,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    const file = files[0];
    setFormData({
      ...formData,
      [name]: file,
    });

    if (name === 'thumbnail') {
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result);
      reader.readAsDataURL(file);
    } else if (name === 'videoFile') {
      const reader = new FileReader();
      reader.onloadend = () => setVideoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('title', formData.title);
    formDataToSubmit.append('description', formData.description);
    formDataToSubmit.append('videoFile', formData.videoFile); // Ensure this matches backend field
    formDataToSubmit.append('thumbnail', formData.thumbnail); // Ensure this matches backend field
  
    try {
      const result = await apiClient.uploadVideo(formDataToSubmit);
      console.log('Uploaded:', result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='pt-5 bg-custom-gradient min-h-screen'>
      <div className='flex justify-center items-center w-full min-w-fit'>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <h2 className="text-4xl font-bold text-amber-600 text-center mb-4">Upload Video</h2>

          {/* Video Title */}
          <label className="text-amber-600 text-md font-extrabold">Video Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder='Enter video title'
            className="border border-amber-600 rounded w-full py-2 px-4 font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
          />

          {/* Description */}
          <label className="text-amber-600 text-md font-extrabold">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            placeholder='Enter video description'
            className="border border-amber-600 rounded w-full py-2 px-4 font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
          />

          {/* Video File Upload */}
          <div className="p-2">
            <h2 className="text-lg font-bold text-amber-600 mb-1">Upload Video</h2>
            <input
              type="file"
              name="videoFile"
              accept="video/*"
              onChange={handleFileChange}
              required
              className="border border-amber-600 rounded py-2 px-3 text-amber-600 font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Thumbnail Image Upload */}
          <div className="p-2">
            <h2 className="text-lg font-bold text-amber-600 mb-1">Upload Thumbnail</h2>
            <input
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="border border-amber-600 rounded py-2 px-3 text-amber-600 font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            {thumbnailPreview && (
              <div className="mt-2">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail Preview"
                  className="rounded-lg w-full h-32 object-cover"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button first={"UPLOAD"} second={"THE VIBE"} /> {/* Use your custom Button component */}
        </form>
      </div>
    </div>
  );
};

export default VideoUploadForm;
