import React, { useState, useEffect } from "react";
import CommunityCard from "@/components/admin/manage-communities/CommunityCard";
import { db } from "@/config/firebase";
import {
	collection,
	getDocs,
	deleteDoc,
	doc,
	updateDoc,
	getDoc,
	query,
	where,
} from "firebase/firestore";
import CommunitiesTable from "@/components/admin/manage-communities/CommunitiesTable";
import Loading from "@/components/Loading";
import { useToast } from "@/components/hooks/use-toast";

export function ManageCommunities() {
	const { toast } = useToast();
	const [communities, setCommunities] = useState([]);
	const [selectedCommunity, setSelectedCommunity] = useState(null);
	const [isMobile, setIsMobile] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const fetchCommunityMembers = async (studentId) => {
		const q = query(
			collection(db, "users"),
			where("studentId", "==", studentId)
		);

		const res = await getDocs(q);

		if (!res.empty) {
			return res.docs[0].data();
		} else {
			return null;
		}
	};

	const getComEvents = async (comId) => {
		const res = await getDocs(
			collection(db, `communities/${comId}/events`)
		);

		if (!res.empty) {
			const filteredData = res.docs.map((doc) => ({
				...doc.data(),
				id: doc.id,
			}));
			return filteredData;
		} else {
			return null;
		}
	};

	const fetchCommunities = async () => {
		setIsLoading(true);
		try {
			const querySnapshot = await getDocs(collection(db, "communities"));
			const communitiesData = await Promise.all(
				querySnapshot.docs.map(async (doc) => {
					const data = doc.data();

					const leaderdata = await fetchCommunityMembers(data.leader);

					const events = await getComEvents(doc.id);

					const membersData = await Promise.all(
						(data.members || [])
							.filter((member) => member && member.studentId)
							.map(async (member) => {
								const memberData = await fetchCommunityMembers(
									member.studentId
								);
								return memberData
									? {
											...memberData,
											status: member.status || "member",
									  }
									: null;
							})
					);

					const validMembers = membersData.filter((m) => m !== null);

					return {
						id: doc.id,
						name: data.name,
						description: data.description,
						image: data.image,
						category: data.category,
						leader: leaderdata,
						members: validMembers,
						events: events,
					};
				})
			);
			setCommunities(communitiesData);
		} catch (error) {
			console.error("Error fetching communities:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchCommunities();

		return () => fetchCommunities();
	}, []);

	useEffect(() => {
		const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
		checkIfMobile();
		window.addEventListener("resize", checkIfMobile);
		return () => window.removeEventListener("resize", checkIfMobile);
	}, []);

	const handleDeleteCommunity = async (id) => {
		setIsLoading(true);
		try {
			await deleteDoc(doc(db, "communities", id));
			fetchCommunities();
			setSelectedCommunity(null);
		} catch (error) {
			console.error("Error deleting community:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleApproveMember = async (communityId, studentId) => {
		setIsLoading(true);
		try {
			const community = communities.find((c) => c.id === communityId);
			const memberApprovedData = community.members.find(
				(m) => m.studentId == studentId
			);
			const membersWithoutApprovedMember = community.members.filter(
				(m) => m.studentId !== studentId
			);

			memberApprovedData.status = "member";

			const newMembers = [
				...membersWithoutApprovedMember,
				memberApprovedData,
			].map((m) => ({ studentId: m.studentId, status: m.status }));

			await updateDoc(doc(db, "communities", communityId), {
				members: newMembers,
			});
			fetchCommunities();
		} catch (error) {
			console.error("Error approving member:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleRejectMember = async (communityId, studentId) => {
		setIsLoading(true);
		try {
			const community = communities.find((c) => c.id === communityId);
			const { id, ...updatedThisCommunity } = community;
			updatedThisCommunity.members = updatedThisCommunity.members
				.filter((m) => m.studentId !== studentId)
				.map((m) => ({ studentId: m.studentId, status: m.status }));

			updatedThisCommunity.leader = updatedThisCommunity.leader.studentId;

			await updateDoc(
				doc(db, "communities", communityId),
				updatedThisCommunity
			);

			fetchCommunities();
			toast({ title: "Successfully Reject!" });
		} catch (error) {
			console.error("Error rejecting member:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div>
			{isLoading && <Loading />}
			<div className="space-y-6">
				<div className="flex items-center">
					<h2 className="text-2xl font-semibold">Communities</h2>
				</div>
				{isMobile ? (
					<div>
						{communities?.map((community) => (
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
					<CommunitiesTable
						communities={communities}
						handleDeleteCommunity={handleDeleteCommunity}
						handleApproveMember={handleApproveMember}
						setSelectedCommunity={setSelectedCommunity}
						handleRejectMember={handleRejectMember}
					/>
				)}
			</div>
		</div>
	);
}
