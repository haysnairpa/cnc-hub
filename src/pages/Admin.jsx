import React, { useState, useEffect } from "react";
import { Layers, Users, Plus } from "lucide-react";
import { ManageCommunities } from "@/components/admin/ManageCommunities";
import { ManageUsers } from "@/components/admin/ManageUsers";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AddCommunity from "@/components/admin/AddCommunity";

export default function Admin() {
	const [activeTab, setActiveTab] = useState("communities");
	const [isMobile, setIsMobile] = useState(
		() => typeof window !== "undefined" && window.innerWidth < 968
	);

	useEffect(() => {
		const checkIfMobile = () => {
			setIsMobile(window.innerWidth < 968);
		};
		checkIfMobile(); // Run immediately
		window.addEventListener("resize", checkIfMobile);
		return () => window.removeEventListener("resize", checkIfMobile);
	}, []);

	const MenuItem = ({ value, icon, label }) => (
		<Button
			variant={activeTab === value ? "default" : "ghost"}
			className="w-full justify-start"
			onClick={() => setActiveTab(value)}
		>
			{icon}
			<span className="ml-2">{label}</span>
		</Button>
	);

	const tabItems = [
		{
			value: "communities",
			icon: <Layers className="h-4 w-4" />,
			label: "Manage Communities",
		},
		{
			value: "users",
			icon: <Users className="h-4 w-4" />,
			label: "Manage Users",
		},
		{
			value: "addCommunities",
			icon: <Plus className="h-4 w-4" />,
			label: "Add Communities",
		},
	];

	return (
		<div className="flex min-h-screen bg-background text-foreground">
			{/* Sidebar for desktop */}
			{!isMobile && (
				<aside className="fixed left-0 top-0 w-64 bg-card border-r min-h-screen">
					<ScrollArea className="h-full">
						<div className="p-4 pt-20">
							<div className="space-y-2">
								{tabItems.map((item) => (
									<MenuItem key={item.value} {...item} />
								))}
							</div>
						</div>
					</ScrollArea>
				</aside>
			)}

			{/* Main content */}
			<main
				className={`flex-1 p-6 mt-20 overflow-auto ${
					!isMobile && "ml-64"
				}`}
			>
				<div className="container">
					{isMobile && (
						<Tabs
							value={activeTab}
							onValueChange={setActiveTab}
							className="w-full mb-6"
						>
							<TabsList className="grid w-full grid-cols-3">
								{tabItems.map((item) => (
									<TabsTrigger
										key={item.value}
										value={item.value}
										className="flex items-center justify-center"
									>
										{item.icon}
										<span className="ml-2 hidden sm:inline">
											{item.label}
										</span>
									</TabsTrigger>
								))}
							</TabsList>
						</Tabs>
					)}

					<div className="overflow-x-auto">
						{activeTab === "communities" && <ManageCommunities />}
						{activeTab === "users" && <ManageUsers />}
						{activeTab === "addCommunities" && <AddCommunity />}
					</div>
				</div>
			</main>
		</div>
	);
}
