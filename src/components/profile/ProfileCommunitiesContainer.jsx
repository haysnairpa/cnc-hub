import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const ProfileCommunitiesContainer = ({ communities }) => {
	return (
		<div className="mt-6 grid gap-6 sm:grid-cols-2">
			{communities.map((community) => (
				<Card
					key={community.id}
					className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
				>
					<CardHeader>
						<div className="flex justify-between items-center">
							<CardTitle className="text-lg font-semibold text-gray-800">
								{community.title}
							</CardTitle>
							<span className="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
								{community.category}
							</span>
						</div>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-gray-500">
							Members: {community.totalMembers}
						</p>
						<p className="mt-2 text-sm text-gray-700">
							{community.description}
						</p>
					</CardContent>
					<CardFooter>
						<Button
							onClick={() =>
								console.log(
									`Navigating to /cnc/${community.id}`
								)
							}
							className="w-full text-white"
						>
							View Details
						</Button>
					</CardFooter>
				</Card>
			))}
		</div>
	);
};
export default ProfileCommunitiesContainer;
