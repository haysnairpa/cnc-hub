import { CncCard } from "@/components/cnc/CncCard";
import { SearchBar } from "@/components/search/SearchBar";
import { Footer } from "@/components/layout/Footer";
import { WavyBackground } from "@/components/ui/wavy-background";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";

export default function Home() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("");
	const [communities, setCommunities] = useState([]);
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const recommendedCategory = searchParams.get("recommended");

	useEffect(() => {
		const fetchCommunities = async () => {
			try {
				const querySnapshot = await getDocs(
					collection(db, "communities")
				);
				const communitiesData = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
					logo: doc.data().image,
					shortDescription: doc.data().description,
					memberCount: doc.data().members?.length + 1 || 0,
					registrationOpen: true,
				}));
				setCommunities(communitiesData);
			} catch (error) {
				console.log("Error fetching communities:", error);
			}
		};

		fetchCommunities();
	}, []);

	useEffect(() => {
		if (recommendedCategory) {
			setSelectedCategory(recommendedCategory);
			window.scrollTo({
				top: window.innerHeight,
				behavior: "smooth",
			});
		}
	}, [recommendedCategory]);

	const filteredCncs = communities.filter((cnc) => {
		const searchLower = searchQuery.toLowerCase();
		const matchesSearch =
			searchQuery === "" ||
			cnc.name.toLowerCase().includes(searchLower) ||
			cnc.shortDescription.toLowerCase().includes(searchLower);

		const matchesCategory =
			selectedCategory === "all" ||
			selectedCategory === "" ||
			cnc.category?.toLowerCase() === selectedCategory.toLowerCase();

		return matchesSearch && matchesCategory;
	});

	const scrollToContent = () => {
		navigate("/quiz");
	};

	return (
		<div className="min-h-screen flex flex-col font-[Geist] overflow-x-hidden">
			<WavyBackground className="h-screen flex items-center justify-center">
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="text-center space-y-8 px-4 max-w-4xl"
				>
					<h1 className="text-4xl md:text-7xl font-bold tracking-tight dark:text-white">
						Welcome, Presunivers!
					</h1>
					<p className="text-lg text-gray-700 md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
						Join the clubs and communities that align with your
						interests and talents at our university
					</p>
					<div className="flex flex-col items-center gap-8 pt-4">
						<Button
							size="lg"
							onClick={scrollToContent}
							className="text-base px-8 py-6"
						>
							Bring me
						</Button>
						<motion.button
							onClick={scrollToContent}
							animate={{ y: [0, 10, 0] }}
							transition={{ repeat: Infinity, duration: 1.5 }}
							className="text-muted-foreground hover:text-foreground transition-colors"
							aria-label="Scroll to content"
						>
							<ArrowDown size={24} />
						</motion.button>
					</div>
				</motion.div>
			</WavyBackground>

			<main className="flex-1">
				<div className="container mx-auto px-4 py-16 space-y-16 max-w-[1600px]">
					<SearchBar
						onSearch={setSearchQuery}
						onCategoryChange={setSelectedCategory}
					/>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
					>
						{filteredCncs.map((cnc) => (
							<CncCard key={cnc.id} cnc={cnc} />
						))}
					</motion.div>
				</div>
			</main>

			<Footer />
		</div>
	);
}
