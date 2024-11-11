import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import CommunityCard from "@/components/admin/manage-communities/CommunityCard";

// Mock data for communities
const mockCommunities = [
	{
		id: 1,
		name: "Tech Enthusiasts",
		members: [
			{ id: 1, name: "John Doe", email: "john@example.com" },
			{ id: 2, name: "Jane Smith", email: "jane@example.com" },
			{ id: 3, name: "John Doe", email: "john@example.com" },
			{ id: 4, name: "Jane Smith", email: "jane@example.com" },
			{ id: 5, name: "John Doe", email: "john@example.com" },
			{ id: 6, name: "Jane Smith", email: "jane@example.com" },
			{ id: 7, name: "John Doe", email: "john@example.com" },
			{ id: 8, name: "Jane Smith", email: "jane@example.com" },
			{ id: 9, name: "John Doe", email: "john@example.com" },
			{ id: 10, name: "Jane Smith", email: "jane@example.com" },
			{ id: 11, name: "John Doe", email: "john@example.com" },
			{ id: 12, name: "Jane Smith", email: "jane@example.com" },
			{ id: 13, name: "John Doe", email: "john@example.com" },
			{ id: 14, name: "Jane Smith", email: "jane@example.com" },
		],
		pendingMembers: [
			{ id: 15, name: "Alice Johnson", email: "alice@example.com" },
		],
	},
	{
		id: 2,
		name: "Book Club",
		members: [{ id: 2, name: "Jane Smith", email: "jane@example.com" }],
		pendingMembers: [],
	},
	{
		id: 3,
		name: "Fitness Fanatics",
		members: [
			{ id: 1, name: "John Doe", email: "john@example.com" },
			{ id: 4, name: "Bob Wilson", email: "bob@example.com" },
		],
		pendingMembers: [
			{ id: 5, name: "Charlie Brown", email: "charlie@example.com" },
		],
	},
];

export function ManageCommunities() {
	const [communities, setCommunities] = useState(mockCommunities);
	const [newCommunity, setNewCommunity] = useState({ name: "" });
	const [selectedCommunity, setSelectedCommunity] = useState(null);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
		checkIfMobile();
		window.addEventListener("resize", checkIfMobile);
		return () => window.removeEventListener("resize", checkIfMobile);
	}, []);

	const handleAddCommunity = () => {
		setCommunities([
			...communities,
			{
				id: communities.length + 1,
				...newCommunity,
				members: [],
				pendingMembers: [],
			},
		]);
		setNewCommunity({ name: "" });
	};

	const handleDeleteCommunity = (id) => {
		setCommunities(communities.filter((c) => c.id !== id));
		setSelectedCommunity(null);
	};

	const handleApproveMember = (communityId, memberId) => {
		setCommunities(
			communities.map((community) => {
				if (community.id === communityId) {
					const approvedMember = community.pendingMembers.find(
						(m) => m.id === memberId
					);
					return {
						...community,
						members: [...community.members, approvedMember],
						pendingMembers: community.pendingMembers.filter(
							(m) => m.id !== memberId
						),
					};
				}
				return community;
			})
		);
		setSelectedCommunity(communities.find((c) => c.id === communityId));
	};

	const handleRejectMember = (communityId, memberId) => {
		setCommunities(
			communities.map((community) => {
				if (community.id === communityId) {
					return {
						...community,
						pendingMembers: community.pendingMembers.filter(
							(m) => m.id !== memberId
						),
					};
				}
				return community;
			})
		);
		setSelectedCommunity(communities.find((c) => c.id === communityId));
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center">
				<h2 className="text-2xl font-semibold">Communities</h2>
			</div>
			{isMobile ? (
				<div>
					{communities.map((community) => (
						<CommunityCard
							key={community.id}
							community={community}
							handleDeleteCommunity={handleDeleteCommunity}
							handleApproveMember={handleApproveMember}
							setSelectedCommunity={setSelectedCommunity}
							handleRejectMember={handleRejectMember}
						/>
					))}
				</div>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Members</TableHead>
							<TableHead>Pending Members</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{communities.map((community) => (
							<TableRow key={community.id}>
								<TableCell>{community.name}</TableCell>
								<TableCell>
									{community.members.length}
								</TableCell>
								<TableCell>
									{community.pendingMembers.length}
								</TableCell>
								<TableCell>
									<Dialog>
										<DialogTrigger asChild>
											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													setSelectedCommunity(
														community
													)
												}
											>
												View Details
											</Button>
										</DialogTrigger>
										<DialogContent className="max-w-3xl max-h-[500px] overflow-y-scroll">
											<DialogHeader>
												<DialogTitle>
													{community.name}
												</DialogTitle>
											</DialogHeader>
											<div className="mt-6 space-y-6">
												<div>
													<h3 className="text-lg font-semibold mb-2">
														Members
													</h3>
													<Table>
														<TableHeader>
															<TableRow>
																<TableHead>
																	Name
																</TableHead>
																<TableHead>
																	Email
																</TableHead>
															</TableRow>
														</TableHeader>
														<TableBody>
															{community.members.map(
																(member) => (
																	<TableRow
																		key={
																			member.id
																		}
																	>
																		<TableCell>
																			{
																				member.name
																			}
																		</TableCell>
																		<TableCell>
																			{
																				member.email
																			}
																		</TableCell>
																	</TableRow>
																)
															)}
														</TableBody>
													</Table>
												</div>
												<div>
													<h3 className="text-lg font-semibold mb-2">
														Pending Members
													</h3>
													<Table>
														<TableHeader>
															<TableRow>
																<TableHead>
																	Name
																</TableHead>
																<TableHead>
																	Email
																</TableHead>
																<TableHead>
																	Actions
																</TableHead>
															</TableRow>
														</TableHeader>
														<TableBody>
															{community.pendingMembers.map(
																(member) => (
																	<TableRow
																		key={
																			member.id
																		}
																	>
																		<TableCell>
																			{
																				member.name
																			}
																		</TableCell>
																		<TableCell>
																			{
																				member.email
																			}
																		</TableCell>
																		<TableCell>
																			<Button
																				variant="outline"
																				size="sm"
																				className="mr-2"
																				onClick={() =>
																					handleApproveMember(
																						community.id,
																						member.id
																					)
																				}
																			>
																				Approve
																			</Button>
																			<Button
																				variant="outline"
																				size="sm"
																				onClick={() =>
																					handleRejectMember(
																						community.id,
																						member.id
																					)
																				}
																			>
																				Reject
																			</Button>
																		</TableCell>
																	</TableRow>
																)
															)}
														</TableBody>
													</Table>
												</div>
												<Button
													variant="destructive"
													onClick={() =>
														handleDeleteCommunity(
															community.id
														)
													}
												>
													Delete Community
												</Button>
											</div>
										</DialogContent>
									</Dialog>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
}
