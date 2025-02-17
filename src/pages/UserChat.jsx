import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebase";
import { collection, addDoc, query, where, onSnapshot, orderBy,doc,getDoc } from "firebase/firestore";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UserChat = () => {
    const { matchId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [matchDetails, setMatchDetails] = useState(null);
    const userId = auth.currentUser?.uid;

    useEffect(() => {
        if (!userId || !matchId) return;
        console.error("Error fetching match details:");

        // Fetch match details
        const fetchMatchDetails = async () => {
            try {
                const userRef = doc(db, "users", matchId);
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                    setMatchDetails(userDoc.data());
                }
            } catch (error) {
                console.error("Error fetching match details:", error);
            }
        };

        fetchMatchDetails();

        // Fetch chat messages
        const chatId = [userId, matchId].sort().join("_");
        const q = query(collection(db, "messages"), where("chatId", "==", chatId), orderBy("timestamp"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });

        return () => unsubscribe();
    }, [userId, matchId]);

    const sendMessage = async () => {
        console.error("in send msg");
        if (newMessage.trim() === "") return;
        try {
            await addDoc(collection(db, "messages"), {
                chatId: [userId, matchId].sort().join("_"),
                senderId: userId,
                text: newMessage,
                timestamp: new Date(),
            });
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Header */}
            <div className="flex items-center p-4 bg-white shadow-md">
                <button onClick={() => navigate(-1)} className="text-gray-700 text-xl mr-4 rounded-full hover:bg-gray-200 transition">
                    <FaArrowLeft />
                </button>
                {matchDetails && (
                    <div className="flex items-center">
                        <img src={matchDetails.photos[0]} alt="Profile" className="w-10 h-10 rounded-full object-cover mr-3" />
                        <h2 className="text-lg font-semibold">{matchDetails.name}</h2>
                    </div>
                )}
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`max-w-[70%] p-3 rounded-lg text-white ${
                            msg.senderId === userId ? "bg-blue-500 ml-auto" : "bg-gray-600"
                        }`}
                    >
                        {msg.text}
                        <div className="text-xs text-gray-300 text-right mt-1">
                            {new Date(msg.timestamp?.seconds * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Box */}
            <div className="p-4 bg-white flex items-center shadow-md">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 p-2 border rounded-full outline-none"
                />
                <button
                    onClick={sendMessage}
                    className="ml-2 bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600"
                >
                    <FaPaperPlane />
                </button>
            </div>
        </div>
    );
};

export default UserChat;
