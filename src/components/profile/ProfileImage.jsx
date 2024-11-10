import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { UserIcon } from "lucide-react";

const ProfileImage = ({ user }) => {
	return (
		<Avatar className="h-full w-full rounded-full border-4 border-white relative z-30">
			{!user.profileImage ? (
				<UserIcon className="w-full h-full" strokeWidth={1} />
			) : (
				<AvatarImage
					src={
						user.profileImage instanceof File
							? URL.createObjectURL(user.profileImage)
							: user.profileImage
					}
					alt={user?.fullName}
					className="object-cover"
				/>
			)}
		</Avatar>
	);
};
export default ProfileImage;
