import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../auth";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "../App.css";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserProfile = async (user) => {
      if (!user) return;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        navigate("/feed");
      } else {
        await setDoc(userRef, { name: user.displayName, email: user.email });
        navigate("/profileedit");
      }
    };

    auth.onAuthStateChanged((user) => {
      if (user) {
        checkUserProfile(user);
      }
    });
  }, [navigate]);

  return (
    <div
      className="flex flex-col justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/logmembg.png')" }}
    >
      <div className="bg-opacity-90 shadow-lg rounded-2xl p-8 w-96 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">🔥 Meme Match</h1>
        <p className="text-gray-800 mb-6">Find your match through memes!</p>
        <button
          onClick={signInWithGoogle}
          className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-full shadow-md hover:bg-gray-300 transition duration-200 text-lg font-semibold mt-4"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
