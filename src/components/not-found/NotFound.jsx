import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
	const [mounted, setMounted] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
			<Card
				className={`w-full max-w-md transition-opacity duration-1000 ${
					mounted ? "opacity-100" : "opacity-0"
				}`}
			>
				<CardContent className="pt-6">
					<div className="text-center space-y-6">
						<h1 className="text-4xl font-bold tracking-tighter">
							Page Not Found
						</h1>
						<p className="text-lg text-muted-foreground">
							The page you're looking for doesn't exist.
						</p>
						<Button
							className="w-full"
							size="lg"
							onClick={() => navigate("/")}
						>
							Return Home
						</Button>
					</div>
				</CardContent>
			</Card>
			<footer className="mt-8 text-sm text-muted-foreground">
				© {new Date().getFullYear()} CnC Hub. All rights reserved.
			</footer>
		</div>
	);
}
