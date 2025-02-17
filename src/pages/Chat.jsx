import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { FaHeart, FaTimes, FaCommentDots, FaRobot, FaUsers, FaFilter, FaArrowLeft } from "react-icons/fa";
import { RiLogoutCircleFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { logout } from "../auth";

const Chat = () => {
    const navigate = useNavigate();
    const [matches, setMatches] = useState([]);
    
    const userId = auth.currentUser?.uid;

    useEffect(() => {
        const fetchMatches = async () => {
            if (!userId) return;
            try {
                const userDocRef = doc(db, "users", userId);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists() && userDoc.data().matches) {
                    const matchIds = userDoc.data().matches;

                    const matchPromises = matchIds.map(async (matchId) => {
                        const matchDocRef = doc(db, "users", matchId);
                        const matchDoc = await getDoc(matchDocRef);
                        return matchDoc.exists() ? { id: matchDoc.id, ...matchDoc.data() } : null;
                    });

                    const matchData = (await Promise.all(matchPromises)).filter((match) => match !== null);
                    setMatches(matchData);
                }
            } catch (error) {
                console.error("Error fetching matches:", error);
            }
        };

        fetchMatches();
    }, [userId]);

    return (
      <div className="flex flex-col h-screen bg-blue-100">

        <div className="flex-grow relative p-4">
          {/* Back Button (Top Left) */}
                          <button
                              className="top-4 left-4 text-gray-700 text-2xl p-2 rounded-full hover:bg-gray-200 transition"
                              onClick={() => navigate(-1)}
                          >
                              <FaArrowLeft />
                          </button>
            <h2 className="text-xl font-bold mb-4">Chats</h2>
            <div className="space-y-4">
                {matches.map((match) => (
                    <div key={match.id} className="flex items-center p-3 bg-gray-100 rounded-lg shadow-md cursor-pointer" onClick={() => navigate(`/userchat/${match.id}`)}>
                        <img src={match.photos[0]} alt={match.name} className="w-12 h-12 rounded-full object-cover" />
                        <span className="ml-4 text-lg font-semibold">{match.name}</span>
                    </div>
                ))}
            </div>

        </div>
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
};

export default Chat;
