// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaCamera, FaTrash, FaArrowLeft } from "react-icons/fa";
// import { doc, setDoc, getDoc } from "firebase/firestore";
// import { auth, db } from "../firebase";

// function ProfilePage() {
//   const navigate = useNavigate();
//   const userId = auth.currentUser?.uid;
//   const [photos, setPhotos] = useState([]);
//   const [artists, setArtists] = useState([]);
//   const [movies, setMovies] = useState([]);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       if (!userId) return;
//       const docRef = doc(db, "users", userId);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         const data = docSnap.data();
//         setPhotos(data.photos || []);
//         setArtists(data.artists || []);
//         setMovies(data.movies || []);
//       }
//     };
//     fetchProfile();
//   }, [userId]);

//   const saveProfile = async (updatedData) => {
//     if (!userId) return;
//     await setDoc(doc(db, "users", userId), updatedData, { merge: true });
//   };

//   const uploadToCloudinary = async (file) => {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", "profile_uploads"); // Replace with your Cloudinary upload preset
    
//     const response = await fetch(`https://api.cloudinary.com/v1_1/djljdlcbf/image/upload`, {
//       method: "POST",
//       body: formData,
//     });
//     const data = await response.json();
//     return data.secure_url;
//   };

//   const handlePhotoUpload = async (event) => {
//     if (photos.length >= 5) return alert("You can upload up to 5 photos only!");
//     const file = event.target.files[0];
//     if (file) {
//       const imageUrl = await uploadToCloudinary(file);
//       const newPhotos = [...photos, imageUrl];
//       setPhotos(newPhotos);
//       saveProfile({ photos: newPhotos });
//     }
//   };

//   const handleRemovePhoto = (index) => {
//     const newPhotos = photos.filter((_, i) => i !== index);
//     setPhotos(newPhotos);
//     saveProfile({ photos: newPhotos });
//   };

//   const handleAddItem = (list, setList, value, field) => {
//     if (!value.trim()) return;
//     const newData = [...list, value.trim()];
//     setList(newData);
//     saveProfile({ [field]: newData });
//   };

//   return (
//     <div className="p-4 bg-blue-100 min-h-screen">
//       <div className="flex items-center mb-4">
//         <button className="text-2xl mr-2" onClick={() => navigate(-1)}>
//           <FaArrowLeft />
//         </button>
//         <h1 className="text-xl font-bold">Edit Profile</h1>
//       </div>

//       <div className="bg-white p-4 rounded-lg shadow-md">
//         <h2 className="font-semibold mb-2">Add your photos</h2>
//         <div className="grid grid-cols-3 gap-2">
//           {photos.map((photo, index) => (
//             <div key={index} className="relative">
//               <img src={photo} alt="Profile" className="rounded-lg w-full h-24 object-cover" />
//               <button className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-xs" onClick={() => handleRemovePhoto(index)}>
//                 <FaTrash />
//               </button>
//             </div>
//           ))}
//           {photos.length < 5 && (
//             <label className="flex justify-center items-center border-2 border-dashed border-gray-300 h-24 rounded-lg cursor-pointer">
//               <FaCamera className="text-gray-400 text-2xl" />
//               <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
//             </label>
//           )}
//         </div>
//       </div>

//       <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
//         <h2 className="font-semibold mb-2">My Favorite Artists</h2>
//         <input type="text" className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Add an artist..." onKeyDown={(e) => {
//           if (e.key === "Enter") {
//             handleAddItem(artists, setArtists, e.target.value, "artists");
//             e.target.value = "";
//           }
//         }} />
//         <div className="flex flex-wrap mt-2">
//           {artists.map((artist, index) => (
//             <span key={index} className="bg-blue-200 px-2 py-1 rounded-full text-sm m-1 shadow-sm">{artist}</span>
//           ))}
//         </div>
//       </div>

//       <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
//         <h2 className="font-semibold mb-2">My Favorite Movies</h2>
//         <input type="text" className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Add a movie..." onKeyDown={(e) => {
//           if (e.key === "Enter") {
//             handleAddItem(movies, setMovies, e.target.value, "movies");
//             e.target.value = "";
//           }
//         }} />
//         <div className="flex flex-wrap mt-2">
//           {movies.map((movie, index) => (
//             <span key={index} className="bg-green-200 px-2 py-1 rounded-full text-sm m-1 shadow-sm">{movie}</span>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProfilePage;


import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaCheckCircle, FaCamera, FaArrowLeft,FaFilter } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa6";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

function Profile() {
  const navigate = useNavigate();
  const userId = auth.currentUser?.uid;
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUser(docSnap.data());
      }
    };
    fetchUser();
  }, [userId]);

  return (
    <div className="p-4 bg-gradient-to-b from-blue-200 to-white min-h-screen">
      {/* Top Bar */}
      <div className="flex justify-between items-center ">
        <button onClick={() => navigate(-1)} className="text-2xl p-1 rounded-full hover:bg-gray-200 transition">
          <FaArrowLeft />
        </button>
        <h1 className="text-lg font-bold">Profile</h1>
         <button className="text-gray-600 text-xl"> <FaFilter /></button>
      </div>

      {/* Profile Section */}
      <div className="flex flex-col items-center mt-4">
        <div className="relative w-24 h-24">
          <img
            src={user?.photos[0] || "default-profile.jpg"}
            alt="Profile"
            className="rounded-full w-24 h-24 object-cover border-4 border-white shadow-md"
          />
          <button
            className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full"
            onClick={() => navigate("/profileedit")}
          >
            <FaCamera />
          </button>
        </div>
        <p className="mt-2 font-semibold text-lg flex items-center">
          {user?.name || "User"}, {user?.age || "?"}
          <FaCheckCircle className="text-green-500 ml-1" />
        </p>
      </div>

      {/* Feature Buttons */}
      <div className="grid grid-cols-3 gap-2 mt-4 text-center">
        <div className="bg-white p-2 rounded-lg shadow-md">Premium</div>
        <div className="bg-white p-2 rounded-lg shadow-md">Supervibes</div>
        <div className="bg-white p-2 rounded-lg shadow-md">Compliments</div>
      </div>

      {/* Stories Section */}
      <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
        <h2 className="font-semibold mb-2">Our Stories</h2>
        <div className="grid grid-cols-4 gap-2">
          {/* Placeholder story items */}
          {[1, 2, 3, 4].map((_, i) => (
            <div key={i} className="bg-gray-300 h-20 rounded-lg"></div>
          ))}
        </div>
      </div>

      {/* Invite Friends Section */}
      <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
        <h2 className="font-semibold">Get FREE Compliments</h2>
        <p className="text-sm text-gray-600">
          Invite 2 friends and get 2 FREE Compliments once they join.
        </p>
        <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md">
          Invite Friends (0/2)
        </button>
      </div>

      {/* Meme Upload Section */}
      <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
        <h2 className="font-semibold">Are you a meme lord?</h2>
        <p className="text-sm text-gray-600">
          Upload the funniest memes and show off your sense of humor!
        </p>
        <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md">
          <Link to="/upload">Upload Meme</Link>
        </button>
          
      </div>

      {/* Footer */}
      <div className="mt-4 text-left text-xl text-gray-bold-500">
        <p className="text-4xl text-blue-500">Not people.</p>
        <p className="text-4xl text-blue-500">Swipe memes.</p>

        <div className="flex gap-10 mt-2">
          {/* Placeholder social icons */}
          <div className=" w-6 h-6 rounded-full"><Link className="text-2xl"><AiFillInstagram />  </Link></div>
          <div className=" w-10 h-10 rounded-full"><Link className="text-2xl"><FaLinkedinIn /> </Link></div>
          <div className=" w-6 h-6 rounded-full"><Link className="text-2xl"><FaLinkedinIn /></Link></div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
