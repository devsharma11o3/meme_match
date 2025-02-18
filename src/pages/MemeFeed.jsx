import { useEffect, useState } from "react";
import { arrayUnion, collection, getDocs, updateDoc, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { FaHeart, FaTimes, FaCommentDots, FaRobot, FaUsers, FaFilter } from "react-icons/fa";
import { RiLogoutCircleFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { logout } from "../auth";
import TinderCard from "react-tinder-card";
import MatchFinder from "./MatchFinder"; // Import match finder
import ProfilePreview from "./PreviewProfile";
import Filter from "./Filter"; // Make sure this is imported


function MemeFeed() {
  const [memes, setMemes] = useState([]);
  const [swipedMemes, setSwipedMemes] = useState(new Set());
  const [profileImage, setProfileImage] = useState(""); // State for profile image
  const [matchedUser, setMatchedUser] = useState(null);
  const [showMatchPopup, setShowMatchPopup] = useState(false);
  // const [matchDislike, handleMatchDislike]=useState();
  const [count, setCount] = useState(0);
  const [filters, setFilters] = useState(null);
  const userId = auth.currentUser?.uid;

//   // Inside MemeFeed component
// const [filters, setFilters] = useState({
//   gender: { male: false, female: false, other: false },
//   distance: 50,
//   ageRange: [18, 40],
// });

// const handleApplyFilters = (newFilters) => {
//   setFilters(newFilters);
//   console.log("Filters applied:", newFilters);
// };

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!userId) return;

      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        setProfileImage(userData.photos[0] || "https://via.placeholder.com/40");
      }
    };

    const fetchMemes = async () => {
      if (!userId) return;

      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.exists() ? userSnap.data() : { likedMemes: [], dislikedMemes: [] };
      const alreadySwipedMemes = new Set([...userData.likedMemes, ...userData.dislikedMemes]);

      const querySnapshot = await getDocs(collection(db, "memes"));
      const memeList = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(meme => !alreadySwipedMemes.has(meme.id));

      setMemes(memeList);
      setSwipedMemes(alreadySwipedMemes);
    };

    const fetchFilters = async () => {
      if (!userId) return;
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setFilters(userData.filters || {});
      }
    };
    fetchProfileImage();
    fetchMemes();
    fetchFilters();
  }, [userId]);


// 


  const handleSwipe = async (direction, meme) => {
    if (!userId) return alert("You must be logged in to swipe!");
    const memeRef = doc(db, "memes", meme.id);
    const userRef = doc(db, "users", userId);
    // count=count+1;
    setCount(count+1);
    if (direction === "right") {
      await updateDoc(memeRef, {
        likes: meme.likes + 1,
        likedBy: arrayUnion(userId),
      });
      await updateDoc(userRef, {
        likedMemes: arrayUnion(meme.id),
      });
    } else if (direction === "left") {
      await updateDoc(userRef, {
        dislikedMemes: arrayUnion(meme.id),
      });
    }

    setSwipedMemes(new Set([...swipedMemes, meme.id]));
    setMemes(prev => prev.filter(m => m.id !== meme.id));
  };

  const handleButtonSwipe = (direction) => {
    if (memes.length > 0) {
      handleSwipe(direction, memes[0]);
    }
  };
  const handleMatchFound = (matchedUserData) => {
    if (!matchedUserData || !matchedUserData.uid) {
      // console.error("Invalid matchedUserData:", matchedUserData);
      return;
    }
    setMatchedUser(matchedUserData);
    setShowMatchPopup(true);
  };
  

  return (
    <div className="flex flex-col h-screen bg-blue-100">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white shadow-md">
        <button className="relative">
          <Link to="/profile">
            <img
              src={profileImage|| ""} // Display profile image
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <span className="absolute -top-1 -right-1 bg-yellow-400 text-xs font-bold rounded-full px-1">90%</span>
          </Link>
        </button>
        <h1 className="text-xl font-bold">🔥 Meme Match</h1>
        <button className="text-gray-600 text-xl">
        <Link to="/filter">
          <FaFilter />
        </Link>
        </button>
        
      </div>

      {/* Meme Swipe Feed */}
      <div className="flex-grow relative flex items-center justify-center overflow-hidden">
        {memes.length > 0 ? (
          memes.map((meme) => (
            <TinderCard
              key={meme.id}
              className="absolute w-96 h-96 rounded-2xl shadow-md bg-white overflow-hidden"
              onSwipe={(dir) => handleSwipe(dir, meme)}
              preventSwipe={["up", "down"]}
            >
              <img src={meme.imageURL} alt="Meme" className="rounded-2xl w-full h-full object-cover" />
            </TinderCard>
          ))
        ) : (
          <p className="text-gray-500">No more memes to show</p>
        )}
      </div>

      {/* Swipe Buttons */}
      {/* <div className="flex justify-center gap-10 py-4">
        <button 
          className="bg-red-500 text-white p-4 rounded-full shadow-lg text-2xl"
          onClick={() => handleButtonSwipe("left")}
        >
          <FaTimes />
        </button>
        <button 
          className="bg-green-500 text-white p-4 rounded-full shadow-lg text-2xl"
          onClick={() => handleButtonSwipe("right")}
        >
          <FaHeart />
        </button>
      </div> */}

      {/* Match Popup */}
         {/* Match Finder */}
      {count>=10 && (

      <MatchFinder onMatchFound={handleMatchFound} filters={filters} />
      
      )}

      {/* Match Popup */}
      {showMatchPopup && matchedUser && (
         <div className="fixed bg-green-100 ">
          <div className="flex justify-center p-2">

          <h1 className="font-bold mb-2 text-4xl"> Profilerec#</h1>
          </div>
         <div className=" rounded-lg w-96">
           
           <ProfilePreview
              
              photos={matchedUser.photos || []}
              basicDetails={matchedUser || {}}
              moreDetails={matchedUser || {}}
              bio={matchedUser.bio || ""}
              artists={matchedUser || []}
              movies={matchedUser.movies || []}
              setShowPreview={setShowMatchPopup}
              value={true}
              matchedUser={matchedUser}
           />
           {/* {setCount(0)} */}
         </div>
       </div>
      )}


      {/* Bottom Navigation */}
      <div className="flex justify-around items-center py-3 bg-white shadow-md">
        <button className="text-xl text-blue-600"><Link to="/feed"><FaHeart /></Link></button>
        <button className="text-xl text-gray-600"><Link to="/reqmatch"><FaUsers /></Link></button>
        <button className="text-xl text-gray-600"><Link to="/upload"><FaRobot /></Link></button>
        <button className="text-xl text-gray-600"><Link to="/chat"><FaCommentDots /></Link></button>
        <button onClick={logout} className="text-xl text-gray-600"><RiLogoutCircleFill /></button>
      </div>
    </div>
  );
}

export default MemeFeed;
