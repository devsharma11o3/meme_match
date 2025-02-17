import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaTrash, FaArrowLeft, FaEye } from "react-icons/fa";
import { GoChevronRight } from "react-icons/go";
import { BsMusicNoteBeamed } from "react-icons/bs";
import { BiSolidCameraMovie } from "react-icons/bi";

import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";


{/* -------------imports for ------------- swiping fuctionality for photo dump---------------- */ }
import "swiper/css";
import "swiper/css/pagination";
import ProfilePreview from "./PreviewProfile";

{/* -------------------------- swiping fuctionality for photo dump---------------- */ }


function ProfileEdit() {
  const navigate = useNavigate();
  const userId = auth.currentUser?.uid;
  const [photos, setPhotos] = useState([]);
  const [artists, setArtists] = useState([]);
  const [movies, setMovies] = useState([]);
  const [basicDetails, setBasicDetails] = useState({
    name: "",
    age:"",
    gender: "",
    pronouns: "",
    work: "",
    college: "",
    hometown: "",
    languages: "",
    datingGoal: "",
  });
  const [moreDetails, setMoreDetails] = useState({
    religiousBeliefs: "",
    height: "",
    drinking: "",
    smoking: "",
  });
  const [bio, setBio] = useState("");
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  // artist and  movies section 
  
  // 
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPhotos(data.photos || []);
        setArtists(data.artists || []);
        setMovies(data.movies || []);
        setBasicDetails({
          name: data.name || "",
          age:data.age ||"",
          gender: data.gender || "",
          pronouns: data.pronouns || "",
          work: data.work || "",
          college: data.college || "",
          hometown: data.hometown || "",
          languages: data.languages || "",
          datingGoal: data.datingGoal || "",
        });
        setMoreDetails({
          religiousBeliefs: data.religiousBeliefs || "",
          height: data.height || "",
          drinking: data.drinking || "",
          smoking: data.smoking || "",
        });
        setBio(data.bio || "");
      }
    };
    fetchProfile();
  }, [userId]);

  const saveProfile = async (updatedData) => {
    if (!userId) return;
    await setDoc(doc(db, "users", userId), updatedData, { merge: true });
  };

  // add pic to cloudnary or remove pic fuctionality-------------------------------------------

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "profile_uploads"); // Replace with your Cloudinary upload preset

    const response = await fetch(`https://api.cloudinary.com/v1_1/djljdlcbf/image/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return data.secure_url;
  };

  const handlePhotoUpload = async (event) => {
    if (photos.length >= 5) return alert("You can upload up to 5 photos only!");
    const file = event.target.files[0];
    if (file) {
      const imageUrl = await uploadToCloudinary(file);
      const newPhotos = [...photos, imageUrl];
      setPhotos(newPhotos);
      saveProfile({ photos: newPhotos });
    }
  };

  const handleRemovePhoto = (index) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    saveProfile({ photos: newPhotos });
  };

  // -------------------------------------------------------------------------------------------

  // ----------------movies or artiest------------------------------------------------------------------



  // --------------------------------------------------------------------------------------------------------
 
  const handleEditField = (field) => {
    setEditingField(field);
    setTempValue(basicDetails[field] || moreDetails[field] || bio);
  };

  const handleSaveField = () => {
    if (basicDetails[editingField] !== undefined) {
      setBasicDetails((prev) => ({ ...prev, [editingField]: tempValue }));
      saveProfile({ [editingField]: tempValue });
    } else if (moreDetails[editingField] !== undefined) {
      setMoreDetails((prev) => ({ ...prev, [editingField]: tempValue }));
      saveProfile({ [editingField]: tempValue });
    }
    else {
      setBio(tempValue);
      saveProfile({ bio: tempValue });
    }
    setEditingField(null);
  };

  return (
    <div className="p-4 bg-blue-100 min-h-screen relative">
      <div className="flex items-center mb-4">
        <button className="text-2xl mr-2 p-1 rounded-full hover:bg-gray-200 transition" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <h1 className="text-xl font-bold">Edit Profile</h1>
      </div>

      {/* Fixed Profile Preview Button */}
      <button
        className="fixed right-4 top-[65vh] bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition flex items-center justify-center"
        onClick={() => setShowPreview(true)}
      >
        <FaEye size={24} />
      </button>

      {/* ------------------------------------------------------------ */}
      <h2 className="font-bold mb-2 text-2xl">Add your photos</h2>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo, index) => (
            <div key={index} className="relative">
              <img src={photo} alt="Profile" className="rounded-lg w-full h-24 object-cover" />
              <button className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-xs" onClick={() => handleRemovePhoto(index)}>
                <FaTrash />
              </button>
            </div>
          ))}
          {/*--------------- ading add pic option------------  */}
          {photos.length < 5 && (
            <label className="flex justify-center items-center border-2 border-dashed border-gray-300 h-24 rounded-lg cursor-pointer">
              <FaCamera className="text-gray-400 text-2xl" />
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
          )}
          {/* -------------------------------------------------- */}
        </div>
      </div>

      

      {/* ------------------------------------------------------------------------------------------- */}
      <div className="mt-4 ">
        <h2 className="font-bold mb-2 text-2xl">Basic Details</h2>
        <div className="bg-white p-2 rounded-lg shadow-md">
          {Object.keys(basicDetails).map((key) => (
            <div key={key} className="flex justify-between items-center p-2 border-b cursor-pointer" onClick={() => handleEditField(key)}>

              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>

              <div className="flex items-center ">
                <span className="text-gray-500">{basicDetails[key] || "Add"} </span>
                <span><GoChevronRight className=" text-blue-400 text-xl" /></span>
              </div>
            </div>
          ))}
        </div>
      </div>
      

      {editingField && (
        <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-md border-t">
          <label className="block text-sm font-semibold mb-2">What's your {editingField.replace(/([A-Z])/g, ' $1')}?</label>
          <input
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button onClick={handleSaveField} className="mt-2 w-full bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-200">
            Save
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      <div className="mt-4">
        <h2 className="font-bold mb-2 text-2xl">More About Me</h2>
      <div className=" bg-white p-4 rounded-lg shadow-md">
        {Object.keys(moreDetails).map((key) => (
          <div key={key} className="flex justify-between items-center p-2 border-b cursor-pointer" onClick={() => handleEditField(key)}>
            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
            <div className="flex items-center">
              <span className="text-gray-500">{moreDetails[key] || "Add"}</span>
              <span><GoChevronRight className=" text-blue-400 text-xl" /></span>
            </div>
          </div>
        ))}
      </div>
      </div>
     
      <div className="mt-4">
      <h2 className="font-bold mb-2 text-2xl">Written Prompts</h2>
        <div className=" bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center  p-2 border-b cursor-pointer" onClick={() => handleEditField("bio")}>Bio: {bio || "Add something about yourself"} <GoChevronRight className=" text-blue-400 text-xl" /></div>
        </div>
      </div>
      

      {editingField && (
        <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-md border-t">
          <label className="block text-sm font-semibold mb-2">What's your {editingField.replace(/([A-Z])/g, ' $1')}?</label>
          <input
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button onClick={handleSaveField} className="mt-2 w-full bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-200">
            Save
          </button>
        </div>
      )}
      {/* ----------movie or artis option ---------------------------------------------------------- */}
      <div className="mt-4">
          <h2 className="font-bold mb-2 text-2xl"> Flaunt your taste</h2>
          <h3 className="text-gary-100 mb-2"> Faviourite music artist, movie and tv shows</h3>
          <div className=" mb-2 bg-white text-blue-400 flex justify-between p-2 rounded-lg shadow-md">
            <div className="flex item-center">
            <span  className="pr-2"><BiSolidCameraMovie className="  text-xl" /></span>
            <span className="pr-2 text-gray-400">Add</span>
            </div>
            <span><GoChevronRight  className="  text-xl" /></span>
            
          </div>
          <div className="bg-white flex justify-between p-2 rounded-lg shadow-md text-blue-400">
            <div className="flex item-center">
            <span  className="pr-2"><BsMusicNoteBeamed className=" text-xl" /></span>
            <span className="pr-2 text-gray-400">Add</span>
            </div>
            <span><GoChevronRight  className=" text-blue-400 text-xl" /></span>
            
          </div>
        </div>

      {/* -------------------------------------------------profile preview content----------------------------------------------------- */}

      {showPreview && (
        <ProfilePreview
          photos={photos}
          basicDetails={basicDetails}
          setShowPreview={setShowPreview}
          moreDetails={moreDetails}
          bio={bio}
          movies={movies}
          artists={artists}

        />
      )}



    </div>
  );
}

export default ProfileEdit;
