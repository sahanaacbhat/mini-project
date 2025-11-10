import { useState } from 'react';
import { postAPI } from '../lib/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Upload, X } from 'lucide-react';

const CreatePost = () => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error('Please select an image');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('caption', caption);

      const result = await postAPI.createPost(formData);
      if (result.success) {
        toast.success(result.message);
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
      <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Image</label>
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-500">Click to upload image</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Caption</label>
          <Input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            className="w-full"
          />
        </div>

        <Button type="submit" disabled={loading || !image} className="w-full">
          {loading ? 'Creating...' : 'Create Post'}
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;

