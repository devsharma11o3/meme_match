import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import app from "../firebase";
import { FaUpload, FaSpinner, FaArrowLeft } from "react-icons/fa";

const db = getFirestore(app);

function MemeUpload() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ✅ Hook for navigation

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!image) return alert("⚠️ Please select an image!");

    setLoading(true);

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "meme_uploads");

    try {
      const response = await axios.post(
        import.meta.env.VITE_CLOUDINARY_URL,
        formData
      );

      const imageURL = response.data.secure_url;
      // console.log("✅ Uploaded Meme URL:", imageURL);
      console.log("✅ Uploaded Meme URL:");

      await addDoc(collection(db, "memes"), {
        imageURL,
        caption,
        likes: 0,
        likedBy: [],
        dislikedBy: [],
        createdAt: serverTimestamp(),
      });

      alert("🎉 Meme Uploaded Successfully!");

      // Reset inputs
      setImage(null);
      setImagePreview(null);
      setCaption("");
      document.getElementById("meme-upload-input").value = "";
    } catch (error) {
      console.error("❌ Upload failed:", error);
      alert("⚠️ Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 relative">
      
      {/* Back Button (Top Left) */}
      <button 
        className="absolute top-4 left-4 text-gray-700 text-2xl p-2 rounded-full hover:bg-gray-200 transition"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft />
      </button>

      <div className="bg-white shadow-lg rounded-xl p-6 w-96 text-center">
        <h2 className="text-xl font-bold mb-4">📤 Upload a Meme</h2>

        {/* Image Preview */}
        {imagePreview ? (
          <img src={imagePreview} alt="Preview" className="w-full h-56 object-cover rounded-lg mb-4" />
        ) : (
          <div className="w-full h-56 flex items-center justify-center bg-gray-200 rounded-lg mb-4 text-gray-500">
            No image selected
          </div>
        )}

        {/* File Input */}
        <input
          id="meme-upload-input"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        <label htmlFor="meme-upload-input" className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-200">
          Select Image <FaUpload className="inline ml-2" />
        </label>

        {/* Caption Input */}
        <input
          type="text"
          placeholder="Enter a cool caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="mt-3 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className={`mt-4 w-full p-2 rounded-lg shadow-md ${
            loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
          } text-white transition duration-200`}
        >
          {loading ? <FaSpinner className="animate-spin inline mr-2" /> : "Upload Meme"}
        </button>
      </div>
    </div>
  );
}

export default MemeUpload;
