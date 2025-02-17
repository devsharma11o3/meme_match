import React, { useState, useEffect } from "react";
import { Slider } from "../components/Slider";
import { Button } from "../components/Button";
import { Switch } from "../components/Switch";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../firebase";

const db = getFirestore(app);
const auth = getAuth(app);

const Filter = ({ onApplyFilters }) => {
    const [gender, setGender] = useState({ male: false, female: true, other: false });
    const [distance, setDistance] = useState(50);
    const [ageRange, setAgeRange] = useState([18, 40]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                fetchUserFilters(user.uid);
            }
        });

        return () => unsubscribe();
    }, []);

    // Fetch existing filters from Firestore
    const fetchUserFilters = async (uid) => {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            if (userData.filters) {
                setGender(userData.filters.gender || { male: false, female: false, other: false });
                setDistance(userData.filters.distance || 50);
                setAgeRange(userData.filters.ageRange || [18, 40]);
            }
        }
    };

    // Apply filters and save to Firestore
    const applyFilters = async () => {
        if (!userId) return;

        const filters = { gender, distance, ageRange };

        try {
            const userRef = doc(db, "users", userId);
            await setDoc(userRef, { filters }, { merge: true });

            console.log("Filters updated successfully!");

            // Send filters to parent component (for local filtering)
            onApplyFilters(filters);
        } catch (error) {
            console.error("Error updating filters:", error);
        }
    };

    return (
        <div className="p-4 flex flex-col h-screen bg-blue-100">
            <h2 className="text-xl font-bold mb-4 ">Filter Matches</h2>

            {/* Gender Filter */}
            <div className="mb-4 relative">
                <h3 className="font-semibold mb-2">Interested In</h3>
                <div className="flex flex-wrap gap-4">
                    <label className="flex items-center space-x-2">
                        <Switch
                            checked={gender.male}
                            onChange={(e) => setGender({ ...gender, male: e.target.checked })}
                        />
                        <span>Male</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <Switch
                            checked={gender.female}
                            onChange={(e) => setGender({ ...gender, female: e.target.checked })}
                        />
                        <span>Female</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <Switch
                            checked={gender.other}
                            onChange={(e) => setGender({ ...gender, other: e.target.checked })}
                        />
                        <span>Other</span>
                    </label>
                </div>
            </div>

            {/* Distance Filter */}
            <div className="mb-4">
                <h3 className="font-semibold mb-2">Max Distance: {distance} km</h3>
                <Slider
                    min={50}
                    max={200}
                    step={10}
                    value={[distance]}
                    onValueChange={(val) => setDistance(val[0])}
                />

            </div>

            {/* Age Filter */}
            <div className="mb-4">
                <h3 className="font-semibold mb-2">Age Range: {ageRange[0]} - {ageRange}</h3>
                <Slider
                    min={18}
                    max={40}
                    step={1}
                    value={[ageRange]}
                    onValueChange={(val) => setAgeRange(val[0])}
                />

            </div>

            <Button className="w-full" onClick={applyFilters}>Apply Filters</Button>
        </div>
    );
};

export default Filter;
