// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// //step3 : 6 add login button in react
// import { signInWithGoogle, logout } from "./auth";
// //
// //step 4:
// import MemeUpload from "./MemeUpload";
// import MemeFeed from "./MemeFeed";
// //step 6:
// import MatchFinder from "./MatchFinder";
// //



// function App() {
//   return (
//     <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-purple-500 to-pink-500">
//       <h1 className="text-white text-3xl font-bold mb-6">🔥 Meme Match</h1>
//       <button
//         onClick={signInWithGoogle}
//         className="bg-white text-black px-6 py-3 rounded-full shadow-md hover:bg-gray-200 transition duration-200"
//       > Sign in with Google </button>
//       <button
//         onClick={logout}
//         className="bg-white text-black px-6 py-3 rounded-full shadow-md hover:bg-gray-200 transition duration-200"
//       > Logout </button>
//       {/* <button onClick={logout}>Logout</button> */}
//       <h1 className="text-white text-3xl font-bold mb-6">Meme Dating App</h1>

//       {/* <MemeUpload />
//       <MemeFeed />
//       <MatchFinder /> */}
//     </div>
//   );
// }

// export default App



import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

import Login from "./pages/Login";
import MemeFeed from "./pages/MemeFeed";
import MemeUpload from "./pages/MemeUpload";
import MatchFinder from "./pages/MatchFinder";
import Profile from "./pages/Profile";
import ProfilePage from "./pages/ProfileEdit";
import PreviewProfile from "./pages/PreviewProfile";
import UserChat from "./pages/UserChat";
import Chat from "./pages/Chat";
import Filter from "./pages/Filter";


import ReqMatch from "./pages/ReqMatch";


// import Slider from "./components/Slider"
import Navbar from "./components/Navbar";

function App() {
  const [user, setUser] = useState(null);
  const [profileComplete, setProfileComplete] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        setProfileComplete(userDoc.exists());
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={user ? (profileComplete ? <Navigate to="/feed" /> : <Navigate to="/profileedit" />) : <Login />} />
        <Route path="/feed" element={user && profileComplete ? <MemeFeed /> : <Navigate to="/profileedit" />} />
        <Route path="/upload" element={user ? <MemeUpload /> : <Navigate to="/" />} />
        <Route path="/matches" element={user ? <MatchFinder /> : <Navigate to="/" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/" />} />
        <Route path="/profileedit" element={user ? <ProfilePage /> : <Navigate to="/" />} />
        <Route path="/previewprofile" element={user ? <PreviewProfile /> : <Navigate to="/" />} />
        <Route path="/chat" element={user ? <Chat /> : <Navigate to="/" />} />
        <Route path="/userchat/:matchId" element={user ? <UserChat  /> : <Navigate to="/" />} />
        <Route path="/reqmatch" element={user ? <ReqMatch /> : <Navigate to="/" />} />
        <Route path="/filter" element={user ? <Filter /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
