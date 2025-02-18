import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import app from "./firebase";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

console.log("🔥 Firebase Auth & Firestore Initialized");



// ✅ Save user to Firestore if they don't exist
const saveUserToFirestore = async (user) => {
  if (!user) return; // Ensure user object is valid

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      name: user.displayName || "",
      likedMemes: [], // ✅ Initialize liked memes array
      dislikedMemes: [],
      dislikedUsers:[],
      pendingMatches:[],
      filters:{ 
        gender: {
          male: boolean,
          female: boolean,
          other: boolean,
        },
        distance: number,
        ageRange: number,
      },
    });
    console.log(`✅ New user added: ${user.uid}`);
  } else {
    console.log(`ℹ️ User already exists: ${user.uid}`);
  }
};

// ✅ Add `likedMemes` field to existing users (Run this function once)
const addLikedMemesFieldToExistingUsers = async () => {
  try {
    const usersCollection = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollection);

    usersSnapshot.forEach(async (userDoc) => {
      const userRef = doc(db, "users", userDoc.id);
      const userData = userDoc.data();

      if (!userData.likedMemes) {
        await updateDoc(userRef, { likedMemes: [] });
        console.log(`✅ Updated user: ${userDoc.id}`);
      }
      if (!userData.dislikedMemes) {
        await updateDoc(userRef, { dislikedMemes: [] });
        console.log(`✅ Updated user: ${userDoc.id}`);
      }
      if (!userData.dislikedUsers) {
        await updateDoc(userRef, { dislikedUsers: [] });
        console.log(`✅ Updated user: ${userDoc.id}`);
      }
      if (!userData.pendingMatches) {
        await updateDoc(userRef, { pendingMatches: [] });
        console.log(`✅ Updated user: ${userDoc.id}`);
      }
      if (!userData.filters) {
        await updateDoc(userRef, { filters: {} });
        console.log(`✅ Updated user: ${userDoc.id}`);
      }
    });

    console.log("✅ All users checked for 'likedMemes' field.");
  } catch (error) {
    console.error("❌ Error updating users:", error);
  }
};

// 🔹 Run the function to update existing users (only needed once)
addLikedMemesFieldToExistingUsers();

// ✅ Google Login
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("✅ User signed in:", result.user);
    await saveUserToFirestore(result.user); // Run after login
  } catch (error) {
    console.error("❌ Error signing in:", error);
  }
};

// ✅ Logout
export const logout = async () => {
  try {
    await signOut(auth);
    console.log("✅ User signed out");
  } catch (error) {
    console.error("❌ Error signing out:", error);
  }
};
