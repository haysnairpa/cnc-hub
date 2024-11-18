"use client";

import { db, storage } from "@/config/firebase";
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	updateDoc,
} from "firebase/firestore";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function EditCommunity({ communityId, initialData }) {
	const { toast } = useToast();

	const [communityName, setCommunityName] = useState(initialData.name || "");
	const [description, setDescription] = useState(
		initialData.description || ""
	);
	const [category, setCategory] = useState(initialData.category || "");
	const [image, setImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(initialData.image || null);
	const [leaderStudentId, setLeaderStudentId] = useState(
		initialData.leader || ""
	);

	const [members, setMembers] = useState(initialData.members || []);
	const [events, setEvents] = useState(initialData.events || []);
	const [registrationOpen, setRegistrationOpen] = useState(
		initialData.registrationOpen || false
	);


	const initialEvents = initialData.events || [];
	const pendingMembers = initialData.members
		.filter((m) => m.status === "pending")
		.map((m) => ({
			studentId: m.studentId,
			status: m.status,
		}));

	useEffect(() => {
		setMembers(
			initialData?.members
				.map((m) => ({
					studentId: m.studentId,
					status: m.status,
				}))
				.filter((m) => m.status === "member")
		);
	}, []);

	useEffect(() => {
		if (image) {
			const objectUrl = URL.createObjectURL(image);
			setImagePreview(objectUrl);
			return () => URL.revokeObjectURL(objectUrl);
		}
	}, [image]);

	const handleAddMember = () => {
		setMembers([...members, { studentId: "" }]);
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
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const communityRef = doc(db, "communities", communityId);
			let imageUrl = initialData.image;

			if (image instanceof File) {
				const imageRef = ref(storage, `communities/${image.name}`);
				await uploadBytes(imageRef, image);
				imageUrl = await getDownloadURL(imageRef);
			}

			const updatedMembers = members.map((m) => ({
				studentId: m.studentId,
				status: "member",
			}));

			const communityData = {
				name: communityName,
				description,
				category,
				image: imageUrl,
				leader: leaderStudentId,
				members: [...updatedMembers, ...pendingMembers],
				registrationOpen,
				updatedAt: new Date(),
			};

			console.log("communityData", communityData);
			await updateDoc(communityRef, communityData);

			const existingEventIds = initialEvents
				.filter((ev) => ev && ev.id) // Ensure valid events
				.map((ev) => ev.id);

			const updatedEventIds = events
				.filter((ev) => ev && ev.id) // Only include valid events
				.map((ev) => ev.id);

			// Delete removed events
			const eventsToDelete = existingEventIds.filter(
				(id) => !updatedEventIds.includes(id) // Compare ids only
			);

			for (const ev of eventsToDelete) {
				await deleteDoc(
					doc(db, `communities/${communityId}/events`, ev)
				);
			}

			for (const ev of events) {
				if (ev.id) {
					const { id, ...e } = ev;
					// Existing event
					await updateDoc(
						doc(db, `communities/${communityId}/events`, ev.id),
						e
					);
				} else {
					// New event
					await addDoc(
						collection(db, `communities/${communityId}/events`),
						ev
					);
				}
			}

			toast({ title: "Community Successfully updated!" });
		} catch (error) {
			console.error("Error updating community: ", error);
			toast({
				title: "Failed to update community. Please try again.",
				variant: "destructive",
			});
		}
	};

	return (
		<div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
			<Card className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
				<CardHeader className="bg-black text-white p-6">
					<CardTitle className="text-2xl font-semibold">
						Edit Community
					</CardTitle>
					<CardDescription className="text-gray-300">
						Update your community on CnC Hub
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
							<div className="mt-1 flex items-center">
								<Input
									id="image"
									type="file"
									onChange={handleImageChange}
									accept="image/*"
									className="hidden"
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
											<Upload className="mr-2 h-4 w-4" />
											Upload Image
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
										className="w-full h-auto rounded-lg shadow-md object-cover"
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
						<div className="space-y-2">
							<Label
								htmlFor="registrationOpen"
								className="text-gray-700"
							>
								Open Registration
							</Label>
							<Select
								onValueChange={(value) =>
									setRegistrationOpen(value === "yes")
								}
								defaultValue={registrationOpen ? "yes" : "no"}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select open registration status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="yes">Yes</SelectItem>
									<SelectItem value="no">No</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
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
								className="mt-2 w-full"
							>
								<PlusCircle className="h-4 w-4 mr-2" />
								Add Member
							</Button>
						</div>
						<div className="space-y-2">
							<Label className="text-gray-700">Events</Label>
							{events.map((event, index) => (
								<div
									key={index}
									className="space-y-2 p-4 border border-gray-200 rounded-md"
								>
									<Input
										placeholder="Event Name"
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
								className="mt-2 w-full"
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
						className="w-full bg-gray-900 text-white hover:bg-gray-800"
						onClick={handleSubmit}
					>
						Update Community
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
