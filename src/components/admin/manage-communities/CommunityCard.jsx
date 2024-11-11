import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

const CommunityCard = ({
	community,
	setSelectedCommunity,
	handleApproveMember,
	handleDeleteCommunity,
	handleRejectMember,
}) => (
	<Card key={community.id} className="mb-4">
		<CardHeader>
			<CardTitle>{community.name}</CardTitle>
		</CardHeader>
		<CardContent>
			<p>
				<strong>Members:</strong> {community.members.length}
			</p>
			<p>
				<strong>Pending Members:</strong>{" "}
				{community.pendingMembers.length}
			</p>
			<div className="mt-4">
				<Dialog>
					<DialogTrigger asChild>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setSelectedCommunity(community)}
						>
							View Details
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-3xl">
						<DialogHeader>
							<DialogTitle>{community.name}</DialogTitle>
						</DialogHeader>
						<div className="mt-6 space-y-6">
							<div>
								<h3 className="text-lg font-semibold mb-2">
									Members
								</h3>
								<ul>
									{community.members.map((member) => (
										<li key={member.id}>
											{member.name} - {member.email}
										</li>
									))}
								</ul>
							</div>
							<div>
								<h3 className="text-lg font-semibold mb-2">
									Pending Members
								</h3>
								<ul>
									{community.pendingMembers.map((member) => (
										<li
											key={member.id}
											className="flex items-center justify-between mb-2"
										>
											<span>
												{member.name} - {member.email}
											</span>
											<div>
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
											</div>
										</li>
									))}
								</ul>
							</div>
							<Button
								variant="destructive"
								onClick={() =>
									handleDeleteCommunity(community.id)
								}
							>
								Delete Community
							</Button>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		</CardContent>
	</Card>
);

export default CommunityCard;
