import React, { useEffect, useState } from "react";
import { useAuth } from "@/components/contexts/AuthContext";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/config/firebase";
import {
	collection,
	doc,
	getDocs,
	query,
	serverTimestamp,
	updateDoc,
	where,
} from "firebase/firestore";
import ProfileCommunitiesContainer from "@/components/profile/ProfileCommunitiesContainer";
import Profilecard from "@/components/profile/Profilecard";

export default function Profile() {
	const { userData, user: userAuth, getUserData } = useAuth();
	const [isEditing, setIsEditing] = useState(false);
	const [communities, setCommunities] = useState([]);

	const [user, setUser] = useState({
		fullName: "",
		email: "",
		studentId: "",
		profileImage: null,
	});
	const [editableUser, setEditableUser] = useState(user);

	const getUserJoinedCnc = async (studentId) => {
		try {
			const collectionRef = collection(db, "communities");
			const q = query(
				collectionRef,
				where("members", "array-contains", {
					status: "member",
					studentId,
				})
			);
			const res = await getDocs(q);
			if (!res.empty) {
				const joinedCnc = res.docs.map((doc) => ({
					...doc.data(),
					id: doc.id,
				}));
				console.log(joinedCnc);
				setCommunities(joinedCnc);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const setProfileData = () => {
		if (userData) {
			const updatedUser = {
				fullName: userData.fullName,
				email: userData.email,
				studentId: userData.studentId,
				profileImage: userData.profileImage
					? userData.profileImage
					: null,
			};
			setUser(updatedUser);
			setEditableUser(updatedUser);
		}
	};

	useEffect(() => {
		setProfileData();
		getUserJoinedCnc(userData.studentId);
	}, [userData]);

	const handleEditToggle = () => {
		setIsEditing(!isEditing);
	};

	const handleInputChange = (e) => {
		setEditableUser({ ...editableUser, [e.target.name]: e.target.value });
	};

	const uploadImage = async (profileImage) => {
		let imgUrl;

		if (profileImage instanceof File) {
			const userImageRef = ref(storage, `profile/${userAuth.uid}`);

			await uploadBytes(userImageRef, profileImage);
			imgUrl = await getDownloadURL(userImageRef);
		}

		return imgUrl;
	};

	const handleSave = async () => {
		try {
			const imgUrl = await uploadImage(editableUser.profileImage);
			if (user && userAuth) {
				const updatedUser = {
					...editableUser,
					updatedAt: serverTimestamp(),
					profileImage: imgUrl || user.profileImage,
				};
				await updateDoc(doc(db, "users", userAuth.uid), updatedUser);
				getUserData();
				setProfileData();
				setIsEditing(false);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8 mt-10 font-geist">
			<div className="max-w-3xl mx-auto">
				<Profilecard
					user={user}
					editableUser={editableUser}
					setEditableUser={setEditableUser}
					handleEditToggle={handleEditToggle}
					handleInputChange={handleInputChange}
					handleSave={handleSave}
					isEditing={isEditing}
				/>

				<h2 className="mt-12 text-2xl font-bold text-gray-800">
					Your Communities
				</h2>
				<ProfileCommunitiesContainer communities={communities} />
			</div>
		</div>
	);
}
