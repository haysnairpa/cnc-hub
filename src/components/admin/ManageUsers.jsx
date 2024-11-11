import React, { useState, useEffect } from "react";
import UserCard from "@/components/admin/manage-users/UserCard";
import UserTable from "@/components/admin/manage-users/UserTable";

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

	useEffect(() => {
		const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
		checkIfMobile();
		window.addEventListener("resize", checkIfMobile);
		return () => window.removeEventListener("resize", checkIfMobile);
	}, []);

	const handleDeleteUser = (id) => {
		setUsers(users.filter((user) => user.id !== id));
	};

	const handleBanUser = (id) => {
		setUsers(
			users.map((user) =>
				user.id === id ? { ...user, status: "Banned" } : user
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
