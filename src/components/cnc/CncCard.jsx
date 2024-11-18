import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Users } from "lucide-react";

export default function CncCard({ cnc }) {
	return (
		<motion.div
			whileHover={{ y: -5 }}
			className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
		>
			<div className="relative aspect-[4/3] overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0 z-10" />
				<img
					src={cnc.logo}
					alt={cnc.name}
					className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
				/>
				<Badge className="absolute top-4 right-4 z-20 bg-white/80 text-black dark:bg-black/80 dark:text-white">
					{cnc.category}
				</Badge>
			</div>

			<div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
				<div>
					<h3 className="font-semibold text-lg sm:text-xl mb-2 line-clamp-1 text-gray-900 dark:text-gray-100">
						{cnc.name}
					</h3>
					<p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 sm:line-clamp-3">
						{cnc.shortDescription}
					</p>
				</div>

				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
					<div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
						<Users size={16} />
						<span>{cnc.memberCount} Members</span>
						{cnc.registrationOpen && (
							<Badge
								variant="outline"
								className="text-xs border-gray-300 text-gray-600 dark:border-gray-700 dark:text-gray-400"
							>
								Open
							</Badge>
						)}
					</div>
					<Button variant="outline" size="sm" asChild>
						<Link
							to={`/cnc/${cnc.id}`}
							className="flex items-center"
						>
							View Details
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-4 h-4 ml-1"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
								/>
							</svg>
						</Link>
					</Button>
				</div>
			</div>
		</motion.div>
	);
}
