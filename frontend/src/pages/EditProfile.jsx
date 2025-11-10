import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../lib/api";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Upload, User } from "lucide-react";

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ bio: "", gender: "" });
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ bio: user.bio || "", gender: user.gender || "" });
      setPreview(user.profilePicture || null);
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfilePicture(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("bio", formData.bio);
      data.append("gender", formData.gender);
      if (profilePicture) data.append("profilePhoto", profilePicture);
      const result = await authAPI.editProfile(data);
      if (result.success) {
        updateUser(result.user);
        toast.success(result.message);
        navigate(`/profile/${user._id}`);
      } else {
        toast.error(result.message || "Failed to update profile");
      }
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Profile Picture</label>
          <div className="flex items-center gap-4">
            {preview ? (
              <img
                src={preview}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center border">
                <User className="w-12 h-12 text-gray-500" />
              </div>
            )}
            <label className="flex items-center gap-2 cursor-pointer">
              <Upload className="w-5 h-5" />
              <span className="text-sm">Change photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Bio</label>
          <Input
            type="text"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Write a bio..."
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Gender</label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </div>
  );
};

export default EditProfile;
