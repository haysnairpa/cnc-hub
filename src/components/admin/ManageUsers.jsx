import React, { useState, useEffect } from "react";
import UserCard from "@/components/admin/manage-users/UserCard";
import UserTable from "@/components/admin/manage-users/UserTable";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import { deleteDoc } from "firebase/firestore"; // Import deleteDoc
import { getAuth } from "firebase/auth"; // Import getAuth
import { deleteUser } from "firebase/auth"; // Import deleteUser

const mockUsers = [
	{
		id: 1,
		name: "John Doe",
		email: "john@example.com",
		communities: ["Tech Enthusiasts", "Fitness Fanatics"],
		status: "Active",
	},
	{
		id: 2,
		name: "Jane Smith",
		email: "jane@example.com",
		communities: ["Book Club"],
		status: "Active",
	},
	{
		id: 3,
		name: "Bob Johnson",
		email: "bob@example.com",
		communities: ["Tech Enthusiasts"],
		status: "Banned",
	},
];

export function ManageUsers() {
	const [users, setUsers] = useState(mockUsers);
	const [isMobile, setIsMobile] = useState(false);

	const getUsersData = async () => {
		const userCollectionRef = collection(db, "users");
		try {
			const res = await getDocs(userCollectionRef);
			const data = res.docs.map((user) => ({
				...user.data(),
				id: user.id,
			}));
			setUsers(data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getUsersData();
	}, [users]);

	useEffect(() => {
		const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
		checkIfMobile();
		window.addEventListener("resize", checkIfMobile);
		return () => window.removeEventListener("resize", checkIfMobile);
	}, []);

	const handleDeleteUser = async (id) => {
		const userToDelete = users.find((user) => user.id === id);
		if (userToDelete) {
			try {
				// Delete user from Firestore
				const userDocRef = doc(db, "users", id);
				await deleteDoc(userDocRef);

				getUsersData();
			} catch (error) {
				console.log("Error deleting user:", error);
			}
		}
	};

	const handleBanUser = (id) => {
		setUsers(
			users.map((user) =>
				user.id === id ? { ...user, role: "Banned" } : user
			)
		);
	};

	return (
		<div className="space-y-6">
			<h2 className="text-2xl font-semibold">Users</h2>
			{isMobile ? (
				<div>
					{users.map((user) => (
						<UserCard
							key={user.id}
							user={user}
							handleBanUser={handleBanUser}
							handleDeleteUser={handleDeleteUser}
						/>
					))}
				</div>
			) : (
				<UserTable
					users={users}
					handleDeleteUser={handleDeleteUser}
					handleBanUser={handleBanUser}
				/>
			)}
		</div>
	);
}
