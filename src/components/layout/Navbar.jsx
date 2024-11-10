import { Link } from "react-router-dom";
import { AuthModal } from "@/components/auth/AuthModal";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/contexts/AuthContext";

export function Navbar() {
	const [isScrolled, setIsScrolled] = useState(false);
	const { user, userData, isLoading, loadingFromAuth } = useAuth();

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 0);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const profileLink = userData?.role === "admin" ? "/admin" : "/profile";

	return (
		<nav
			className={cn(
				"fixed top-0 left-0 right-0 z-50 font-[Geist] transition-all duration-200",
				isScrolled
					? "bg-background/80 backdrop-blur-md border-b"
					: "bg-background border-b"
			)}
		>
			<div className="container mx-auto px-4 h-16 flex items-center justify-between">
				<Link to="/" className="font-bold text-xl">
					CnC Hub
				</Link>
				<AuthModal profileLink={profileLink} />
			</div>
		</nav>
	);
}
