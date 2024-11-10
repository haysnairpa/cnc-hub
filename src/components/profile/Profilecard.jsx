import ProfileImage from "@/components/profile/ProfileImage";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Camera, Pencil, X } from "lucide-react";

const Profilecard = ({
	user,
	editableUser,
	handleInputChange,
	handleEditToggle,
	handleSave,
	isEditing,
}) => {
	return (
		<Card className="bg-white shadow-lg rounded-2xl overflow-hidden">
			<CardHeader className="bg-black p-6">
				<div className="flex justify-between items-center">
					<div
						className={`h-16 w-16 bg-white rounded-full relative shadow-lg `}
					>
						{!isEditing ? (
							<ProfileImage user={user} />
						) : (
							<>
								<ProfileImage user={editableUser} />
								<label
									htmlFor="avatar-upload"
									className="absolute -bottom-1 -right-1 bg-indigo-100 text-indigo-800 p-2 rounded-full cursor-pointer z-50"
								>
									<Camera className="w-4 h-4" />
									<input
										id="avatar-upload"
										type="file"
										className="hidden"
										accept="image/*"
										onChange={(e) => {
											setEditableUser({
												...editableUser,
												profileImage:
													e.target.files?.[0],
											});
											console.log(e.target.files[0]);
										}}
									/>
								</label>
							</>
						)}
					</div>

					<Button
						variant="outline"
						size="icon"
						onClick={handleEditToggle}
						className="bg-white text-gray-800 hover:bg-gray-200 rounded-full"
					>
						{isEditing ? (
							<X className="h-4 w-4" />
						) : (
							<Pencil className="h-4 w-4" />
						)}
					</Button>
				</div>
			</CardHeader>
			<CardContent className="p-6">
				{isEditing ? (
					<div className="space-y-4">
						<div>
							<Label htmlFor="fullName">Full Name</Label>
							<Input
								id="fullName"
								name="fullName"
								value={editableUser.fullName}
								onChange={handleInputChange}
							/>
						</div>

						<div>
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								name="email"
								value={editableUser.email}
								className="bg-gray-100"
								disabled
								readOnly
							/>
						</div>
						<div>
							<Label htmlFor="studentId">Student ID</Label>
							<Input
								id="studentId"
								name="studentId"
								value={editableUser.studentId}
								className="bg-gray-100"
								readOnly
								disabled
							/>
						</div>
						<Button
							onClick={handleSave}
							className="w-full text-white"
						>
							Save Changes
						</Button>
					</div>
				) : (
					<div className="space-y-2">
						<h2 className="text-2xl font-bold text-gray-800">
							{user?.fullName}
						</h2>
						<p className="text-gray-600">{user?.email}</p>
						<p className="text-gray-600">
							Student ID: {user?.studentId}
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
};
export default Profilecard;
