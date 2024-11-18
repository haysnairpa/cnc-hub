import React, { useState } from "react";
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
import EditCommunity from "@/components/admin/EditCommunity";

const CommunitiesTable = ({
	communities,
	handleDeleteCommunity,
	handleApproveMember,
	setSelectedCommunity,
	handleRejectMember,
}) => {
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [communityToEdit, setCommunityToEdit] = useState(null);

	const openEditDialog = (community) => {
		setCommunityToEdit({
			...community,
			leader: community.leader.studentId,
		});
		setEditDialogOpen(true);
	};

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Members</TableHead>
					<TableHead>Pending Members</TableHead>
					<TableHead>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{communities?.map((community) => (
					<TableRow key={community.id}>
						<TableCell>{community.name}</TableCell>
						<TableCell>
							{community?.members?.filter(
								(m) => m?.status === "member"
							).length + 1}
						</TableCell>
						<TableCell>
							{
								community?.members?.filter(
									(m) => m?.status === "pending"
								).length
							}
						</TableCell>
						<TableCell>
							<Dialog>
								<DialogTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											setSelectedCommunity(community)
										}
									>
										View Details
									</Button>
								</DialogTrigger>
								<DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
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
													<TableRow>
														<TableCell>
															{
																community
																	?.leader
																	?.fullName
															}{" "}
															(leader)
														</TableCell>
														<TableCell>
															{
																community
																	?.leader
																	?.email
															}
														</TableCell>
													</TableRow>
													{community?.members
														?.filter(
															(member) =>
																member &&
																member?.status ===
																	"member"
														)
														?.map((member) => (
															<TableRow
																key={
																	member.studentId
																}
															>
																<TableCell>
																	{
																		member?.fullName
																	}
																</TableCell>
																<TableCell>
																	{
																		member?.email
																	}
																</TableCell>
															</TableRow>
														))}
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
													{community?.members
														?.filter(
															(member) =>
																member.status ===
																"pending"
														)
														?.map((member) => (
															<TableRow
																key={
																	member.studentId
																}
															>
																<TableCell>
																	{
																		member.fullName
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
																				member.studentId
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
																				member.studentId
																			)
																		}
																	>
																		Reject
																	</Button>
																</TableCell>
															</TableRow>
														))}
												</TableBody>
											</Table>
										</div>
										<div className="flex justify-between">
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
											<Dialog
												open={editDialogOpen}
												onOpenChange={setEditDialogOpen}
											>
												<DialogTrigger asChild>
													<Button
														onClick={() =>
															openEditDialog(
																community
															)
														}
													>
														Edit Community
													</Button>
												</DialogTrigger>
												<DialogContent className="max-w-4xl max-h-[86vh] overflow-y-auto">
													<DialogHeader>
														<DialogTitle>
															Edit Community
														</DialogTitle>
													</DialogHeader>
													{communityToEdit && (
														<EditCommunity
															communityId={
																communityToEdit.id
															}
															initialData={
																communityToEdit
															}
															setEditDialogOpen={
																setEditDialogOpen
															}
														/>
													)}
												</DialogContent>
											</Dialog>
										</div>
									</div>
								</DialogContent>
							</Dialog>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

export default CommunitiesTable;
