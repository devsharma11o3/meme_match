import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { logout } from "../auth";
import { FaHeart, FaTimes, FaCommentDots, FaRobot, FaUsers, FaFilter, FaArrowLeft } from "react-icons/fa";
import { RiLogoutCircleFill } from "react-icons/ri";
// import { div } from "framer-motion/client";
import { useNavigate } from "react-router-dom";
import { collection, doc, getDoc, getDocs,updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import ProfilePreview from "./PreviewProfile";





const ReqMatch = () => {
    const navigate = useNavigate(); // ✅ Hook for navigation
    // const [showPreview, setShowPreview] = useState(false);

    const [matches, setMatches] = useState([]);
    const userId = auth.currentUser?.uid;
    // Get logged-in user

    useEffect(() => {
        const fetchMatches = async () => {
            if (!userId) return;

            try {
                // Step 1: Get the logged-in user's match IDs
                const userDocRef = doc(db, "users", userId);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists() && userDoc.data().pendingMatches) {
                    const matchIds = userDoc.data().pendingMatches; // Array of match user IDs

                    // Step 2: Fetch user details for each match
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

    const acceptMatch = async (matchId) => {
        if (!userId) return;

        try {
            const userDocRef = doc(db, "users", userId);
            const userDoc = await getDoc(userDocRef);
            if (!userDoc.exists()) return;

            const userData = userDoc.data();
            const updatedPendingMatches = userData.pendingMatches.filter((id) => id !== matchId);
            const updatedMatches = [...(userData.matches || []), matchId];

            await updateDoc(userDocRef, {
                pendingMatches: updatedPendingMatches,
                matches: updatedMatches,
            });

            const matchDocRef = doc(db, "users", matchId);
            const matchDoc = await getDoc(matchDocRef);
            if (matchDoc.exists()) {
                const matchData = matchDoc.data();
                const updatedMatchList = [...(matchData.matches || []), userId];
                await updateDoc(matchDocRef, { matches: updatedMatchList });
            }

            setMatches(matches.filter((match) => match.id !== matchId));
            navigate("/chat");
        } catch (error) {
            console.error("Error accepting match:", error);
        }
    };

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
                <h2 className="text-xl font-bold mb-4">Your Matches</h2>
                <div className="space-y-4">
                    {matches.length > 0 ? (
                        matches.map((match) => (
                            <div
                                key={match.id}
                                className=" mt-4 flex items-center p-3 bg-gray-100 rounded-lg shadow-md" onClick={() => acceptMatch(match.id)}
                            >
                                <img
                                    src={match.photos[0]}
                                    alt={match.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                // onClick={showPreview ? (
                                //     <ProfilePreview
                                //         photos={photos}
                                //         basicDetails={basicDetails}
                                //         setShowPreview={setShowPreview}
                                //         moreDetails={moreDetails}
                                //         bio={bio}
                                //         movies={movies}
                                //         artists={artists}

                                //     />
                                // ): undefined}
                                />
                                <span className="ml-4 text-lg font-semibold">{match.name}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No match requests.</p>
                    )}
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
        </div >
    );
};

export default ReqMatch;
