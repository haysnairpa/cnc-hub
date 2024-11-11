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

const UserTable = ({ users, handleBanUser, handleDeleteUser }) => {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Email</TableHead>
					<TableHead>Status</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{users.map((user) => (
					<TableRow key={user.id}>
						<TableCell>{user.name}</TableCell>
						<TableCell>{user.email}</TableCell>
						<TableCell>{user.status}</TableCell>
						<TableCell>
							<div className="space-x-1">
								<Dialog>
									<DialogTrigger asChild>
										<Button variant="outline" size="sm">
											View Details
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>
												User Details
											</DialogTitle>
										</DialogHeader>
										<div className="space-y-4">
											<p>
												<strong>Name:</strong>{" "}
												{user.name}
											</p>
											<p>
												<strong>Email:</strong>{" "}
												{user.email}
											</p>
											<p>
												<strong>Status:</strong>{" "}
												{user.status}
											</p>
											<p>
												<strong>Communities:</strong>{" "}
												{user.communities.join(", ")}
											</p>
										</div>
										<div className="space-x-3 flex items-stretch">
											<Button
												variant="destructive"
												size="sm"
												onClick={() =>
													handleDeleteUser(user.id)
												}
											>
												Delete
											</Button>
											{user.status !== "Banned" ? (
												<Button
													variant="secondary"
													size="sm"
													onClick={() =>
														handleBanUser(user.id)
													}
												>
													Ban
												</Button>
											) : (
												<Button
													size="sm"
													onClick={() =>
														handleBanUser(user.id)
													}
												>
													Unban
												</Button>
											)}
										</div>
									</DialogContent>
								</Dialog>
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};
export default UserTable;
