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
import { db } from "@/config/firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

export function ManageCommunities() {
	const [communities, setCommunities] = useState([]);
	const [selectedCommunity, setSelectedCommunity] = useState(null);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const fetchCommunities = async () => {
			try {
				const querySnapshot = await getDocs(collection(db, "communities"));
				const communitiesData = querySnapshot.docs.map(doc => {
					const data = doc.data();
					return {
						id: doc.id,
						name: data.name,
						members: data.members?.map(member => ({
							id: member.id || member.uid,
							name: member.name || member.displayName,
							email: member.email
						})) || [],
						pendingMembers: data.pendingMembers?.map(member => ({
							id: member.id || member.uid,
							name: member.name || member.displayName,
							email: member.email
						})) || [],
						...data
					};
				});
				setCommunities(communitiesData);
			} catch (error) {
				console.error("Error fetching communities:", error);
			}
		};

		fetchCommunities();
	}, []);

	useEffect(() => {
		const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
		checkIfMobile();
		window.addEventListener("resize", checkIfMobile);
		return () => window.removeEventListener("resize", checkIfMobile);
	}, []);

	const handleDeleteCommunity = async (id) => {
		try {
			await deleteDoc(doc(db, "communities", id));
			setCommunities(communities.filter((c) => c.id !== id));
			setSelectedCommunity(null);
		} catch (error) {
			console.error("Error deleting community:", error);
		}
	};

	const handleApproveMember = async (communityId, memberId) => {
		try {
			const community = communities.find(c => c.id === communityId);
			const approvedMember = community.pendingMembers.find(m => m.id === memberId);
			
			const updatedCommunity = {
				members: [...(community.members || []), {
					id: approvedMember.id,
					name: approvedMember.name,
					email: approvedMember.email
				}],
				pendingMembers: community.pendingMembers.filter(m => m.id !== memberId)
			};

			await updateDoc(doc(db, "communities", communityId), updatedCommunity);
			
			setCommunities(communities.map(c => {
				if (c.id === communityId) {
					return { ...c, ...updatedCommunity };
				}
				return c;
			}));
		} catch (error) {
			console.error("Error approving member:", error);
		}
	};

	const handleRejectMember = async (communityId, memberId) => {
		try {
			const community = communities.find(c => c.id === communityId);
			
			const updatedCommunity = {
				pendingMembers: community.pendingMembers.filter(m => m.id !== memberId)
			};

			await updateDoc(doc(db, "communities", communityId), updatedCommunity);
			
			setCommunities(communities.map(c => {
				if (c.id === communityId) {
					return { ...c, ...updatedCommunity };
				}
				return c;
			}));
		} catch (error) {
			console.error("Error rejecting member:", error);
		}
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
