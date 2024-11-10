import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Pencil, User as UserIcon, X } from "lucide-react";
import { useAuth } from "@/components/contexts/AuthContext";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/config/firebase";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";

export default function Profile() {
	const { userData, user: userAuth, getUserData } = useAuth();
	const [isEditing, setIsEditing] = useState(false);

	const [user, setUser] = useState({
		fullName: "",
		email: "",
		studentId: "",
		profileImage: null,
	});
	const [editableUser, setEditableUser] = useState(user);

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
	}, [userData]);

	const communities = [
		{
			id: "1",
			title: "Photography Club",
			category: "Arts",
			totalMembers: 50,
			description:
				"Capture moments and share your passion for photography.",
		},
		{
			id: "2",
			title: "Debate Society",
			category: "Academic",
			totalMembers: 30,
			description:
				"Enhance your public speaking and critical thinking skills.",
		},
		{
			id: "3",
			title: "Eco Warriors",
			category: "Environment",
			totalMembers: 40,
			description: "Join us in making the world a greener place.",
		},
	];

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
				<Card className="bg-white shadow-lg rounded-2xl overflow-hidden">
					<CardHeader className="bg-black p-6">
						<div className="flex justify-between items-center">
							<div
								className={`h-16 w-16 bg-white rounded-full relative shadow-lg `}
							>
								{!isEditing ? (
									<Avatar className="h-full w-full rounded-full border-4 border-white relative z-30">
										{!user.profileImage ? (
											<UserIcon
												className="w-full h-full"
												strokeWidth={1}
											/>
										) : (
											<AvatarImage
												src={
													user.profileImage instanceof
													File
														? URL.createObjectURL(
																user.profileImage
														  )
														: user.profileImage
												}
												alt={user?.fullName}
												className="object-cover"
											/>
										)}
									</Avatar>
								) : (
									<>
										<Avatar className="h-full w-full rounded-full border-4 border-white ">
											{!editableUser.profileImage ? (
												<UserIcon
													className="w-full h-full"
													strokeWidth={1}
												/>
											) : (
												<AvatarImage
													src={
														editableUser.profileImage instanceof
														File
															? URL.createObjectURL(
																	editableUser.profileImage
															  )
															: editableUser.profileImage
													}
													alt={user?.fullName}
													className="object-cover"
												/>
											)}
										</Avatar>
										<label
											htmlFor="avatar-upload"
											className="absolute -bottom-1 -right-1 bg-indigo-100 text-indigo-800 p-2 rounded-full cursor-pointer z-50"
										>
											<Camera className="w-4 h-4" />
											<input
												id="avatar-upload"
												type="file"
												className="hidden"
												accept="image/*"
												onChange={(e) => {
													setEditableUser({
														...editableUser,
														profileImage:
															e.target.files?.[0],
													});
													console.log(
														e.target.files[0]
													);
												}}
											/>
										</label>
									</>
								)}
							</div>

							<Button
								variant="outline"
								size="icon"
								onClick={handleEditToggle}
								className="bg-white text-gray-800 hover:bg-gray-200 rounded-full"
							>
								{isEditing ? (
									<X className="h-4 w-4" />
								) : (
									<Pencil className="h-4 w-4" />
								)}
							</Button>
						</div>
					</CardHeader>
					<CardContent className="p-6">
						{isEditing ? (
							<div className="space-y-4">
								<div>
									<Label htmlFor="fullName">Full Name</Label>
									<Input
										id="fullName"
										name="fullName"
										value={editableUser.fullName}
										onChange={handleInputChange}
									/>
								</div>

								<div>
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										name="email"
										value={editableUser.email}
										className="bg-gray-100"
										disabled
										readOnly
									/>
								</div>
								<div>
									<Label htmlFor="studentId">
										Student ID
									</Label>
									<Input
										id="studentId"
										name="studentId"
										value={editableUser.studentId}
										className="bg-gray-100"
										readOnly
										disabled
									/>
								</div>
								<Button
									onClick={handleSave}
									className="w-full text-white"
								>
									Save Changes
								</Button>
							</div>
						) : (
							<div className="space-y-2">
								<h2 className="text-2xl font-bold text-gray-800">
									{user?.fullName}
								</h2>
								<p className="text-gray-600">{user?.email}</p>
								<p className="text-gray-600">
									Student ID: {user?.studentId}
								</p>
							</div>
						)}
					</CardContent>
				</Card>

				<h2 className="mt-12 text-2xl font-bold text-gray-800">
					Your Communities
				</h2>
				<div className="mt-6 grid gap-6 sm:grid-cols-2">
					{communities.map((community) => (
						<Card
							key={community.id}
							className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
						>
							<CardHeader>
								<div className="flex justify-between items-center">
									<CardTitle className="text-lg font-semibold text-gray-800">
										{community.title}
									</CardTitle>
									<span className="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
										{community.category}
									</span>
								</div>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-gray-500">
									Members: {community.totalMembers}
								</p>
								<p className="mt-2 text-sm text-gray-700">
									{community.description}
								</p>
							</CardContent>
							<CardFooter>
								<Button
									onClick={() =>
										console.log(
											`Navigating to /cnc/${community.id}`
										)
									}
									className="w-full text-white"
								>
									View Details
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
