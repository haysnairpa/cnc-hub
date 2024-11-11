import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

const UserCard = ({ user, handleDeleteUser, handleBanUser }) => (
	<Card key={user.id} className="mb-4">
		<CardHeader>
			<CardTitle>{user.name}</CardTitle>
		</CardHeader>
		<CardContent>
			<p>
				<strong>Email:</strong> {user.email}
			</p>
			<p>
				<strong>Status:</strong> {user.status}
			</p>
			<p>
				<strong>Communities:</strong> {user.communities.join(", ")}
			</p>
			<div className="mt-4 space-x-2 flex  flex-wrap items-stretch">
				<Dialog>
					<DialogTrigger asChild>
						<Button variant="outline" size="sm">
							View Details
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>User Details</DialogTitle>
						</DialogHeader>
						<div className="space-y-4">
							<p>
								<strong>Name:</strong> {user.name}
							</p>
							<p>
								<strong>Email:</strong> {user.email}
							</p>
							<p>
								<strong>Status:</strong> {user.status}
							</p>
							<p>
								<strong>Communities:</strong>{" "}
								{user.communities.join(", ")}
							</p>
							<div className="flex items-center gap-3">
								<Button
									variant="destructive"
									size="sm"
									onClick={() => handleDeleteUser(user.id)}
								>
									Delete
								</Button>
								{user.status !== "Banned" ? (
									<Button
										variant="secondary"
										size="sm"
										onClick={() => handleBanUser(user.id)}
									>
										Ban
									</Button>
								) : (
									<Button
										size="sm"
										onClick={() => handleBanUser(user.id)}
									>
										Unban
									</Button>
								)}
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		</CardContent>
	</Card>
);

export default UserCard;
