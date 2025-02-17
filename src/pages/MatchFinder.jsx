import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../firebase";

const db = getFirestore(app);
const auth = getAuth(app);

function MatchFinder({ onMatchFound, filters }) { // Callback to notify MemeFeed.jsx
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const findMatches = async () => {
      if (!userId || !filters) return;

      setLoading(true);

      // Fetch user's existing matches to exclude them
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      const existingMatches = userSnap.exists() ? userSnap.data().matches || [] : [];

      // Fetch all memes and liked users
      const querySnapshot = await getDocs(collection(db, "memes"));
      const memes = querySnapshot.docs.map((doc) => doc.data());

      let userMatches = {};

      // Count common likes
      memes.forEach((meme) => {
        if (meme.likedBy?.includes(userId)) {
          meme.likedBy.forEach((liker) => {
            if (liker !== userId) {
              userMatches[liker] = (userMatches[liker] || 0) + 1;
            }
          });
        }
      });

      // Filter matches with at least 10-15 common memes
      let filteredMatches = Object.entries(userMatches)
        .filter(([_, commonLikes]) => commonLikes >= 10) // At least 10 common memes
        .sort((a, b) => b[1] - a[1]) // Sort by most common likes
        .map(([user, commonLikes]) => ({ user, commonLikes }));

      // Apply filters
      if (filters) {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersData = usersSnapshot.docs.reduce((acc, doc) => {
          acc[doc.id] = doc.data();
          return acc;
        }, {});
        filteredMatches = filteredMatches.filter(({ user }) => {
          const userData = usersData[user];
          if (!userData) return false;

          // Gender filter
          if (
            (filters.gender.male && userData.gender !== "male") &&
            (filters.gender.female && userData.gender !== "female") &&
            (filters.gender.other && userData.gender !== "other")
          ) {
            return false;
          }

          // Age filter
          const age = userData.age;
          if (age < filters.ageRange[0] || age > filters.ageRange[1]) {
            return false;
          }

          // Distance filter (assuming 'location' exists with lat/lng)
          // if (filters.distance) {
          //   const distance = getDistance(userData.location, filters.userLocation); // You'll need a distance calculation function
          //   if (distance > filters.distance) {
          //     return false;
          //   }
          // }
          return true;
        });
      }

      // Exclude already matched users
      filteredMatches = filteredMatches.filter(({ user }) => !existingMatches.includes(user));

      if (filteredMatches.length > 0) {
        const matchedUserId = filteredMatches[0].user; // Pick the best match

        // Fetch matched user's details
        const matchedUserRef = doc(db, "users", matchedUserId);
        const matchedUserSnap = await getDoc(matchedUserRef);

        if (matchedUserSnap.exists()) {
          const matchedUserData = matchedUserSnap.data();
          onMatchFound(matchedUserData); // Notify MemeFeed.jsx
        }
      }

      setLoading(false);
    };

    if (userId) findMatches();
  }, [userId]);

  return null; // No UI needed, just logic
}

export default MatchFinder;
