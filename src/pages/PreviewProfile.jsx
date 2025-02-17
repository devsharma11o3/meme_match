import React, { useState } from "react";
{/* -------------imports for ------------- swiping fuctionality for photo dump---------------- */ }
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { auth, db } from "../firebase";
import { arrayUnion, updateDoc, doc } from "firebase/firestore";
import { FaHeart, FaTimes, FaCommentDots, FaRobot, FaUsers, FaFilter } from "react-icons/fa";



function ProfilePreview({ photos, basicDetails,moreDetails,bio,artists,movies, setShowPreview,value,matchedUser }) {
  // const [showButton, setShowButton]=useState(false);
  // setShowButton( value);
  
  // const auth = getAuth(app);
  const userId = auth.currentUser?.uid;
  // console.error("Invalid matchedUserData:",matchedUser.uid);

  const handleMatchDislike = async () => {

    if (!userId || !matchedUser.uid) return;

    const userRef = doc(db, "users", matchedUser.uid);

    await updateDoc(userRef, {
      dislikedUsers: arrayUnion(userId), // Add matched user to disliked list
    });

    setShowPreview(false); // Close the popup
  };

  const handleMatchLike = async () => {
    if (!userId || !matchedUser?.uid) return;

    const userRef = doc(db, "users", matchedUser.uid);

    await updateDoc(userRef, {
      pendingMatches: arrayUnion(userId), // Send match request
    });

    setShowPreview(false); // Close the popup
  };
  

  return (
    <div className="fixed bottom-0 left-0 w-full h-[93vh] bg-green-100 shadow-lg rounded-t-3xl p-4 overflow-y-auto">
    <button
      className="absolute top-2 right-4 text-2xl text-gray-600 hover:text-gray-900"
      onClick={() => setShowPreview(false)}
    >
      ✕
    </button>

    {/* Profile Preview Content */}

    <div className="ml-6 relative max-w-full w-[300px] h-[360px] overflow-hidden rounded-2xl shadow-lg group bg-green-100">
      {photos.length > 0 && (
        <img
          src={photos[0]}
          alt="Profile"
          className="w-full h-full object-cover rounded-2xl"
        />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent">

        {/* User Info - Placed Inside the Overlay */}
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-lg font-semibold flex items-center">
            {basicDetails.name}, {basicDetails.age}
            <span className="ml-1 text-green-400">✔</span>
          </h2>
          <p className="text-gray-1000 text-sm bg-black/40 px-2 py-1 rounded-lg w-fit mt-1">
            {basicDetails.pronouns}
          </p>
        </div>
      </div>
    </div>


    <div className="mt-4 p-3 bg-green-200 rounded-lg text-sm">
      <p>⚡ Looks empty! Complete your profile to stand out.</p>
    </div>
    <div className="mt-4 p-3 bg-green-200 rounded-lg text-sm">
      <div className="mt-4 border-b">
        <h3 className="font-semibold">Work</h3>
        <p className="text-gray-600 pb-1">{basicDetails.work}</p>
      </div>

      <div className="mt-4 border-b">
        <h3 className="font-semibold">College</h3>
        <p className="text-gray-600 pb-1">{basicDetails.college}</p>
      </div>

      <div className="mt-4 border-b">
        <h3 className="font-semibold">Languages I Know</h3>
        <p className="text-gray-600 pb-1">{basicDetails.languages}</p>
      </div>
    </div>
    {/* -------------------------- swiping fuctionality for photo dump---------------- */}

    <div className="mt-4 bg-green-100 p-4 rounded-2xl">
      <h3 className="font-semibold text-lg">My Photo Dump</h3>

      {/* Progress Indicators */}
      <div className="flex gap-2 mt-2 relative max-w-full w-[300px]">
        {photos.map((_, index) => (
          <div key={index} className="h-1 flex-1 bg-gray-300  rounded-full"></div>
        ))}
      </div>

      {/* Swiper Slider */}
      <div className="relative max-w-full w-[300px] h-[360px] mt-2">
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          pagination={{ clickable: true }}
          navigation={{
            prevEl: ".prev-btn",
            nextEl: ".next-btn",
          }}
          modules={[Pagination, Navigation]}
          className="rounded-2xl"
        >
          {photos.map((photo, index) => (
            <SwiperSlide key={index + 1}>
              <img src={photo} alt="" className="relative max-w-full w-[300px] h-[360px] object-cover rounded-2xl" />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        <button className="prev-btn absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full">
          <ChevronLeft className="text-white" />
        </button>
        <button className="next-btn absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full">
          <ChevronRight className="text-white" />
        </button>
      </div>
    </div>

    {/* -------------------------- swiping fuctionality foe photo dump---------------- */}
    <div className="mt-4 mr-2 p-3 bg-green-200 rounded-lg text-sm ">
      <h3 className="font-semibold">Dating goal</h3>
      <p className="text-gray-600">{basicDetails.datingGoal ||""}</p>
    </div>



    <div className="flex warp">
      <div className="mt-4 mr-2 p-3 bg-green-200 rounded-lg text-sm ">
        <h3 className="font-semibold">Beliefs </h3>
        <p className="text-gray-600">{moreDetails.religiousBeliefs ||""}</p>
      </div>

      <div className="mt-4 mr-2 p-3 bg-green-200 rounded-lg text-sm ">
        <h3 className="font-semibold">Drink</h3>
        <p className="text-gray-600">{moreDetails.drinking||""}</p>
      </div>

      <div className="mt-4 mr-2 p-3 bg-green-200 rounded-lg text-sm ">
        <h3 className="font-semibold">Smoke</h3>
        <p className="text-gray-600">{moreDetails.smoking ||""}</p>
      </div>

      <div className="mt-4 mr-2 p-3 bg-green-200 rounded-lg text-sm ">
        <h3 className="font-semibold">Height</h3>
        <p className="text-gray-600">{moreDetails.height ||""}</p>
      </div>
    </div>

    <div className="mt-4 p-3 bg-green-200 rounded-lg text-sm ">
      <h3 className="font-semibold">Bio</h3>
      <p className="text-gray-600">{bio||""}</p>
    </div>

    {/* <div className="mt-4 p-3 bg-green-200 rounded-lg text-sm">
      <h3 className="font-semibold">My Binge List</h3>
      <div className="grid grid-cols-3 gap-2">
        {movies.map((movie, index) => (
          <div key={index} className="p-2 bg-gray-100 rounded-lg text-center">
            {movie||""}
          </div>
        ))}
      </div>
    </div>

    <div className="mt-4 p-3 bg-green-200 rounded-lg text-sm">
      <h3 className="font-semibold">My Playlist</h3>
      <div className="grid grid-cols-3 gap-2">
        {artists.map((artist, index) => (
          <div key={index} className="p-2 bg-gray-100 rounded-lg text-center">
            {artist||""}
          </div>
        ))}
      </div>
    </div> */}

    {/* {showButton()} */}
    {/* Like & Dislike Buttons */}
    {value && (<div className="flex justify-between mt-4">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-full shadow-lg"
          onClick={handleMatchDislike}
        >
          <FaTimes /> Dislike
        </button>

        <button
          className="bg-green-500 text-white px-4 py-2 rounded-full shadow-lg"
          onClick={handleMatchLike}
        >
          <FaHeart /> Like
        </button>
      </div>)}
      
  </div>
  );
}

export default ProfilePreview;
