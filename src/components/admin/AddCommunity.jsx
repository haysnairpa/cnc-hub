import { db, storage } from "@/config/firebase";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import React, { useState, useEffect } from "react";
import { PlusCircle, Trash2, Upload } from "lucide-react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

export default function AddCommunity() {
	const { toast } = useToast();

	const [communityName, setCommunityName] = useState("");
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState("");
	const [image, setImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [leaderStudentId, setLeaderStudentId] = useState("");
	const [members, setMembers] = useState([]);
	const [events, setEvents] = useState([]);

	useEffect(() => {
		if (image) {
			const objectUrl = URL.createObjectURL(image);
			setImagePreview(objectUrl);

			return () => URL.revokeObjectURL(objectUrl);
		}
	}, [image]);

	const handleAddMember = () => {
		setMembers([...members, {studentId: ""}]);
	};

	const handleMemberChange = (index, value) => {
		const newMembers = [...members];
		newMembers[index].studentId = value;
		setMembers(newMembers);
	};

	const handleRemoveMember = (index) => {
		const newMembers = [...members];
		newMembers.splice(index, 1);
		setMembers(newMembers);
	};

	const handleAddEvent = () => {
		setEvents([
			...events,
			{ date: "", place: "", description: "", eventName: "" },
		]);
	};

	const handleEventChange = (index, field, value) => {
		const newEvents = [...events];
		newEvents[index] = { ...newEvents[index], [field]: value };
		setEvents(newEvents);
	};

	const handleRemoveEvent = (index) => {
		const newEvents = [...events];
		newEvents.splice(index, 1);
		setEvents(newEvents);
	};

	const handleImageChange = (e) => {
		if (e.target.files && e.target.files[0]) {
			setImage(e.target.files[0]);
			console.log(e.target.files[0]);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const comId = uuidv4();

		try {
			const communityMembers = members.map((m) => ({
				studentId: m.studentId,
				status: "member",	
			}));
			let imageUrl;
			let communityData;
			if (image instanceof File) {
				const imageRef = ref(storage, `communities/${image.name}`);
				await uploadBytes(imageRef, image);
				imageUrl = await getDownloadURL(imageRef);
			}


			if (imageUrl) {
				communityData = {
					name: communityName,
					description,
					category,
					image: imageUrl,
					leader: leaderStudentId,
					members: communityMembers,
					createdAt: new Date(),
					updatedAt: new Date(),
				};
			} else {
				communityData = {
					name: communityName,
					description,
					category,
					leader: leaderStudentId,
					members: communityMembers,
					createdAt: new Date(),
					updatedAt: new Date(),
				};
			}

			await setDoc(doc(db, "communities", comId), communityData);

			if (events && events.length > 0) {
				for (const ev of events) {
					await addDoc(
						collection(db, `communities/${comId}/events`),
						ev
					);
				}
			}

			// Reset form
			setCommunityName("");
			setDescription("");
			setCategory("");
			setImage(null);
			setImagePreview(null);
			setLeaderStudentId("");
			setMembers([]);
			setEvents([]);

			toast({ title: "Community Successfully added!" });
		} catch (error) {
			console.error("Error adding community: ", error);
			alert("Gagal menambahkan community. Silakan coba lagi.");
		}
	};

	return (
		<div>
			<Card className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
				<CardHeader className="bg-black text-white p-6">
					<CardTitle className="text-2xl font-semibold">
						Add New Community
					</CardTitle>
					<CardDescription className="text-gray-300">
						Create a new community on CnC Hub
					</CardDescription>
				</CardHeader>
				<CardContent className="p-6">
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-2">
							<Label
								htmlFor="communityName"
								className="text-gray-700"
							>
								Community Name
							</Label>
							<Input
								id="communityName"
								placeholder="Enter community name"
								value={communityName}
								onChange={(e) =>
									setCommunityName(e.target.value)
								}
								required
								className="w-full border-gray-300 focus:border-gray-500 focus:ring-gray-500"
							/>
						</div>
						<div className="space-y-2">
							<Label
								htmlFor="description"
								className="text-gray-700"
							>
								Description
							</Label>
							<Textarea
								id="description"
								placeholder="Describe your community"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								required
								className="w-full border-gray-300 focus:border-gray-500 focus:ring-gray-500"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="category" className="text-gray-700">
								Category
							</Label>

							<Input
								id="category"
								placeholder="Category"
								value={category}
								onChange={(e) => setCategory(e.target.value)}
								required
								className="w-full border-gray-300 focus:border-gray-500 focus:ring-gray-500"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="image" className="text-gray-700">
								Community Image
							</Label>
							<div className="">
								<Input
									id="image"
									type="file"
									onChange={handleImageChange}
									accept="image/*"
									className={`w-full border-gray-300 focus:border-gray-500 focus:ring-gray-50 hidden`}
								/>
								<Button
									type="button"
									variant="outline"
									onClick={() =>
										document
											.getElementById("image")
											?.click()
									}
									className="w-full"
								>
									{!imagePreview ? (
										<>
											<Upload className="" />
											Upload
										</>
									) : (
										"Change Image"
									)}
								</Button>
							</div>
							{imagePreview && (
								<div className="mt-4">
									<img
										src={imagePreview}
										alt="Community image preview"
										className="max-w-full h-auto rounded-lg shadow-md"
									/>
								</div>
							)}
						</div>
						<div className="space-y-2">
							<Label
								htmlFor="leaderStudentId"
								className="text-gray-700"
							>
								Leader Student ID
							</Label>
							<Input
								id="leaderStudentId"
								placeholder="Enter leader's student ID"
								value={leaderStudentId}
								onChange={(e) =>
									setLeaderStudentId(e.target.value)
								}
								required
								className="w-full border-gray-300 focus:border-gray-500 focus:ring-gray-500"
							/>
						</div>
						<div className="space-y-2 flex flex-col">
							<Label className="text-gray-700">Members</Label>
							{members.map((member, index) => (
								<div
									key={index}
									className="flex items-center space-x-2"
								>
									<Input
										placeholder="Enter member's student ID"
										value={member.studentId}
										onChange={(e) =>
											handleMemberChange(
												index,
												e.target.value
											)
										}
										className="flex-grow border-gray-300 focus:border-gray-500 focus:ring-gray-500"
									/>
									<Button
										type="button"
										variant="outline"
										size="icon"
										onClick={() =>
											handleRemoveMember(index)
										}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							))}
							<Button
								type="button"
								variant="outline"
								onClick={handleAddMember}
								className="mt-2"
							>
								<PlusCircle className="h-4 w-4" />
								Add Member
							</Button>
						</div>
						<div className="space-y-2 flex flex-col">
							<Label className="text-gray-700">Events</Label>
							{events.map((event, index) => (
								<div
									key={index}
									className="space-y-2 p-4 border border-gray-200 rounded-md"
								>
									<Input
										placeholder="Event Title"
										value={event.eventName}
										onChange={(e) =>
											handleEventChange(
												index,
												"eventName",
												e.target.value
											)
										}
										className="w-full border-gray-300 focus:border-gray-500 focus:ring-gray-500"
									/>
									<div className="flex space-x-2">
										<Input
											type="date"
											value={event.date}
											onChange={(e) =>
												handleEventChange(
													index,
													"date",
													e.target.value
												)
											}
											className="flex-1 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
										/>
										<Input
											placeholder="Place"
											value={event.place}
											onChange={(e) =>
												handleEventChange(
													index,
													"place",
													e.target.value
												)
											}
											className="flex-1 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
										/>
									</div>
									<Textarea
										placeholder="Event Description"
										value={event.description}
										onChange={(e) =>
											handleEventChange(
												index,
												"description",
												e.target.value
											)
										}
										className="w-full border-gray-300 focus:border-gray-500 focus:ring-gray-500"
									/>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => handleRemoveEvent(index)}
									>
										<Trash2 className="h-4 w-4 mr-2" />
										Remove Event
									</Button>
								</div>
							))}
							<Button
								type="button"
								variant="outline"
								onClick={handleAddEvent}
								className="mt-2"
							>
								<PlusCircle className="h-4 w-4 mr-2" />
								Add Event
							</Button>
						</div>
					</form>
				</CardContent>
				<CardFooter className="p-6">
					<Button
						type="submit"
						className="w-full text-white"
						onClick={handleSubmit}
					>
						Create Community
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
